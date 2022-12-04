---
layout: post
title: Worknotes - May
date: 2021-05-28 18:30 +0100
---

An Altmetric friend this month suggested that I focus on just one or two projects. I realise now, writing this, I did not listen to that advice and have likely paid the cost for it...

## jekyll

I've been editing and posting new blog posts in various places using Jekyll this week. I would typically write posts and have Marked open besides it, but it doesn't support image tags like Jekyll does, so it's best to use `jekyll serve` which hosts the blog locally. Of course then, I lose the automatic reloading of content as I'm writing, but to fix that I wrote this which I just add to all posts whilst writing them:

```
<script>
  setTimeout(() => { window.location.reload() }, 5000);
</script>
```

I was initially very confused why I couldn't just do `setTimeout(window.location.reload, 5000)`, but that suffers from the rebinding bug which React users are familiar with. I know very little about language design but what are the risks with fixing that in the language? A function, by default, could be bound with the instance that created it.

I just mention this because one day I'll forget to remove this snippet and it'll bug everyone who finds it.

**Huge update.** [Mudge][mudge] proves his weight in gold once again by pointing out that you can do `jekyll serve -l` and it auto-reloads.

## Writers' Apprentice

This month is the start of [my podcast series][podcast] about writing and The Handmaid's Tale.

I've been writing this for the past year or so - on and off. I'm glad I've gotten to the point where I can start recording and releasing it.

The weekly cycle has been going well. Fridays are release days, and Mondays are recording days.

The episodes are usually around 10-15 minutes. When recording is done, I usually have half an hour of audio, full of me repeating myself and mouthnoises. I'm learning the bits required for quality as I'm going: speaking correctly, audio equipment, and editing. I think these have improved as I've gone on.

I'm very fortunate that I don't mind the sound of my own voice.

## Kata

I've been doing codewars, as a bit of deliberate practice. I've managed to learn something everytime I've completed one, even the incredibly simple ones.

Looking through other solutions is also interesting. There's so much codegolf in there, where people are working hard to write a one liner for the whole exercise. I wonder if that's how they always write code. I largely [try to keep things nice looking][kata]. Longer, rather than wider, to the annoyance of many `Metrics::BlockLength` cops.

## Hours passing quickly

I've been working on one Rails-React project, which I'm enjoying. The boiler plate some times is getting boring, and often the copy and paste nature of it introduces bugs. But it's all very low stress, which is nice and enjoyable.

I've been working from the UI first, rather than the database. Hard coded data, in the `render` of the Component. Then, move that to state or props (depending on where that data is coming from). At this stage, you can see exactly what data you need and what it should look like. Then exposing that data, as needed, in Rails.

I've stumbled by indulging in writing ERDs for models, only to find that a relationship is inverted in reality. I'm not even sure TDD would catch this.

## Book binding

I spent a number of hours folding, gluing, stitching, and stretching materials into a handbound, blank notebook.

I have made a mistake, and the book does not open flat. The endpapers in my work behave different from the endpapers in every other hardback book I own. I think reality has distorted. It's the only explanation.

I'll make another. It was nice.

Stay calm, everyone. Enjoy the sun.

[podcast]: https://anchor.fm/writers-apprentice
[kata]: https://www.codewars.com/users/haikushane/completed_solutions
[mudge]: https://mudge.name/
