---
layout: post
title: 3 years of Mastodon
date: 2025-10-22 12:30 +0100
---

I started my Mastodon server, d20.social, three years ago (November 6, 2022). It's been quite a rewarding project to be hosting.

Twitter had been going down hill for quite some time and Elon's acquisition of it made it quite clear that it has become a source of World Suck. Staying on it, and seeing ads occasionally, was directly funding Trump's eventual ascension and I wanted no part of that.

I did know of Mastodon before then, but the mass exodus from twitter and everyone redirecting their accounts to fediverse instances was what made me decide it was legit. I didn't fancy joining one of the big servers though. So I ended up looking for a fun domain, and found d20.social.

My original intent was to make a TTRPG community on that server, but quickly changed my mind when I realised how un-fun moderation would be. There are only three accounts on d20.social: me, my partner, and some random person who signed up and made me realise I didn't want the stress of moderating even just one person. (That person never actually posted, and I suspended them some time after.)

## Bringing a small instance to life

Tiny instances is how I feel the fediverse should be maintained. The software isn't entirely designed to be run with so few people though. The 'Trending' section is sorely lacking as it seems to only consider items from the local server. It'd be nice for that to be more useful, but it's the only negative for me about running the server myself.

In the early days, my motive was to follow anyone and everyone that I came across who was posting about something I had an interest in. This works well!

Additionally, Mastodon supports "Relays". These are endpoints on other servers you tell your own instance about. If the admin approves your relay request, it'll send all the content it has on its server to your server. So, if I'm interested in everything on ruby.social, all messages will also get received by my server without me having to interact with them. They don't appear in my timeline - they just end up in my Postgres database.

The beauty of that is that you can now benefit from following hashtags. I can follow the #ruby hashtag and they do all appear in my timeline. Great! I follow #ttrpg and #mychemicalromance.

The issue here is that it puts a bit more load on ruby.social, and @james@ruby.social probably doesn't want to be paying for that. Their resources are best spent on their own users and not people off-instance. That's reasonable. Good news though: someone else has taken on that burden. You can visit [https://relay.fedi.buzz/] to use them as a relay. Adding `https://relay.fedi.buzz/instance/ruby.social` as a relay (which is auto-accepted by relay.fedi.buzz) will then pipe all of ruby.social's stuff to my server without the Tragedy of the Commons overloading ruby.social systems.

That's also the place you can get relays for specific hashtags which will come from anywhere in the fediverse.

## Social media is a dangerous drug

A constant stream of new and shiny messages is bad for your brain. Doom scrolling starts with a hunt for a dopamine hit, and ends with spiralling around a far-right pit of sadness.

Once I had my instance populated with lots of messages, I had to start pruning weeds.

I heavily use Filters in Mastodon for better mental health. Even when people are shouting opinions I agree with, I have to mute them out for fear of being overwhelmed. 'Nazi', 'Elon', 'TERF', 'blockchain', 'covid' and dozens more are all words I've restricted from posts that appear in my feed. "Titanic" is on the list for some reason.

Certain people on Mastodon love to compare it to Twitter. Or talking about Twitter's demise. Add "twitter" and "xitter" to your filter list and you'll have a better life.

## Running mastodon

I originally ran Mastodon pretty well on a small instance on Digital Ocean. It wasn't the $5/m one, but it was close to that.

For whatever reason, I was running it 'by hand'. I had the git repo in a directory and was running it like a locally run Rails application. It doesn't seem even a bit logical these days but I had a number of tabs in byobu running the webserver, the streaming server, and all the other bits.

Upgrading it was dreadful, because I would have to precompile the assets. That process used a lot more system resources than the small instance had, so I had to go up to $20/m for a few minutes whilst I did that.

It was dreadful. I really don't know why I put up with it.

After some time I found that Hetzner did very cheap deals on quite good dedicated machines. So now I pay £30~/m for a very good machine. I moved Mastodon over to that, this time using the docker-compose set up. **Definitely do this.**

Upgrading Mastodon is simply now:

- Run a backup: `docker exec mastodon-db-1 pg_dumpall -U postgres | gzip > postgres_backup_PREUPGRADE_`date +'%Y%m%d'`.sql.gz`
- Edit the docker-compose.yml to point to the tagged version you want.
- `docker compose up -d`

Easy.

I will also occasionally run this slew of scripts from inside one the containers:

```
RAILS_ENV=production bin/tootctl accounts prune;
RAILS_ENV=production bin/tootctl statuses remove --days 4;
RAILS_ENV=production bin/tootctl media remove --days 4;
RAILS_ENV=production bin/tootctl media remove --remove-headers --include-follows --days 4;
RAILS_ENV=production bin/tootctl preview_cards remove --days 4;
RAILS_ENV=production bin/tootctl media remove-orphans;
```

These trim down the bulk of the saved assets and bloat from the database.

It's quite an easy piece of software to be running.

## Today

I find Mastodon to be one of the most exciting open source projects happening today. I'm still very eager to see what new features come with each patch and I'll spend more time than I need to looking through the changelog each time.

It's a very stable system that I find remarkable. It's all basic Internet Stuff, but I love that I can message a friend on a different server and they can pipe back. Both of us using own infrastructure.

The fediverse movement is also a fun place to be at the moment. I was recently a part of the [fediforum unconference](https://fediforum.org/) and that was full of discussions and hope for the future. There's a good mix of tech and non-techy people, so ideas aren't constricted by what's technically feasible, which is a hurdle devs often get bogged down by - we can worry about that later on after we've decided what we want.

It's a movement that aligns itself very well with the indieweb. Mastodon feels like the old web to me, in a way that Facebook and Twitter do not. It feels like real communities who are invested in their environments, and not just content creators helping their overlords sell ad space.

Three years on, I’m still glad I started d20.social. At a time where the Internet seems to be in decay, I'm genuinely optimistic about the future of fediverse.
