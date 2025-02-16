---
layout: post
title: Turbo Streams and design
date: 2025-02-16 16:21 +0000
---

I've been using Turbo Streams a bunch the past few weeks, in two different projects.

The first for work (_the work one_) where I'm handling some backend validation of an image. You can see the 'placeholder' gap where you would upload your photo, the image with the validation message, and then the final image uploaded.

<div style="display: flex; justify-content: center;">
    <img src="/assets/turbo/the-work-one.gif" style="max-height: 400px; margin-left: 1em; max-width: 100%;" />
</div>

The second is for Mirth Gate (_the game one_), a web based game I'm making. You can see a bunch of interactivity here, all happening with background jobs triggering page updates. The health points here, and the actions being started by the mobs.

<div style="display: flex; justify-content: center;">
    <img src="/assets/turbo/the-game-one.gif" style="max-height: 400px; margin-left: 1em; text-align: center; max-width: 100%;" />
</div>

Weirdly, although both the work one and the game one heavily reference Turbo Streams, they're both working quite differently. The work one doesn't use Web Sockets at all, and is entirely TurboFramey bits acting like a stream.

They do both have a similar development style though, starting with the same steps.

## First, there is no Turbo.

One of the things I'm most excited about with Hotwire is that it's attempting to get back to very simple web pages. Pages where you click an `a href` and it send a request to a webserver and that sends you back the next page. Delightful, simple, easy to learn. Minimal debugging required.

That's why I largely recommend that you should write your controller and view the same as you always would. Assume that there's nothing fancy happening. Be at peace with one page loading after another. Sure, you want the validation message to update without refreshing the whole page, but right now, assume that the flow is 1) the user uploads the image causing the browser to do a post message then 2) the server redirects to a page with the validation error on it.

In both the work one and the game one adding Hotwire features is incremental. It's not like React where you have to think in a React way.

## Frames

Turbo Frames are one form of enhancement. You can wrap some content in a `<turbo-frame>` tag and then some behaviour within that tag will change; links and form submissions will make `fetch` request for the content and check to see if there's content that should be replaced within the frame.

With Frames, Rails will automatically ditch the layout rendering if it knows the call is for a Turbo Frame, since it'll likely only need the contexts of the `<turbo-frame>` to be loaded.

From Frames, we get an idea of what Turbo is doing. Intercepting actions which would normal cause a reload, 'upgrading' them to fetch requests, and then parsing the response to find how to alter the page. Rails handles this all pretty nicely, hiding most of the complexity away from you.

## Streams instead of Frame actions

Streams are very similar, except they can return a bunch of different kinds of actions. Their "view" file is quite different though (but remember that it should be additive, so keep the `response_to { format.html '' }` around too).

They're much more powerful than Frames and can affect multiple areas of the page _not limited to the DOM elements designated as Turbo ones_. Using _the work one_ as an example, there's what happens.

| Request | Response |
|---------|----------|
| User requests the Photo Uploader by going to the URL. | `UploaderController.index` loads, with all of the content of the page, including 8 spots to upload photos. Some of them are placeholders, some are already populated.<br /><br /> This'll render the `index.html.haml` view, but the placeholders and photos are all loaded from `_photo.html.haml`. We get this partial using normal Rails techniques: write the HTML for the photo straight into `index` and then refactor it to a partial. |
| Users uploads a photo to the placeholder, sending a normal POST request with a (hidden) `input type=file`. Turbo hijacks this to turn the request into a `fetch` request with an `Accept: text/vnd.turbo-stream.html` header added. | `UploaderController.create` is triggered and runs some validations on the photo. There are some validation issues. If this was a normal `Accept: text/html` then we'd redirect at this point, passing the validation errors (probably in a `flash`). However, with our `response_to { format.turbo_stream :create, locals: { photo: } }` we can return the chunk of HTML to be replaced in a Stream.<br /><br />Additionally, we also want to update the action of the 'Submit' button: it needs to open a modal to display the errors to get the user to double check. We can do that in the `_photo.turbo_stream.haml` file too! |
| User reviews the photo and submits it again, this time it's a PATCH to replace their current photo. Similarly, Turbo will upgrade this to a `text/vnd.turbo-stream.html` event. | `UploaderController.update` runs and is happy with the new photo. `format.turbo_stream :photo, locals: { photo:, all_errors: }` can now remove the additional modal behaviour on 'Submit' and display the picture nicely. |

*The key thing here is that I think it's very easy to think 'turbo first' and you'd end up with a different - clunkier - architecture.* Whilst developing, keep in mind simple CRUD actions and Turbo Frames, Streams, etc fit nicely on top of them.

Based on what we needed for the `html` version of the view, we can pluck out the bits we need to be made dynamic. We saw in the above example that the Stream needs to update the photo and the submission button's modal. How does it do that?

Here's what `app/views/uploader/photo.turbo_stream.haml` might look like:

```
= turbo_stream.replace "photo-#{photo.id}" do
  = render partial: :photo, locals: { photo: }

- if photo.errors.any?
  = turbo_stream.append "photo-submission-modal-wrapper" do
    = render partial: :photo_submission_modal, locals: { errors: all_errors }
- else
  = turbo_stream.remove "photo-submission-modal"
```

There's not really any magic in here. The `turbo_stream` helper just outputs a `<turbo_stream>` and template HTML tag that Turbo is looking for on the client side.

The `photo_submission_modal` partial is created the same way we created the photo partial: extract it from `index.html.haml` as needed. So long as it has an ID, the 'append' action will figure out if it should append or replace the item inside the target.

