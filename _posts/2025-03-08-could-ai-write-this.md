---
layout: post
title: Could AI write THIS?
date: 2025-03-08 14:22 +0000
---

As I’m sitting down to write this, thinking about what kinds of AI I’ve bumped
into at work alone I’m quite surprised. This is the kind of buzz (and I’m
pretty sure it’s still buzzy rather than anything yet useful) that crypto only
hoped it could have. Four, or possibly five, different AI services being
trialled or used in earnest that I’m aware of at my company.

I know this isn’t limited to just my company either, as other friends have
recently talked about it being introduced in companies which aren’t strictly
tech companies.

It’s not hard to see why. For one thing, it’s pretty flashy branding. It’s cool
to say you’re on the bandwagon. (Oddly though, [people do not trust products
which feature AI in their marketing](https://www.tandfonline.com/doi/full/10.1080/19368623.2024.2368040).)

I work for a scale up company that’s eager to grow in the market as fast as we
can, so the idea of AI is interesting. There are some manual labour tasks which
we need to be able to do more of, or less of, depending on demand. It’s not
entirely about avoiding hiring more people (although that’s a huge advantage),
but if we hire those people, what do they do on quiet days? The traditional
answer is using third-party labour, which is what we’ve done so far. (I just
made up that term – I’ve no idea how they’d like to be referred to.) We have an
agency who can make phone calls for us, or of late do some Mechanical Turk
style work where we can increase or decrease how many people we need. There are
cumbersome disadvantages to doing this though: change is very slow. A new
“script” for the agency to follow can take literal days for them to implement.
At my place, we love a good A/B test, and it’s so difficult to quickly spin up
a test when there’s a multiple day lag for the agency to catch up (and then
when the test ends, retrain them again without the test section).

If that could all be AI’d away, we could respond to change in demand of our
service much faster. (Disclaimer here: I’ve no idea how the company feels about
this internally, or if there are any such thoughts or plans. I’m not anywhere
near the decision making for this. I’m just talking about ideas here and not
specific situations.)

There are a number of discussions happening about how we can better use AI, so
I’ve been investigating a few solutions in the market. Some of them, I’m unsure
need “AI” at all. It’s become one of my go-to things in meetings now. “This
doesn’t need to be AI.” This isn’t just an anti-AI sentiment, but a financial
one too. One company was charging a _shocking_ amount of money to provide
analysis of something (I’m going to be intentionally vague here), and that
shocking amount was _per analysis_. We did some quality checking of their API and
found that their accuracy was around 40%. Another part of the company was
shocked by this (because contracts with the supplier promised higher, but also
because they really wanted to use the software) and so did their own analysis:
manually going through thousands of samples. They found the accuracy was much
lower than 40% when judged by their expert eye.

These systems are just shit. Shit and exorbitantly expensive. They’re not
expensive because they’re greedy. They’re expensive because it costs a lot do
to do these analyses. They’re not price gouging. It’s just really hard to do at
a reasonable cost. And _still_ achieving lofty highs of 20% accuracy. Now I’m
just ranting but one service provider gave us such bad answers to the questions
we asked it, that we realised it was much more accurate if we just inverted
everything it said.

I was telling this story at dinner last night and I end it with my pet peeve:
“The frustrating part about this whole thing is that it doesn’t even need AI.
It just needed OCR technology from the 1980’s, and we’d be fine. We could run
it in house, on a Raspberry Pi and pay nothing.”

Then one of my very wise friends said, “Well, OCR is just a type of AI.”

Well, I have to tell you reader that I was shocked. So shocked I did a really
bad job at what I believe AI to be, which is why I’m writing this here now, to
get some thinking straight. I turned to my partner for help and all he said
was, “I think it’s a marketing buzzword for something that doesn’t exist.” Even
more shocked. On one single table we had opinions stretching from ‘it doesn’t
exist’ to ‘we’ve had it since 1914’.

Which tells me that the whole thing is bollocks anyway, but here’s what I’ve
decided my line is:

**Artificial Intelligence, at least in this part of the century, is something
that is capable of being given more training data which leads to it being more
accurate. This modelled data is not logic-tree based, but is attribute based,
and the AI decides which attributes lead to the desired outcomes.**

Optical character recognition has no training data. You can’t give it more
training data to improve its accuracy. It does not deal in heuristics. It’s in
fact several technologies which run, one-after-another in a pipeline that
eventually leads to the machine being able to make a decision about what is in
front of it.

Given an arbitrary piece of paper with writing on it, the OCR software would
first try to remove “skew”. That’s a particular piece of software written by a
developer that picks up a row of pixels and offsets it until the pixels are in
a less slanty shape. Nothing heuristic here. “When counting, one by one, what
percentage of pixels are in a line?” That’s it. Next, it’ll try to increase the
contrast to get rid of shadows and really make that line pop. That’s just a
slider, like you see in Photoshop.

You can’t increase the size of its training set. There is no training set.

Eventually, it realises that this set of pixels matches quite nicely with this
known set of pixels for the letter “r” and it returns that.

It's all incredibly deterministic (because someone wrote it) to the point where
you can do the whole thing by hand if you wanted to. Just follow the
instructions in the code.

AI (GAI?) would not handle character recognition like that. In fact, it likely
wouldn’t bother with characters. Now, I actually don’t know how it works, but
here’s my layman’s explanation. It takes a bunch of data points about the image
being given. It checks through its model to see if those attributes are
familiar to it. “Yep, this looks like it might be a menu. I’ve seen many menus
with similar characteristics.” Then it’ll try and Sherlock its way to
understanding what’s in front of it. “That seems to be something that looks
like chopsticks. So maybe this is an Asian menu.” Piecing it all together,
it’ll realise that it’s seen hundreds of menus like this, and the line you want
specifically is usually where the ramen is. “I’ve seen lots of menus with something
that looks like ‘chicken’ is near something that looks like ‘soup’. So probably
it’s ramen.” And then it’ll give you a percentage. “0.78: Ramen noodles.”

Just like Sherlock, if you let it eat up more well labelled information, it can
get more and more certain because it can make to more similar occurrences of
those same heuristics.

A developer is still involved in building the model, by saying things like “pay
less attention to the table cloth colour” or “the EXIF data on the photo is
really important”, but the developer is not deciding logic paths that the AI
will take.

In earlier parts of this century, we have talked about AI before in gaming, for
instance. “Enemy AI” is a thing, but I bet we’d feel less comfortable calling
that AI now. It’s not learning. It’s just a really big decision tree – still
deterministic and logic. Sometimes you end up in [surprising areas of that logic
tree](https://www.pcgamer.com/how-cats-get-drunk-in-dwarf-fortress-and-why-its-creators-havent-figured-out-time-travel-yet/), where multiple factors overlap on top of each other, but it’s not a
learning beast.
