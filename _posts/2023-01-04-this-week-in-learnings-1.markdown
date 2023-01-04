---
layout: post
title: This Week In Learnings 2023.1
date: 2022-12-23 08:04 +0000
---

* In Elm, you don't have to pass through an argument if you're just going to pass it to another function immediately:
  
  ```
  type Drink
    = Water
    | Cola { brand : String }
  
  mkCola : { brand : String } -> Drink
  mkCola =
      Cola
  ```
  
  This is a weird/fun situation where the signature actually makes the code look more complicated. The signature seems to
  demand something, which obviously isn't being received nor used in the method. But in reality, all that's really happening
  is `Cola { brand = "Pepsi"}` which is fairly normal to understand.
