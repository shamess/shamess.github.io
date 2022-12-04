---
layout: post
title: The simplest alternative to Trello
date: 2022-07-23 16:48 +0100
---

I've invented a groundbreaking method of project management for tiny-to-small
projects which will let you code at the speed of thought, without any over
complicated tools getting in the way. What's better: it's totally free.[^free]

It's just index cards.

Trello is very exciting. Especially if you like processes. And for your own
personal project, you can go as wild as you like. It can auto-archive your
"done" cards for you after a few days, let you add comments and labels and
colours and stickers and background images, it's got checklists, its got
buttons that you can hook up to arbitrary action combinations, it's got
automated rules, it's got friggin email reports. Wonderful! Hours of fun.

But I keep finding myself getting wrapped up in those process changes and
wasting a huge amount of time. I'll come across a bug and think "oh, lemme stop
everything and record that in Trello before I forget".[^wiki]

My coding project time is often limited to half-and-hour a day, and even
logging into Trello takes a few moments of that.

Instead, now I do this:

<link href="https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap" rel="stylesheet"> 
<style>
  .indexCard {
    background-color: #D7D7D7;
    width: 15.1cm;
    height: 10.1cm;

    font-family: 'Reenie Beanie', cursive;
    font-size: 16pt;

    position: relative;

    margin: 3em 0;
    filter: drop-shadow(9px 8px 4px #2b2b2f);
  }

  .indexCard .project {
    padding: 0.2cm 0 0 0.4cm;
    border-bottom: 0.02cm solid #6e7fc4;

    margin-bottom: 0.575cm;
  }

  .indexCard .type {
    position: absolute;
    right: 0.7cm;
    top: 0.3cm;
  }

  .indexCard .line {
    padding-left: 1.1cm;

    border-top: 0.01cm solid #767C7C;

    height: 0.6cm;
  }

  .indexCard .error {
    text-decoration: line-through
  }

  .indexCard .correction {
    position: absolute;
    top: 50px;
    left: 118px;
  }

  .indexCard .insert {
    position: absolute;
    top: 99px;
    left: 270px;
  }

  .indexCard .caret {
    position: absolute;
    top: 123px;
    left: 288px;
    font-size: 12pt;
  }
</style>

<div class="indexCard">
  <div class="project">Institute</div>
  <div class="type">Features <span type="page">3</span></div>

  <div class="line">☐ World<span class="error">Building</span> should be restricted to Admin users</div>
  <span class="correction">Editor</span>
  <div class="line">☑ Should be able to paste an Image that automat. gets base64'd</div>
  <div class="line">☐ Don't link to admin location in Quest view</div>
  <span class="caret">^</span>
  <span class="insert">user's</span> 
  <div class="line">☑ WE: Quest show + create</div>
  <div class="line">☑ WE: Toggle show/hide player locations</div>
  <div class="line">☑ WE: Items controller</div>
  <div class="line">☐ When adding seconds, should be able to toggle to minutes instead</div>
  <div class="line">☐ Journeys should go from stop to stop -> why? -> potential to</div>
  <div class="line"> discover something</div>
  <div class="line">☐ Distance between stops should affect travel time</div>
  <div class="line">☑ WE: Creating new location should redirect to it</div>
  <div class="line">☑ WE: Show nearby locations after creating new one</div>
  <div class="line"></div>
  <div class="line"></div>
</div>

(This look eerly like a real index card, right? Thank you. It almost certainly
will not work nicely on a small screen.)

* Top left is for the project name, since these cards typically live together,
  but have been known to stray.
* Top right and the index number (useful for referencing on other cards) and
  the type of card. This is particularly cool feature to ensure progress
  continues in a decent direction and allows changing mindset when tired.
  "Features", "Bugs", "UI/UX", "Testing", "Quality" and "Dev ops" are the
  labels I usually have. Tick a checkbox, then put that card to the back of the
  stack. You've done a Feature, your next task is a Bug. Now you get to work on
  something fresh and unrelated and at the same time, you've prioritised
  technical debt!
* [I love me a good handdrawn checkbox.][notebook]

Edits are very quick. Adding something new to the list is immediate and
thoughtless. You can close a browser tab.

There have been some synching issues: I once forgot my index cards at the
Factory. That resolved itself pretty well though: I just started a new batch of
cards and merged them later.

Ingredients:

* [Silvine record cards - £3.99](https://www.ryman.co.uk/silvine-record-cards-126x77mm-ruled-pack-of-100-1)
* [Uniball fine - £11.99 for 5 ](https://www.ryman.co.uk/uni-ball-eye-medium-pen-black-pack-of-5) [^micro]

<div style="margin-top: 90px;"></div>

Footnotes:

[^free]: If you have a stationary supplies cupboard in your office and an
    officer manager that doesn't mind things going missing.

[^micro]: I previously gave a good review for the Micro, which I retract.

[^wiki]: I got myself excited about a creative writing wiki, like
    [SCP](https://scp-wiki.wikidot.com/), that I could just do world building in,
    and see if any stories come out of it. "Nice!" I thought to myself. "But
    maybe we could write one of the pages in a Word doc first? Just to save the
    $5 on Digital Oceans droplets." "Nevermind then," I immediately thought. I
    think I was more excited about setting up a Wiki than actually doing anything
    with it.

[notebook]: https://technicallyshane.com/2022/01/25/manual-note-taking.html
