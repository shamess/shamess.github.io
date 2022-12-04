---
layout: post
title: Manual Note Taking and Task Management
date: 2022-01-25 18:15 +0000
---

My notepad of choice is the [Mnemosyne N195][notebook] and I mostly use a
bullet journal style system.

## Mnemosyne N195

It's A5, ruled, with the lines layed out in a clean design that don't draw
attention to themselves. They do give some structure by suggesting a place for
a date and page title. All printed content - the lines and small labels - have
a bleed (in the design sense of the word) of a few millimeters. This is ideal
as edge-to-edge lines are often used to hide sloopiness in printing. This
notebook is printed with confidence. The lines are predominantly dashes, very
close knit. Two solid lines (plus a solid head and tail line) are used to split
the lines into three sections. These sections can be ignored easily and treated
as normal lines. I believe this technique adds little to the utility of the
book, and barely alters the aesthetic. Or, maybe the dashed lines feel less
overwhelming.

The paper stock feels premium and is slightly glossy, but I've never suffered
from any feathering when using a fountain pen with quink. There is
minimal-to-zero bleed too (in the paper sens of the word). I write with a
uni-ball eye fine[^pen] or a Parker fountain pen, and have never seen either
bleed. I'm told it's 80gsm, but I'm not sure I buy that; it feels heavier.

It's wirebound and is backed by two plastic covers. These are black and only
slightly coarse; I use a white chalk pen to label them. The pages are
microperferated. You'll want to fold the page along those perferations before
you can cleanly pull the page away, but I would suggest not doing that. The 80
pages, especially once the book has been given time to breath, match the height
of the wire binding well enough that it does not impeed writing when using the
left hand side once the book is folded to a single open sheet.

I've no idea where I first found this notebook. It may well have been muji,
before they had their own brand. I now buy these notebooks in bulk, as I use
them daily. They're inexpensive, for some reason. Typically around £6.[^amazon]

## Using the page

There are a few key elements I add to each page: project labels, right-aligned
dates, bullet-boxes.

### Project labels

Until recently, I never used the left hand page. I can't think of any
mitigating reason why I'd do this. Maybe I hadn't realised, like I have
mentioned above, that the book opened 360' was flat enough to hide the wire
binding, making the left hand page almost identical to the right.

Fortunately, the daily use for me is to record my objectives for the day, and I
rarely need to look backwards more than few pages. This has meant that I've
started going back through old books and filling in the left hand page. For the
past few months I've been doing Carwow work right alongside Altmetric work,
which has a certain charm to it. I'm not sure it's enough to make this double
pass method of journal usage a common thing for me, but I'm enjoying it right
now. [^history]

It sometimes means that the Carwow page from yesterday is three or four pages
from the next blank page, which meant introducing the newest element to how I
use the page.

I've always treated the top line as the top border of the page. Rarely have I
ever marked above that line. This reluctance stretched back to my MyBuilder
days too, so every notebook I pick up has a spare line right at the the top.
I've been using this to mark the project I was working on when filling in the
page. I've been backfilling the pages too. Many pages now are labeled
"Altmetric" on the top row. Some pages have more than one topic, which just get
appended. The line is long enough. "Altmetric, ProjectX2."

Its standardised position makes it very fast to flick through to find the last
mention of a certain project. Or, in the future, when I come across an ERD I'm
able to tell which of my dozens of dead projects it was for.

### Dates

The date are written right aligned, on a fresh line. This completely ignores
the square "date" box the notebook provides.

Dates are crucial for the rare times when you need to look back at what's
you've done; retros are more common, but self appraisals are more important
since these might span six months of time.[^brag]

Whilst I've mentioned that Altmetric (2021) might be running alongside Carwow
(2022), the chronological order of the two is always consistant. Following one
project from page to page will always go forwards in time.

If I do need to go back a few days to update a note, I'll try to use a
different pen. I cycle through my fountain pen, and black and blue uni-ball
eyes.[^s]

Multiple dates appear on the same page. A fresh page each day might sound
romantic but is wasteful. I don't say this for paper saving reasons, but more
because you'll look back at the massive chunks of whitespace, unable to fit
anything useful in and be frustrated. Fully inked pages are beautiful.

## Task tracking

I often feel like my mind is a golden retriever, looking up at me and begging
to go for a walk or a treat. If I have a brief moment of downtime, where the
next task isn't clear, that damn puppy wins. To counter that, I make lists so
there's always another thing to move onto.

It's imperitive that the task be within my control to move forwards. There
shouldn't be any tasks on the list which need someone else to do something
before I can tick it. For instance, say I've been given a ticket to do:

> Allow user to log in with biometrics.

My first job will be to note down the things I need to focus on here:

> ▢ Add 'biometrics' gem.
>
> ▢ Ensure the new log in path is tested.

Both those jobs are something I can do without waiting on anyone else. Once
they're done, the next task might be:

> ▢ Get the code reviewed and merged.

This is problematic as this isn't a task for me. A large chunk of that depends
on another developer - when they have a natural stopping point and time to
look. Instead, the correct task would be:

> ▢ Raise the pull request and leave a message in the team chat.

