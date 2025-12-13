---
layout: post
title: Stop Staring at the Code
date: 2025-12-13 22:35 +0000
---

I have this feature in my Docker registry tool that lists the tags that belong to a blob. You can change the tag in the select box to update the copy-and-pasteable commands in the templates below. That seems to have stopped working. Lets figure out why.

![A dropdown with only 'latest' shown](/assets/tollport-tags-only-listing-default.png)

Double checking there actually is a bug is the first thing to do here. Are there actually multiple tags for that image? Lets force some to make sure.

```bash
shane@macbook tollport/ (main) % docker build . --tag localhost:5500/tollport:latest --tag localhost:5500/tollport:foobar
[... succesful build]
shane@macbook tollport/ (main) % docker image ls | grep "localhost:5500/tollport"
localhost:5500/tollport                         foobar            e56d8f086145   41 seconds ago   996MB
localhost:5500/tollport                         latest            e56d8f086145   41 seconds ago   996MB
shane@macbook tollport/ (main) % docker push localhost:5500/tollport --all-tags
The push refers to repository [localhost:5500/tollport]
4ce9944a219f: Pushed
[...]
foobar: digest: sha256:5ad2945213f1dbfea3d478bf7e27704c5e7e71a4779c3675ce280a6e71878e03 size: 2422
4ce9944a219f: Pushed
[...]
latest: digest: sha256:5ad2945213f1dbfea3d478bf7e27704c5e7e71a4779c3675ce280a6e71878e03 size: 2422
```

Definitely two tags there now. How's that dropdown looking? → Still just the default 'latest' value in there. That confirms our bug.

How am I expecting that dropdown list to get populated?

```ruby
  # app/controllers/repositories_controller.rb
  def show
    tags = Distribution::RepositoryTags.new(repository, current_user).tags
    tags = [ "latest" ] if tags.empty?

    render :show, locals: {
      repository:,
      tags:
    }
  end
  
  # app/lib/distribution/repository_tags.rb
  ENDPOINT = "/v2/<name>/tags/list".freeze

  def tags
    tags_response = client.get(endpoint)

    tags_response.fetch("tags", [])
  end
```

Since we're seeing the default "latest" value only, we can fairly assume that we're hitting the second argument of that `fetch`: whatever the client is returning, it doesn't have any tags in it. What is it actually returning? Some jiggery-pokery is required to see the request response, so excuse this.

```ruby
shane@macbook tollport/ (main) % docker compose exec -it web bin/rails c
Loading development environment (Rails 8.1.1)
tollport(dev):001> repository = Repository.where(slug: 'tollport').first
tollport(dev):002> Distribution::RepositoryTags.new(repository, repository.maintainer).tags # whilst we're here, lets confirm...
[...]
=> [] # yep!
tollport(dev):003> Distribution::RepositoryTags.new(repository, repository.maintainer).send(:client).get("/v2/tollport/tags/list")
  PersonalAccessToken Create (1.7ms)  INSERT INTO "personal_access_tokens" ("user_id", "token", "created_at", "updated_at", "name", "blanket", "pull_access", "push_access") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "id"  [["user_id", 1], ["token", "[FILTERED]"], ["created_at", "2025-12-13 20:58:37.615714"], ["updated_at", "2025-12-13 20:58:37.615714"], ["name", "Service token"], ["blanket", true], ["pull_access", "{}"], ["push_access", "{}"]]
  [... some loading of users and repositories]
🛳️ Authenticating with {:iss=>"tollport", :sub=>"1", :aud=>"tollport-registry", :exp=>1765663117, :nbf=>1765659517, :iat=>1765659517, :jti=>"4222bd92-41d8-4f9e-91ab-8dc1275f46bd", :access=>[{:type=>"repository", :name=>"tollport", :actions=>["pull", "push"]}]}
  PersonalAccessToken Destroy (1.6ms)  DELETE FROM "personal_access_tokens" WHERE "personal_access_tokens"."id" = $1  [["id", 82]]
=> {"errors"=>[{"code"=>"UNAUTHORIZED", "message"=>"authentication required", "detail"=>[{"Type"=>"repository", "Class"=>"", "Name"=>"tollport", "Action"=>"pull"}]}]}
```

Well, there we go. That answers a few questions. There certainly *are no `tags` returned*. Plus, we know that the auth has gone wrong somewhere.

