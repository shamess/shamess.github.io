---
layout: post
title: This Week In Learnings 2023.1
date: 2022-12-23 08:04 +0000
---

* In Elm, you don't have to pass through an argument if you're just going to pass it to another function immediately:
  
  ```
  type Drink
    = Water
    | Cola { brand : String }
  
  mkCola : { brand : String } -> Drink
  mkCola =
      Cola
  ```
  
  This is a weird/fun situation where the signature actually makes the code look more complicated. The signature seems to
  demand something, which obviously isn't being received nor used in the method. But in reality, all that's really happening
  is `Cola { brand = "Pepsi"}` which is fairly normal to understand.

* [Making tree lists in CSS](https://iamkate.com/code/tree-views/) is pretty cool, from Kate Rose Morley. I remember years
  a blog post like that would have to come with a long list of browsers that the trick did and didn't work for. Now, I imagine
  all the ones we care about will work just fine. That's progress!
  
  Just an off the cuff thought: we'd never be in this position of compatibility if the EU hadn't gotten so upset about IE's
  monopoly. They'd have no pressure or interest in making Edge. (Swings and round abouts though. The EU also gave us cookie
  banners.)

* `sed` was behaving weirdly for me. Something about its OSX flavor meant I couldn't get the right format. Turns out, good,
  ole `perl` could handle it just fine though.
  
  `git show --pretty="format:" --name-only | xargs perl -i -pe's/Time.zone.now/Time.current/g'`
  
  This was after running the Rails/TimeZone Rubocop autofixer, and then we decided that Time.current is nicer.
  
* My studio space ("the factory") has a shared wifi, but it's very slow and broken most of the time. So I crossed my fingers
  and got an expensive 5G connection and hoped that the patchy coverage Nottingham currently has would only get better (quickly).
  Good news: it's really quite fast. Right now, it's 120Mb/s. I've seen it go up to 210Mb/s. The variability doesn't matter to
  me too much, so long as it stays above a certain threshold. Bad news: the latency can be awful. 600ms, and sometimes much worse.
  I can do work calls, but it's not entirely comfortable for anyone if it's a back-and-forth discussion.
  
  I'm hoping this is down to the lack of masts in my area. I'm in a factory facing _away_ from the town centre, where I bet all
  the masts are right now. 5g's biggest touted selling point isn't actually it's speed - it's supposed to be its latency. 1ms
  latency (to the mast, I guess?) is what people are excited about, but that only happens if masts are everywhere. Some councils
  are trialling putting masts in every street light, which I hope ends up being successful. (Huge win for councils who will be able
  to rent this space to the phone companies.)
  
  The model is from EE - "5G WiFi", QTAD52E. It's struggling with wifi at the moment and often has to been restarted. Oddly, restarting
  also sometimes increases the speed and qualitiy of the 5G connection too (which isn't how I assumed a 5G connection would work).