Then, I can resolve the task and move onto my next item. The issue with the
passive to-do item is that it eventually leads to four or five tasks but
nothing to do but wait. In that situation, the dog wins.

The task list gets populated frequently. To name a few times:

* First thing in the morning, by reviewing the team's open tickets,
* When an interupt comes in via Slack or some such,[^pomo]
* After a task has been completed,
* During a meeting.[^meeting]

It's imperitive that the list does not run dry.

The size of the task doesn't particularly matter. Before starting on a large
task, it's natural to break down (at least) the first steps. I keep adding more
tasks until the initial task is complete. These "child" tasks simply get
indented a little. (But not too much - that left hanging whitespace is
unrecoverable.)

These child tasks are common enough to always leave one line between tasks,
unless you know there's no need for follow up.

> ☑ Clean up users table

> ↳ 17 rows removed

Very rarely, when I'm drawing towards the end of a chunk of work (and it's
difficult to populate tasks), I will leave a note describing the next chunk of
work, even if I've not considered the steps required yet.

> • Next priority: Figure out how to encrypt biometrics

This is a note left with the best of intentions to lead me onto the next topic,
and not distraction.

A note on language, I would never actually write that full sentence. More
likely is:

> • Next: encrypt biometrics?

This just leaves space to add a follow on note if needed, since the line after
it will likely be immediately used up by a new task.

> • Next: encrypt biometrics? → Sam mentioned bcrypt?

### Bullet-style

You'll note the squre alongside the task items. It would be fair to say that
this feels like Bullet journaling but that system has gotten too much credit
over the years for what often amounts to simple checkboxes.

Drawing a square - a little smaller than the height of the line - is easy
enough for anyone to do. It requires no artistry. The square does not even have
to be square, though it should not be lazy enough to be mistaken for a circle.
This is for two reasons: a circle is very useful to work as an ad-hoc checkbox
when the need for something-that-isn't-a-task needs a checkbox; second, it's
difficult to use the other symbols we'll come to shortly inside of a circle.

This square means the task is yet to be done. When the task is done, it can be
checked with a tick. ☑[^check]

A task that was not complete but no longer needs to be done should be crossed
out. ☒ 

A task you've decided not to do should be crossed out entirely, with a single
line across the text also. A single line is important in this case, as the text
should still be legible. It implies that you've deliberately decided not to do
the task.

A task you've mistakenly written down and regret its presence should be crossed
out twice, or eagerly scribbled over.

A right-facing arrow drawn through the middle of the box, with the arrow head
poking out the rightside,[^failed] means "carried forwards to tomorrow". This
marking should not be done until the next day - you never know if you'll find a
burst of energy in the evening to continue the task, or if by the morning the
task should be ☒'d out.

Bullets are used for normal notes.

## Frames

These are rare, but look lovely.

Frames, like HTML fieldsets with labels, are useful for grouping notes that
aren't task items.

<pre>
┌────── User login flow ───────┐
│ sign up -> add bio -> login  │
└──────────────────────────────┘
</pre>

Honestly, they're just visual but are something I like to add so wanted to mention here.

[notebook]: https://www.cultpens.com/i/q/MM50966/mnemosyne-195-basic-notebook-ruled-a5

[^amazon]: I stopped buying them from Amazon in 2018, and have consistently found them
    cheaper from indie stationers.

[^history]: This was something we would do in History class, I remember. The
    teacher treated the writing books as if she were paying for them herself, so
    insisted on filling in every line. She did not care about if that was a
    single line on Henry VIII put between two paragraphs about Ancient Egypt. The
    aim was to fill every space with ink. She'd review the book before giving you
    a new one. "Try to write smaller next time." This completely devalued the
    class for me. There was no possible way to revise from a book written like
    this - was this entire class just here to waste time as we copy from the
    blackboard?

[^pen]: I accidentally bought a micro, rather than fine, recently. It's brilliant!

[^s]: This gives the feel of _S_, a Doug Dorst and JJ Abrams meta-fiction.

[^pomo]: When working in pomodoro sprints, the task list is also populated with
    distractions. Many Pomodoro users think that 25 minutes followed by 5 minutes
    pause is the only part of the technique. But the idea of quickly capturing
    your distractions is also crucial. Distractions include "what song is this?",
    "did I turn on the dish washer?", "I think that's a bug", or "I should get
    another cup of tea". These kind of thoughts plague me throughout the whole 25
    minutes unless I know they've been captured.

[^check]: The UTF-8 check is useful to have but it should be known that it's
    much more rewarding to do a tick that escapes the box. Enjoy the action.

[^failed]: UTF-8 has failed me.

[^meeting]: Take notes of your questions during meetings. These are the bits
    you find interesting. They may be answered in the next few seconds. This is
    okay. You'll also be admired by the presenter when they stop for questsions,
    and you have one.

[^brag]: Keeping notes of what you've done is something I tried to get my line
    reports to do, but it was never taken up. This was always odd to me because
    it's very obviously a list of acheivements you take in with you when asking
    for a pay rise. At Carwow we're encouraged to keep a "brag doc", which is
    literally for this purpose.
