---
layout: post
title: This Week In Learnings 2023.12
date: 2023-03-26 12:11 +0000
---

* I've been trying to reduce dopamine-cycling apps. I'm largely done with reddit, twitter is long gone, and today I've removed Instagram from my phone.
* Whilst unfollowing everyone on twitter, I made an effort to check if they had a blog or a newsletter and follow those instead now. Instead of doomscrolling, I have a never shortening list of newsletters and blogs to read now. Hopefully this will start flexing my attention span back to pre-web2.0 levels.
* I still have a compulsive habit to pick up my phone everytime my brain gets bored. But I pick it up now, and then realise "there's nothing for me here" and put it back down and go back to what I should be doing. Progress?
* Some eclectic CD purchases this week. Bought new in bold, otherwise second hand. With these, my Plex tells me I have 114 albums now.
    * Royal Blood (debut), How Did We Get So Dark (Royal Blood), *Typhoons* (Royal Blood). This was an exciting moment when I realised I missed this band when rebuying all my favorite music.
    * What's the Story Morning Glory? (Oasis). An attempt to widen by music interests. This band seems culturally important around my generation, so I figured I'd get it.
    * *Save Rock and Roll* (Fall Out Boy). An oversight that I didn't already own this.
    * *Inhale/Exhale* (Those Damn Crows). A recommendation from a friend.
    * Night Visions (Imagine Dragson).
    * A Night at the Opera (Queen). I've never listened to Queen before, not specially. There are two songs on this album which could be found on _My Checmical Romance_ albums. Really pleased I'm branching out into stuff I haven't usually listened to.
    * The Best of the Ratpack. Sinatra's Classic Collection of 30 Songs, The 3 Divas. Class charity shop finds. I think of these as part of my education.
* I spent much too long on a bug this week where two ActiveRecord models were related with non-standard names.
  ```
  class SellingListing < ApplicationRecord
    has_one :appraisal, class: ListingAppraisal
  end
  
  class ListingAppraisal < ApplicationRecord
    belongs_to :listing, class: SellingListing
  end
  ```
  The bug was that `listing.appraisal.listing` would never be populated if the listing hadn't yet been saved. And if it had, the appraisal would do a database query to collect it by ID. I spent ages trying to get this to behave as I needed it to. In the end a collegue remembered the "inverse_of" argument, and everything made sense again. Anyway, the generic lesson is *you definitely aren't the only person struggling with this bug. Just google around some more.* The most basic software developer lesson, but somethings I end up focusing too much on solving the issue than debugging it.
* I've been using Proton Mail for a while now, and really enjoying it. Feels like freedom. A win over Big Google. And I'm not just saying that because they're doing a referral scheme now where [you can get their Paid package for free for a month](https://pr.tn/ref/VYK1K91F0BX0).
* Diablo IV's open beta was this weekend. The servers were being absoluately battered, but that aside I really enjoyed it. I'm shocked at the £60 price tag, with a monthly subscription for unlocking more content, but I will probably poney up when the time comes.
