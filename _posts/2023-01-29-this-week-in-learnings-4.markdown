---
layout: post
title: This Week In Learnings 2023.4
date: 2023-01-29 19:15 +0000
---

* If you're storing strings that you may want to lookup on, double check you have indexes correct. If you have an index on `lower(postcode)`, be aware that Rails doesn't know anything about that. This is somewhat obvious, but managed to slip by in a couple of places for me. [You need to lowercase your search too.](https://stackoverflow.com/a/15245691/48970)
  * Also, double check you have the correct index type. **`LIKE` queries will only use [gist indexes][gist].** A normal index doesn't do any similarity matching.
* [last.fm](https://www.last.fm/user/haikushane) seamlessly works with Plex. Since Apple Music stopped working with it years ago, I stopped using last.fm, but I think it's a brilliant service.
* You can `order by` a number, where the number is position in the `select` columns. `select id, created_at from users order by 2` will order by created_at. Works for `group by` too. Useful for when you don't have a column name handy (because it's a count, or something).
* elm-format decided this was a nice way to format this:
  ```
  isTyre : Label -> Bool
  isTyre label =
    label
      == DriverFrontSideTyre
      || label
      == PassengerFrontSideTyre
      || label
      == PassengerRearSideTyre
      || label
      == DriverRearSideTyre
   ```
  
  I spent ages reviewing this line, reading it as `label == DriverFrontSideTyre || label`, thinking it was some Elm thing I wasn't aware of.
  
  Just putting it on one, long line cleared it up (and was allowed by the formatter):
  
  ```
  label == DriverFrontSideTyre || label == PassengerFrontSideTyre || label == PassengerRearSideTyre || label == DriverRearSideTyre
  ```
* I found a copy of _Three Cheers For Sweet Revenge_ for £1, which made me not feel bad about having bought (and lost) it so many times. I also found a copy of _For Those Who Have Heart_ (A Day To Remember), which I only wanted because there's a really good cover of a [Kelly Clarkson song] on it.
  * I also found _A Fever You Can't Sweat Out_ (Panic!) in CEX. It's like hunting for relics in charity shops, CEX-like places, and HMV.
* Totally out of the blue, I've also decided to start backing up my DVD collection. VLC can apparently do this, but I couldn't make it work. So, I paid for  'Winx DVD Ripper Platinum', which felt like the riskiest purchase I've made online ever. But so far appears totally legit. It manages to get around all the copy protection issues that I've thrown at it so far. All the files get thrown onto Plex and it's starting to look like my own Apple Music-and-Netflix service. It's really exciting. I don't know why.
* I just enabled "build every ten minutes" for this blog, and hopefully "don't show posts with a future date", allowing me to write these weeknotes with a scheduled date and not having to remember to merge the branch on Sunday. Lets see if this works!

[gist]: https://www.postgresql.org/docs/current/pgtrgm.html#id-1.11.7.44.8
[Kelly Clarkson song]: https://www.youtube.com/watch?v=Gy4Uq86QbaE
