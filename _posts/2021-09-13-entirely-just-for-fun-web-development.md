---
layout: post
title: Entirely just for fun web development
date: 2021-09-13 00:06 +0100
---

I decided to make [a tourist website for a made up island][fido].

I enjoy web dev, but I always end up a few sessions into a project and realise "this is just a crummy Evernote" or "Overcast already has that feature". It takes all the wind out of my sails and my brain quickly decides that video games are a better use of that time. So, I decided to do something utterly useless that can just be about building a website.

It's not very often that web developers make new websites, at least not in the realms I'm usually working in. In my past three companies, I've worked on a specific product, iterating it and making it better. This doesn't leave many oportunities to start from a good ole html5 boilerplate. (Not that I want to be doing that frequently - I love the nature of my professional work.)

## "boilerplate"

This is absolutely old-man-yells-at-clouds territory, but when I was learning to build basic HTML websites as a lad, I didn't have the internet. I had the downloaded PHP docs, a "Save website as..." copy of a website talking about HTML basics, which included all the styling I ever needed.

Over the years we've standardised, cleaned up, and in many ways things are easier now.

The basis of any valid html5 page is this:

```
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>html5 boilerplate</title>
	</head>

	<body id="home">
		<h1>a simple page</h1>

	</body>
</html>
```

Back in the early 2010's, there would also be some browser normalising CSS stylesheet, which feels less important these days.

The above is just long enough to not fit into my memory, especially as I mentioned it's rare I'm writting this kind of HTML. So, I have to search for it. Back in my day, the above was called "html5 boilerplate" but _that_ term appears to be a popular web framework now. It comes complete with analytics tracking, Facebook integrations, enhanced "reset" CSS scripts, and more.

I don't know where novices are supposed to start, these days. If I had to contend with webpack as a kid, I think I'd be an accountant now.

### Further reading

* [Eric Meyer's normalised CSS script](https://meyerweb.com/eric/tools/css/reset/), which I remember frequently Googling for some time ago.
* [CSS Wizardry also making this point](https://csswizardry.com/2011/01/the-real-html5-boilerplate/), over a decade ago. You come to this blog for all the hottest takes on trending topics.

## "the grid"

A hobby of mine that's taken a backburner for the moment is admiring print design. Something that came over from that world and into web design some years ago was working to a grid; imagine your page is split into a dozen columns, and aligning your content to those columns is visually appealing. Clean.

People did this technique by carefully manipulating their margins.

These days, "the grid" is fully supported within CSS. Having your content aligned in this way is fairly simple now, for the most part.

However, it's not fullproof and sometimes still requires some hacking around it.

For instance, on my header bar are some navigation links. These are formatted as `<li>`s, which I believe is still fairly common. I wanted these list items to go from left to right, on the same line, the width of each being the width of a grid column.

```
<header>
	<div class="logo">Costa Fido</div>

	<nav>
		<ul>
			<li><a>Events</a></li>
			<li><a>Beaches</a></li>
			<li><a>Hotels</a></li>
			<li><a>Travel</a></li>
		</ul>
	</nav>
</header>
```

The problem I immediately bumped into is that whilst `div` and `nav` are subject to `header`'s `display: grid`, the `li`s know nothing about it, nor the width of a column.

I could only resolve this by going back to the olden way of doing it: `display: inline-block` and fool around with widths and margins until it looked about right. (And it only looks right at the exact resolution I'm working at.)

### Further reading

* [The Explorers Company talking about the grid in print](https://www.theexplorersco.com/home/2019/7/20/exploring-layout).

## "void", self-closing, and made up tags

The website has a big image that takes up the full height of the above-fold. I think this is called a "hero image". So maybe I could use a `<hero>` tag. However, there was to be no content in this tag. So, I went with a self-closing `<hero />`. There are two problems with this:

1. Whilst I had it in my head that html5 was alright with made up tags - mostly because of how many new tags were added in the past few years - the validator still expects just a standard set. So, I changed this to `<div class="hero" />`.
2. The second problem persisted after this change though. Turns out, self-closing tags (or void tags, as they're known in the spec) are only possible for a very limited number of tags. Anything else is a syntax error.

The behaviour of problem two surprised me: the content collapsed to 0px high, at least on first glance as I couldn't see my background image. I tried to add `display: block;` to this, thinking that maybe CSS thought void tags as always inline. This was wrong too.

What had actually happened was that the browser tried to fix the invalid XML, by making the rest of the page a child of `<div class="hero"></div>`. It assumed I'd just forgotten to close the div. As that class only had a background image, it was hidden under the subsequent background images.

### Further reading

* [The spec listing the 14 void elements.](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)
* [The spec explainging problem 2.](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-non-void-html-element-start-tag-with-trailing-solidus)

## Middle aligning content

I really thought this was a problem that had gone away.

I had some content in a div which I wanted to vertically align to the middle of that div.

The left half a 12 column grid is taken up by the headline for the content on the right half. This headline is taller than the right-hand content, so I wanted the right-hand content to middle itself.

```
<div class="emmery">
	<div class="lead">32 years of the <em>Emmery Awards</em> – the best is yet to come.</div>
	<div>
		<p>This month, starting July 16th, brings the island the event ...</p>
		<p>Lets take a wander through history at some of the highlights ...</p>
	</div>
</div>
```

I tried a bunch - randomly switching between `align-self`, `align-content`, and `align-items` - but haven't been able to figure out the right words to move it.

Who knew after all this time was still an unsolved problem.

### Further reading

* [`grid` reference site suggesting it is a solved problem.](https://css-tricks.com/snippets/css/complete-guide-grid/#align-self)

## Responsive layouts

I didn't try working on that this time, and the layout only works at exactly the width I have my browser set to. This isn't even full screen, so good luck finding the best viewing experience.

I'm surprised by a number of behaviours though. For instance I have a particular image (the final image of the page) which is supposed to be full height of the grid, but for whatever reason it very rarely is. :shrug:

[fido]: https://costafido.vaguelyshane.com/
