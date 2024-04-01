---
layout: post
title: I made a website
date: 2024-04-01 14:57 +0100
---

*I've just released [shane.computer](https://shane.computer) which is and old-school Internet homepage, and email address that I'm hoping is coherent over the phone.*

Over the past week I've been working on putting together a new website. There are a few motivations for this.

The biggest one is that my current email address (leafcanvas.com) isn't exactly what I wanted when I first started using it. I originally though *leafcanvas* was a lovely name for my contracting company. Flowery, natural, and artistic. It quite quickly didn't work out. The estate agent who was setting up or first London flat said, "is this a drug thing? The landlord won't like that." And I never ended up doing any contract work, so the website became a gardening blog (which lasted about as long as my enthusiasm for gardening lasted). The final problem with it was that it's impossible to hear over the phone. The two words are so out of context from each other that even people reading it back to me don't realise it's two words.


<style>
.note {
	width: 35%;
	float: right;
	background-color: #c8c2c2;
	padding: 20px;
	margin: 20px;
}
</style>
<div class="note">
	<b>Why shane.computer?</b>
	<p>I wanted 'Shane' in there because someone asking for it probably already has my name in front of them. They can spell that!</p>
	<p>My first try last week was shane.city - quirky and fun - but *immediately* my RPG group misheard it as 'shane.sissy' which is ... unfortunate.</p>
	<p>shane.computer is two words that I don't think can be misheard and everyone knows how to spell computer, hopefully.</p>
</div>

So, since I was buying the domain anyway, I figured it should have a website in case people check that. I've recently been loving travelling the routes of the old Internet, feeling like a survivalist following tracks. Following links from people's blogs, to other people's blogs, from there to a cool gallery of simple sites. An interlinked web without an algorithm! It's nice to be apart of that.

## Writing

My first instinct was to open index.html and start typing, but I fought it and decided to go step by step.

I still write long form stuff in Word. I'm very comfortable with it, and I trust its spellchecking more than Obsidian or the browser.

I had fun writing this page. It's not very professional or particularly well written, but I liked the vibe as I started rolling and sort of kept with it. Remember that basically no one will ever see this page. :shrug:

## Design

Again I reached for index.html, but I've been down that road before and I know where it leads. Trying to get CSS to work whilst designing at the same time doesn't work well for me. At work, I really enjoy being given an image to work from (or more recently a Figma or Whimsicle design - what a wonderful world we live in!). I also really enjoy fooling around with Affinity Publisher so this was a good excuse.

Here's the design:

![A screenshot of the design](/assets/shane-computer-design-2024.png)

You can see that it matches up with the webpage really quite well!

I also managed to bust open Affinity Designer to make this logos!

None of these skills are in my wheelhouse, but I had a bunch of fun.

## Code (desktop)

Really please that I'd written the copy first, and had a design to hit the ground running with, coding up the HTML was a peace of cake. Copy and pasting galore, throwing in some divs which seemed to group the content as expected.

I'm really disappointed in the differences in font rendering engines though. Although Affinity shows this beautiful font weight ("normal") there's no  way to get the browser to have the same look, regardless of which weight I set it to.

### Nested CSS

What a blooming delight coding for the web is right now! We have access to nested CSS - I got to use many of the fun features of SASS without a pre-compilation steps.

Bad news was that it didn't work as expected in Chrome or Safari, [unless you're right up to date](https://blog.logrocket.com/native-css-nesting/). Which I wasn't, so had to spend some time upgraded my OS. After that, it all worked!

I coded this using lots of fixed widths which meant the page didn't really fit on a smaller screen.

## Code (mobile)

No worries though: it was a simple matter of changing all the `width: 740px;` into `width: 100%; max-width: 740px;` and suddenly it was mobile friendly!

I got very excited about [container queries](https://www.smashingmagazine.com/2021/05/complete-guide-css-container-queries/). Ultimately though, the page is simple enough that I could have just used media queries and not been fussed about it. Out of an eagerness to play around with them though, I had to wrap the entire content in a `wrapper` element ( :( ) and then could do container queries based on that. It's fairly redundant though.

I was disappointed to find that you can't do nested container queries. By which I mean this (which, to be clear **is not valid syntax**):

```css
.intro {
  display: grid;

  grid-template-columns: 74% 26%;

  @container (width < 740px) {
    grid-template-columns: 1fr;
  }
}
```

I spent a while trying to do this syntax without realising it was just wrong. Debugging CSS that doesn't work still has essentially no tooling. (Debugging why something looks odd is just fine - but there appears to be no in-browser linting.)

## Deploy

Super simple. I spent half a moment wondering about keeping a "clean" system and having this website in its own Docker, before realising that's just silly. Instead I:

- Rsync it up to `/var/www/shane.computer` on my fancy new Hetzner server (1/3rd the price of Digital Ocean droplets I previously had running).
- Set up nginx with a new `sites-enabled`, just delivering static files. No proxy or fancy `location` blocks required.
- Run certbot for SSL.
- Live!

This is how we used to host websites back in the day, kids. Still works.

I discounted Github Pages because there's no need for them to be involved here. They could only get in the way.

## DNS

Easy - one A record added.

I did for a moment think about adding the AAAA record, since Hetzner tells me I have one. But I tried to add it and hover said it was invalid, so I didn't bother looking any further. It looks like `2a01:4f9:2b:f48::/64`. I've never had to work with an IPv6 address before, other than once to disable it on my 5g model because my work VPN didn't work with it. I also don't particularly feel the professional need to understand it any more than I currently do. IPv6 - a failed experiment? We'll see!

I used [hover.com](https://hover.com/4aJR7hRd), who I've never had a problem with. I have been with them for decades at this point though. I remember signing up with them after they advertised on a podcast, or maybe even as far back as [the diggnation days](https://web.archive.org/web/20050806014644/http://revision3.com/diggnation). If there's any reason to switch, I could be persuaded. Is there any innovation or feature I could be missing out on? I can't think of anything that a DNS provider could do that I don't get from Hover, but maybe I've had my head buried in the sand. [(Let me know over here if you're happy elsewhere.)](https://d20.social/@shane/112196294938128159)

With that, the website is up and ready and done!

## Email

The whole point, of course. This is super easy. I use [Proton](https://pr.tn/ref/VYK1K91F0BX0). They tell you which DNS records to set up: some MX records, something about sunscreen to stop the light from the sun interferring, DKIM for some reason, and then DMARC which I think they might have made up. After setting those up, encrypted email works! Great stuff.

Loads of fun. Go make websites! And then link to another website. For instance, here's [a webpage about some random guy's thoughts on offline dev docs](https://mccd.space/posts/search-internet/). Go and wander.
