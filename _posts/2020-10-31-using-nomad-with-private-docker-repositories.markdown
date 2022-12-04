---
layout: post
title:  "Using Nomad with private Docker repositories"
date:   2020-10-31 11:37:05 +0000
---

Here's the situation. You've done the [starting tutorial][0] and got your nomad "cluster" running on one machine. You've [hidden the web UI][1]. You've even created a Dockerfile for your application. Now you're ready to get it running!

## Where to put it?

I think there are only two places you might think of. [Dockerhub][2] and [Amazon's ECR][ecr].

The perk of Dockerhub is that everything sort of just works. You pay them $5 a month, you send them the Dockerfile, they make the image for you, and you can just pop your image name in your jobspec.

This is cool because a Dockerfile is much smaller to upload than an image, and Dockerhub can process it much faster than you. It's very simple to [provide your username and password to authenticate][4].

I didn't use this method though, so can't say for sure.

## Elastic Container Registry

I went with the slightly more complicated ECR _just_ because it's cheaper. For someone likely using it as little as me, it'll work out free most months. If you download less than 1Gb per month, remembering that Docker will cache images too, it'll cost you nothing.

It's more difficult to set up though.

### Uploading the image

This is fairly simple but has a number of potentially intimidating steps throughout. Stick with it!

[Install the aws cli tool][awscli] whereever you want to build your image. You'll need to set up a user (via the IAM) service, which has at least `AmazonEC2ContainerRegistryFullAccess` priveledges. Once you've done that and have access to the key and secret, run `aws configure` to pop those in.

Then you'll need to create a repository in [ECR][ecr]. You'll have a repository per project (per git repo, for instance, likely). Hit "View push commands" and it'll give you all the commands you need to build and push your image. Thanks, AWS!

You should see your image has been uploaded.

### Authenticating with ECR

#### Configure AWS

Just like on your local machine, you need to [install the aws cli tools][awscli] on your droplet. You want to make _a different user_ with much fewer access rights via IAM, just like before. This time, they only need permissions for `AmazonEC2ContainerRegistryReadOnly`. (When you accidentally leak your AWS credentials on a live stream or copy-and-pasted code sample, it'll be much cheaper for you this way.)

Again, `aws configure` and use your new details. Do this on every server you're running a client on. (Which is just the one for me, right now.)

#### Configure Nomad

_I've just been told that there's a package which magically does some of the stuff below. I've not looked into it any further, but [here you go][credhelp]._

We need to add some configuration to our Nomad client agents. That'll be your `client1.hcl` files from the tutorial. You'll need to stop and restart it before the changes will be picked up, remember.

```
plugin "docker" {
  config {
    auth {
      config = "/etc/docker_auth"
    }
  }
}
```

(You'll have some `gc` config in there too, which I left. I've no idea what it does.)

This tells nomad that whenever we're fetching Docker images, check that path for config around authentication.

Have your `/etc/docker_auth` look something like the below. You'll need to change the URL to whatever your ECR account URL is; this includes your account ID and region.

```
{
  "credHelpers": {
    "3848482828.dkr.ecr.eu-west-1.amazonaws.com": "ecr-login"
  }
}
```

Now, whenever Nomad tries to pull down images (or rather, has Docker do it) it'll check the hostname of the image and run the auth through `ecr-login` first. This is hinting at another file you need to make - with some magic involved.

The file you need to make needs to be:

* named `docker-credential-ecr-login`; Nomad will prepend the script with `docker-credential-`
* executable; `chmod +x /usr/local/bin/docker-credential-ecr-login`
* be on your path; `PATH=$PATH:/usr/local/bin` in `.bashrc` and `source .bashrc` to reload it

It needs to output to stdout a chunk of JSON. My utterly messy script looks like this:

```
#!/bin/bash

PASSWORD=`aws --region eu-west-1 ecr get-login-password`

echo '{'
echo '"Username": "AWS",'
echo "\"Secret\": \"${PASSWORD}\""
echo '}'
```

The username must be "AWS". The password is generated from `aws cli`.

After this, you should see that your jobspec can happily refer to an ECR hosted image and download without any auth failures.

```
image = "036666666667.dkr.ecr.eu-west-1.amazonaws.com/simple-app:latest"
```

If you do run into any errors, really carefully read the nomad client output. It's incredibly busy in there, but will help you if you can spend enough time to spot what you're looking for.

#### Can I just `docker login` like I did locally?

I think you're [supposed to be able to][awsauth], but this didn't work for me.

I've no idea how long the output of `get-login-password` stays valid for. I expect it expires eventually and so one day you'll be surprised when your allocations start failing.

On top of getting a warning about the password being stored in plain text (though this doesn't matter; `aws config` is already doing this), it still couldn't authenticate for me. The above is the only thing that worked.

[0]: https://learn.hashicorp.com/collections/nomad/get-started
[1]: https://technicallyshane.com/2020/10/30/nomad-ui-left-wide-open.html
[2]: https://hub.docker.com/
[ecr]: https://aws.amazon.com/ecr/
[4]: https://www.nomadproject.io/docs/drivers/docker#authentication
[awscli]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[awsauth]: https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth
[credhelp]: https://github.com/awslabs/amazon-ecr-credential-helper