This is a real heart sinking feeling because getting the auth working in the first place was tonnes of trying to understand how to implement JWTs. I guess at this point we have to recap how all that works. From memory for the moment. (A note from a few minutes in the future: writing this up was a struggle, which might be indicative of the bug and is certainly indicative that I'm not on solid ground here.)

- **PersonalAccessTokens** are a Tollport concept, much like an API key. Users create these keys and allow them to have push and/or pull access to specific repositories.
- The user logs into their docker client using their username and an API key.
- When `docker` CLI attempts an action, Tollport's registry will send the PAT to Tollport, who returns a JWT with permissions detailed.

That flow (using docker CLI) is all working, as we saw I'm able to push images just fine. This flow, where the server is using the Distribution API rather than going via the CLI like a user would, is a little different.

1. A request is made to `"/v2/<name>/tags/list"`, with an Authorization header.
	- The auth header is a JWT token, listing the permissions required. Specifically, the permission required is "type: registry, name: catalog", with pull access to each of the relevant repositories.
	- As this is a special, internal call I do something sneaky: I create a "blanket" PAT token. I call these service tokens.
	- That's a token where the user (or the system in this case) doesn't care to define granular access and will just allow access to everything.
	- After it's used, it gets deleted.
- The registry then decodes the ... (narrator: it is at this moment that Shane realised the bug) JWT and sends the PAT token across to the normal auth endpoint, just to double check it's all kosher.
	- So, the token is generated by the Railsy bit of Tollport, and then sent to the registry, and then the registry confirms it with Tollport.

Here's what I think the issue is: I delete the special service token before that cycle is finished using it.

Indeed take a look at this:

```ruby
module Distribution
  class RepositoryTags
    [...]

    def tags
      tags_response = client.get(endpoint)

      tags_response.fetch("tags", [])
    end

    private

    def client
      @client ||= Client.new(ENV.fetch("TOLLPORT_REGISTRY_URI"), auth_token:)
    end

	[...]

    def auth_token
      user.with_service_token do |personal_access_token|
        AuthToken.new(personal_access_token:).token(repository.name)
      end
    end
  end
end
```

`auth_token` gets the service token from the User, and generates the JWT with it. Lets see what that does.

```ruby
  def with_service_token
    token = personal_access_tokens.create(name: "Service token", blanket: true)

    yield token

    token.destroy
  end
```

Yikes! So before I get a chance to send it to the registry, the PAT required to authenticate the JWT has been deleted.

Lets confirm that by... not deleting the token for a moment.

![A dropdown with foobar and latest shown](/assets/tollport-multiple-tags-available.png)

Okay - that's good news! Lets add back the destroy and move around the scope of the key.

```ruby
shane@macbook tollport/ (main) % git diff
diff --git a/app/lib/distribution/repository_tags.rb b/app/lib/distribution/repository_tags.rb
index fd2fa65..4ff20af 100644
--- a/app/lib/distribution/repository_tags.rb
+++ b/app/lib/distribution/repository_tags.rb
@@ -18,17 +18,20 @@ module Distribution
     private

     def client
-      @client ||= Client.new(ENV.fetch("TOLLPORT_REGISTRY_URI"), auth_token:)
+      user.with_service_token do |personal_access_token|
+        Client.new(
+          ENV.fetch("TOLLPORT_REGISTRY_URI"),
+          auth_token: auth_token(personal_access_token:)
+        )
+      end
     end

     def endpoint
       ENDPOINT.gsub("<name>", repository.name)
     end

-    def auth_token
-      user.with_service_token do |personal_access_token|
-        AuthToken.new(personal_access_token:).token(repository.name)
-      end
+    def auth_token(personal_access_token:)
+      AuthToken.new(personal_access_token:).token(repository.name)
     end
   end
 end
diff --git a/app/models/user.rb b/app/models/user.rb
index 66db028..c0e3304 100644
--- a/app/models/user.rb
+++ b/app/models/user.rb
@@ -27,9 +27,11 @@ class User < ApplicationRecord
   def with_service_token
     token = personal_access_tokens.create(name: "Service token", blanket: true)

-    yield token
+    result = yield token

     token.destroy
+
+    result
   end
```

Nice nice. That works.

## Okay?

There's no way that this particular bug will occur for someone else (or at least, no way someone searching for a solution will find this page). So the question of "why did I bother writing this?" is a good one. The lesson I'm hoping to spread here is that debugging is just about asking questions of your code.

Here's my flow:

1. Prove to yourself the bug is real and that it hasn't been misrepresented.
	- It feels dreadful for spend an hour debugging an issue that was reported only to realise... there's no bug at all.
	- If you cannot prove to yourself that the bug is real, you also cannot be sure you've resolved the bug.
- Ask a question of the code.
- Find evidence to answer the question.
	- If you make an assumption, and skip finding evidence, there's a Sod's Law chance that that is exactly where your bug is.
- Lead that answer to the next question.
- Keep going until it's clear what happened.

Sometimes, you'll find yourself staring at the code. In these times (and you may not realise this at the time) you're simply hoping that the bug will jump out at you. Unguided code reading is a waste of time. Debugging is an *active* activity, not a passive one.

Ask a question and answer that question.
