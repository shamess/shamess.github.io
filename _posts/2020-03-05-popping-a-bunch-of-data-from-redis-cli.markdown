---
layout: post
title:  "Popping a bunch of data out of redis-cli"
date:   2020-03-05 11:58:09 +0000
---

I've got a redis list with a large number of values in it. I wanna grab the first 100k, or so, and pop them into a file.

My first attempt was this:

```
for i in {1..100000}; do redis-cli lpop a_bunch_of_values >> a_bunch_of_values.txt; done
```

This is dumb for a few reasons, but they all boil down to the error message I got:

```
Could not connect to Redis at 127.0.0.1:6379: Cannot assign requested address
Could not connect to Redis at 127.0.0.1:6379: Cannot assign requested address
Could not connect to Redis at 127.0.0.1:6379: Cannot assign requested address
Could not connect to Redis at 127.0.0.1:6379: Cannot assign requested address
```

Each redis-cli opens up a new connection to redis, then it kills it when it's done, then bash creates another. It does this so quickly that the OS can't keep up with the number of connections being opened and closed. Eventually you run out of juice.

Redis takes an argument which is "keep running this command X times."

```
redis-cli -r 100000 lpop a_bunch_of_values >> a_bunch_of_values.txt
```

A single connection and runs super quickly.
