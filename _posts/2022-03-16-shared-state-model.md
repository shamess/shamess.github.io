---
layout: post
title: Shared State Model
date: 2022-03-16 18:03 +0000
---

Hello, I've invented something I'm calling _the shared state model_ pattern for
React applications.

I've got this default App that Expo very kindly gave me, which I've been
building on and building on with no restraint. It has to keep track of the
player, the monsters, the dungeon, the rooms in the dungeon, the room the
player is in the dungeon, and at least two other things.

It also needs a bunch of callbacks that are used for child components to update
that state.[^redux] All this adds up to a lot of code hanging around the App.

Here's a simple version of the problem:

<p class="codepen" data-height="481" data-default-tab="js,result" data-slug-hash="mdpepLw" data-user="technicallyshane" style="height: 481px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/technicallyshane/pen/mdpepLw">
  Shared State Model: The Problem</a> by shane (<a href="https://codepen.io/technicallyshane">@technicallyshane</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

One of the things we can do is move the actions you might do to a Player into
their own object.

We can start throwing in all sorts of bits about the Player, like their health
and whatnot.

<p class="codepen" data-height="379" data-default-tab="js,result" data-slug-hash="OJzyQLw" data-user="technicallyshane" style="height: 379px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/technicallyshane/pen/OJzyQLw">
  Shared State Model: The Model</a> by shane (<a href="https://codepen.io/technicallyshane">@technicallyshane</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

The problem now is that it's very likely that the two will fall out of sync.
Someone might call `this.player.heal` reasonably assuming that the view would
also update. But it won't.[^redux-again]

But what happens if we pass in the ability to update the state from the
App?[^what]

<p class="codepen" data-height="417" data-default-tab="js,result" data-slug-hash="xxpwYOg" data-user="technicallyshane" style="height: 417px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/technicallyshane/pen/xxpwYOg">
  Shared State Model: The Solution???</a> by shane (<a href="https://codepen.io/technicallyshane">@technicallyshane</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Here, we begin treating the Player like a model which auto-updates to its
datastore. The React state gets updated regardless of who is calling
`player.heal`.

Of course, if you want React to realise it needs to re-render, components
should always be passed the `this.state` based value.

App.js is very small now!

I don't know how well this will scale, but so far it's been fine![^reluctance]

[^redux]: Hold on, Shane. It sounds like you probably just need Redux. It's
    specifically designed so you don't need to pass -- [^ssh1]

[^ssh1]: _Ssshh._

[^redux-again]: So you're going to add Redux into that object, right? At least
    look at the documentation. Shane???

[^what]: What? Oh, no.

[^reluctance]: _I really couldn't tell you why I did this, rather than just
    learning how to implement Redux._
