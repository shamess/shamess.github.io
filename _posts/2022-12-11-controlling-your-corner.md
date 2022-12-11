---
layout: post
title: Controlling your corner (or, The Importance of DNS)
date: 2022-12-11 14:00 +0000
---

Imagine you’ve lived in your home for fifteen years when your kind and welcoming next door neighbour decides it’s time for them to downsize; their always polite child has gone off to university and they just don’t need all that space now. (Not to mention that someone has just made a ridiculous offer on their house, paying way over the odds for it, and it’d be silly to not accept it.)

You wish them the best of luck. They exchange keys and you welcome your new neighbour. Well, don’t you know it, it appears to be Bill Findemann, vocalist and oft-time drummer, for heavy metal band Bammstein. “Nice to meet you,” he says as he’s handing a bottle of wine to ingratiate himself. “I have to warn you though, I’m going to be practising here quite a lot. Don’t worry: I’m going to soundproof the whole semi-detached property. You won’t hear a thing.”

He said this quite sincerely, but it appears his heart wasn’t quite in it. You see, it turns out that Bill is a “musical absolutist” and he really hates to see any music muted out. Even when you have to call the police out to give him a polite suggestion that he keep the noise down a bit, his heart wants what his heart wants. He just has to play. The pounding continues and seems to get worse over time.

Well, you don’t want to move. All your stuff is here. Nearly two decades of photos and thousands of novels that you’ve written on the very walls of the building. Not to mention the other neighbours are fine – you have bbq’s with them each year, there’s a delicate net-zero exchange of Roses and Quality Street that rings around the cul de sac, sometimes you watch the ISS passing together on times its particularly visible.

Wouldn’t it be wonderful if you could just lift up your house, put it somewhere nicer, and still have all the stuff in it and remain close with your neighbours?

<hr />

In the past month I’ve made two large changes to my online presence that have got me excited about the Internet again: I moved away from Twitter and migrated my primary email away from Google.

Both come from my concerns around the [Shrunken Internet], and it was thanks to Elon’s push that made me get around to it.

**I decided to leave twitter because I can no longer enjoy it, both functionally and ethically.** It’s become impossible to control what appears in my Twitter stream. In order to keep your feed busy it invents reasons to show you tweets: “you’ve talked about D&D before so here’s someone talking about it who you’ve never heard of.” Wide swaths of the D&D community are awful. Worse, those awful tweeters are the ones which drive engagement the most, and so they’re the ones shown, unrequested.

The new leadership at Twitter intends to double down on this, under the belief that every idea is worth hearing as part of the “public square”. Twitter offers the most depressing, frustrating, and soul destroying version of _doomscrolling_ whilst also addictively giving my brain a tiny distraction that it is always clambering for.

Their new CEO publicly fired the entire Trust and Safety team and gutted the moderation team. We saw immediately that he dismantled tools like the verified badge. This is a clear message for his vision of twitter. A place where he can fuel a war between ideologies by arming both sides with hot takes _and_ provide the battleground they fight on. Free speech as a weapon to drive both forces into seeing adverts whilst they fight.

His recent calls for employees to sign a new manifesto promising to cut off ties with their friends and family in order to focus entirely on Twitter, don’t sit well with me at all. We know from many areas of software development that _crunch time_ takes lives. It’s irresponsible for a CEO to ask this of their team. In many developed countries, illegal.

I don’t believe he cares about anything but paying back his investors the embarrassing amount of money he had to borrow to buy Twitter. To do this, he doesn’t even have to make advertisers happy. He only has to increase engagement on Twitter. He can do that by fuelling fear and hatred and making a spectacle of himself to keep people talking about it.

**The “cost” of moving to Mastodon isn’t all that high.** However, it does mean that I’ve left much over on the birdsite. There’s thousands of words (of varying value) and images that I’ve exported and now have on a hard drive. Inaccessible. A great deal of my network also moved over to Mastodon, and tools like [movetodon] helped migrate them over.

There are some people who haven’t taken the jump yet. My compromise here is just bookmarking their Twitter profiles and taking a look at them every once in a while to keep up. (Please do considering joining us!)

**In the future, moving away from Mastodon to something else will be easy and fully interoperable.** I’m hosting my own Masto instance, which means this will never come up, but if I had first selected mastodon.social or ruby.social and then the owner of that instance ended up being awful, I could move easily with a couple of button clicks. All my posts and my entire network would be ported over. There’s no need to tell each of them to follow me at the new location: activitypub handles account migrations for everyone involved.

I can control very carefully what appears in my Mastodon instance too. There are many ways I do this: by carefully selecting who is allowed in (which moderates what appears in the Federated timeline), by managing the “trending” topics (to ignore ‘#acap’ when that got popular from surprising sources), and using the filters on my own personal account (to filter out things I find too sad, that sometimes come up).

There’s no one forcing unexpected authors onto my timeline and that’s a ruddy delight. Productive conversations happen with likeminded people, rather than those looking for a fight.

More because I own d20.social, if Digital Ocean gets too expensive I can move it anywhere I like. I can host it from home if I wanted the headache. After a few minutes of DNS propagation, no one would even notice. Nothing of mine is captive of someone else.

**Google started charging me for my hosted domain this year.** I use one of my domains for email and until recently Google would happily host a mail server for free. This never needed me to think much about it – it all just worked.

Since starting to charge money for it though (and I’ve no problem with that), it got me thinking about alternatives. Google _are_ a big part of the problem with the shrinking Internet and I don’t want to be directly contributing to that.

I had Hotmail as a child, and moved on to Gmail within weeks of it being available. I’ve not really had to think about other providers for many years. I’ve heard good mentions of Proton Mail so that was where I looked first.

The dread of the complexity of moving my domain to another email provider settled on me quite heavily and I was quite concerned it would all go horribly wrong. The worst case being that I miss an email from someone important that I was expecting.

The migration is done entirely by DNS records, which take a while to propagate. Especially when you’re editing them over on hover.com and then realise the nameserver is actually wordpress.com, because you moved it there last year and forgot.

Turned out, this doesn’t really matter. So long as both email providers are accepting mail for the email address, it’ll end up at one or the other. As it happened, full propagation for all updated records took half an hour and then I was done. Proton Mail imported all of my emails and contacts and now I’m off of Google.

I can only do that because I own the domain name. I cannot do this for my @gmail.com address. That’s permanently tied to Google. If they decide I need to start paying for it, I have no choice. It’s such a key legacy email for me on many websites (some I won’t remember about and some that don’t allow email address changes) that I’d be forced to pay any price they want.

You need to own your own part of the Internet.

[Shrunken Internet]: https://technicallyshane.com/2022/11/16/the-shrunken-internet.html
[movetodon]: https://www.movetodon.org/
