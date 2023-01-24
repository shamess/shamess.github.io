---
layout: post
title: This Week In Learnings 2023.4
date: 2023-01-29 09:04 +0000
---

* If you're storing strings that you may want to lookup on, double check you have indexes correct. If you have an index on `lower(postcode)`, be aware that Rails doesn't know anything about that. This is somewhat obvious, but managed to slip by in a couple of places for me. [You need to lowercase your search too.](https://stackoverflow.com/a/15245691/48970)
* [last.fm](https://www.last.fm/user/haikushane) seamlessly works with Plex. Since Apple Music stopped working with it years ago, I stopped using last.fm, but I think it's a brilliant service.