## Streams as Web Sockets (pushed content updates)

The Turbo Frame + Streams implementation described above works great in the normal flow of a user clicking something and then Turbo intercepting it and handling it. Very web.

Turbo Streams also work with content being pushed to the browser over websockets. This is the realm of _the game one_. The game has queued up actions (which are just ActiveJobs) that finish a few seconds after being scheduled. Another example is when another user interacts with the page to trigger an action. The "primary" user isn't clicking the browser or anything but still needs to know that an action reduced their health points. To do that, we use Web Sockets.

This doesn't really have a RESTful analogy, so my advice about iteratively adding in Turbo doesn't apply here. However, you can still rely on many of the standard Rails things you'd do normally.

I'm using Streams via the available 'broadcast_to' methods that are accessible in controllers and models (and I expect where ever you include the right module). For that, I'm using a very normal looking partial.

```
<div id="<%= "Participant_Player_#{player.id}" %>">
  <p class="name">You</p>
  <div class="meta">
    Your HP: <span><%= player.health_points %></span>/<%= player.max_health_points %>.
  </div>
</div>

<% if defined?(include_stream) && include_stream %>
  <%= turbo_stream_from "Encounter_Player_#{player.id}" %>
<% end %>
```

And I have this broadcast whenever the player's health changes.

```
  after_commit :broadcast_encounter_player_change, if: -> { encounter_participant && previous_changes.keys.include?('health_points') }

  def broadcast_encounter_player_change
    return unless encounter_participant

    broadcast_replace_to(
      "Encounter_Player_#{id}",
      partial: "encounter_participants/player",
      locals: { player: self },
      target: "Participant_Player_#{id}"
    )
  end
```

That'll behave a lot like a `turbo_stream.replace("Encounter_Player_#{id}")` that we've seen above.

One trick I've had to implement here is the `include_stream` variable. When outputting this partial for the first time (on the `player.html.erb` view) then I will pass 'true' to get the stream to be initiated. Without that guard, it'll create a new WebSocket for each one! That nukes Firefox very quickly.

## Lets see if I remember my point

The key take away is that you shouldn't be fighting against what Rails does best: CRUDy stuff with views, controllers, and models. There are some rough edges to Hotwire still, for sure. However, if you find yourself bending over backwards to do something outside that typical stuff, then it's probably you're going wrong somewhere.

<hr />

<style>
    aside {
        background-color: #f9f9f9;
        border-left: 5px solid #ccc;
        padding: 0.5em;
        margin: 1em 0;
    }
</style>

<aside>
    <h1>Now is the time to jump the Kindle ship</h1>

    <p>Amazon still stop allowing you to down your ebooks to your computer soon - towards the end of February. So, if you're like me and have been thinking about leaving the Kindle ecosystem for a while, this might be the pressure you need to do it, so you can carry your books away with you. <a href="https://d20.social/@Edent@mastodon.social/114002593604252427">edent on mastodon</a> has a good thread on switching to Kobo, including references to Kobo's price match scheme, where they'll refund the difference plus 10%.</p>
</aside>

<aside>
    <h1>Elite Ice Hockey and the Panthers</h1>

    <p>My incredibly generous neighbour finally got me to go and watch some ice hockey with them. The event started off the day before where they had me and my partner around to their house to show us a game and tell us the rules, so we were prepared for everything that was to happen. You don't really need preparing, it turns out, but it was a very warming thing to have done. The spirit of an ice hockey match is quite nice. The games in Nottingham are mostly sold out, so there are around 7500 people watching which makes for a huge sense of community. Chanting and cheering on alongside so many other people is very unifying. Especially over something that isn't incredibly serious.</p>
    <p>If you live near a team, I'd recommend going to see a game. It's a good time.</p>
</aside>

<aside>
    <h1>Is this therapy?</h1>

    <p>I have a new engineering manager which was a nervous experience to begin with. I really feel my previous EM understood me and the way I wanted to progress and losing that relationship and empathy was worrying. Turns out, I had nothing to worry about. My manager is fantastic! I was a bit worried when they wanted to do an arts-and-crafts style activity in one of our one-to-ones though. They had eight or so pictorials that they wanted me to order, ranked by importance to me. Things like 'Salary', 'Respect', 'Impact', 'Mastery'. I thought this was quite silly to start with, but whilst doing it I discovered somethings about myself.</p>
    <p>It also made me realise that carwow is giving me _exactly_ the kind of workplace I want with the the things that drive me best.</p>
    <p>This was a fairly important breakthrough for me because I'd recently been wondering if I hated working for someone else. It was weighing on me a lot. But realising that carwow is essentially the perfect place for me to be (right now) I had to re-evaluate what was making me so frustrated with working. Now, I realise that I'm just really pissed off at having to spend so much of my life at work, when I have so many other objectives. Now that's a <em>complete different problem</em> that I can be tackling with a number of tactics, which I hadn't thought about at all before because I'd assumed it was just the working for someone else that was the problem.</p>
    <p>So, I want to focus on being more careful with my time and making the most of it outside of working hours. There's plenty of unfulfilling time (waiting for a bus, playing a video game a little longer than I'm actually enjoying it for, walking into town to buy lunch, filling my week with other activities that are fun but not fulfilling) that I can be using to work on my own projects. I'm going to try and be more mindful of that.</p>
    <p>In the future, I may also seek to renegotiate my working hours or even take some time off work.</p>
</aside>
