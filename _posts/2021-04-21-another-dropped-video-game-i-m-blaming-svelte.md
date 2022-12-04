---
layout: post
title: Another dropped video game (I'm blaming Svelte)
date: 2021-04-21 21:21 +0100
---

I don't have a strong reputation for finishing my personal projects, and _Chained Towns_ is another example. I'm leaving this now because I'm frustrated with tracking down Svelte state issues.

![Chained Towns](/assets/chained-towns.png){: .center-image }

_Chained Towns_ is an interface-style game – using clicking, and words, and buttons – which I do quite a lot of because it means I don’t have to get bogged down in graphics or modelling which I find increases my frustration during development and reduces the amount of time I spend before I give up.

I know this visual design of game is viable because I love games like _Paperclip Universe_ from Frank Lantz and _A Dark Room_ from Doublespeak Games. (Sidebar: this blog post is at least two days later than I wanted to post it because I was playing Paperclip Universe.) The gameplay is inspired by _Darkest Dungeon_ by Red Hook Studios; there's a map of contiguous locations. Each location has something in it (expository or interactive). In the picture above, you see there's a shop, where you can swap gold for items you can use in the safety of various locations. You click to go to an adjacent location and risk being attacked on the journey.

Combat is simply automatic. Your avatar hits at a bad guy, until all the bad guys are dead, or you are. You get gold if you succeed. You can go backwards to other locations freely.

![Chained Towns](/assets/chained-towns-combat.png){: .center-image }

I decided to build this for the web, as it uses buttons and whatnot, and the web can handle buttons just as well as anything. I went with [Svelte][svelte] because I had fun with it last time on [_punked_][punked].

## Monitoring state

Unfortunately, Svelte isn’t really living up to its promise. What it says it will do is watch the state of a variable, and then update the contents of the DOM with the reflected changes. This is pretty cool when it works and feels less clunky than `this.setState`, and just slightly less clunkier than React Hooks.

Compare this method of setting state:

```
this.state = {playerHealth: 30};
this.setState({playerHealth: this.state.playerHealth - 10});
```

To the hook version:

```
const [playerHealth, setPlayerHealth] = useState(30);
setPlayerHealth(playerHealth – 10);
```

To the Svelte version:

```
let playerHealth = 30;
playerHealth -= 10;
```

The appeal of this Svelte code is that it is just normal Javascript. Much like React will re-render any DOM affected by the `playerHealth`, Svelte will spot that `playerHealth` has changed and update the view to reflect it.

In that form, it appears the most simple and the compiled code which Svelte generates is uninteresting. Here's a more interesting example to show what Svelte is doing:

```
let playerHealth = 30;

function updateHealth(amount) {
  playerHealth += amount;
}
```

The compiled code will look like:

```
function updateHealth(amount) {
  $$invalidate(0, playerHealth += amount);
}
```

The `0` in that first argument is a label for the state name. So really... it starts to look a lot like React. However, Svelte is doing a bit more work behind the scenes to get there: it has to tokenise your javascript, look for assignments and add the invalidation sugar.

The downside here is that it does not support every way a variable might change its contents. For instance, `push`ing to an array won't trigger the compiled sugar to be added in. The docs recommend fixing this in one of two ways.

The first is tricking Svelte into invalidating by assigning the variable to itself. `playerItems = playerItems`. Here, it'll spot that you've assigned something and sort itself out.

Second, it suggests a "more idiomatic solution":

```
playerItems = [...playerItems, numItem];
```

This is the solution I chose, as at least it looked more sensible. The first solution causes a doubletake upon first sight, but the second is more likely to provoke "I see what's happening, but I wonder why." The problem it introduces cropped up quickly; it creates a whole new array, so if you're referring to this array by reference anywhere - say you've passed `playerItems` into an `InventoryManager` or some such - suddenly, InventoryManager is holding onto an array that Svelte no longer associates with `playerItems`.

As Svelte is so eager to hold to this promise that it'll handle the state updates itself, there's no way to nudge it when it goes wrong. Even if you want to, there's no `setState`.

It's one of these problems that I've bumped in to now. Quaffing a potion is increasing the health of the Player object, but somewhere along the line Svelte is losing track of it. My code all works fine, but isn't Sveltey enough. It's not the first time I've had to track down this kind of issue in this relatively small project. The method of debugging here is `console.log`ing everywhere to see where the var changes, but isn't reflected.

I've now spent more time chasing this framework than actually writing my game, so I may think twice before picking Svelte again. I'd love to use it for a website with less state though.

There are [stores][stores], but I think I ran into a similar problem with those too. :shrug:

[punked]: https://haikushane.itch.io/punked
[svelte]: https://svelte.dev/
[stores]: https://svelte.dev/tutorial/writable-stores
