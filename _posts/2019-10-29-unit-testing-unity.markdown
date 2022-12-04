---
layout: post
title:  "Unit testing Unity MonoBehaviours"
date:   2019-10-29 17:16:05 +0000
---

*tldr;* You can't really unit test MonoBehaviours. Instead, pull out the logic
you want to test in a plain old C# class and use that.

It took me a little too long to set up my unit testing in Unity. Between
learning how to pull in my first package and refactoring my code to make it
testable, it took me a number of hours to get it where I wanted it.

## Some set up inside of Unity

Unity actually comes with a test runner for you. I recently switched from using
Visual Studio to vim for writing code, which I'm happy with. So I was eager to
be able to run my tests in my terminal too. Maybe you can, but every sign
pointed me towards using the in built test runner.

You can find this test runner under `Window > General > Test Runner`. Once
you've got that open, if you want logic-testing unit tests, you'll likely want
to use Editor tests. These can run quickly without having to start up the game.
Jump over to the EditMode tab. Create a 'Tests' directory immediately below your
Assets, then with that selected hit the button in the Test Runner window to
create test assembly folder. Call it 'Editor'.

## There's no way to instantiate MonoBehaviours

I had three objects that were working together to manage "when the player
presses h then go left". I figured this would be a simple first step to get into
Unity testing.

I knew this was the case inside of scripts, but I was hoping running tests would
be a little different. Unfortunately, it's not, and no framework around
MonoBehaviours has been created. I can't simply new up my KeyboardMovement
object.

It's best to not fight this. In fact, if you think about it, you know in your
heart of hearts that having so much logic in your MonoBehaviour isn't the right
place for it. They're like your controllers in a web framework, and you know
full well that you shouldn't have 200 lines of code in those.

The MonoBehaviour's job should be simple; listen for an event and then trigger
some code to run. Maybe a little glue between a couple of components, but little
else.

The first big step for me was seperating out that logic.

I renamed my KeyboardMovement to KeyboardMovementBehaviour (I'm aware the
convention should be more like BKeyoardMovement or some such, but I like it
this way). A new KeyboardMovement class would be where I keep my logic with as
many reduced responsibilities as possible.

Typically, a key is pressed, the KMB spots that and then figures out the
expected location that the player has indicated. This comes with required
validations like "can the player actually move there?" (If it's a wall, then
no.)

I changed this so that all the KeyboardMovementBehaviour needed to do was create
a KeyboardMovement, pass in the current location and the direction of movement,
and get back a brand new location to give the player. The upside here is that to
test "do I go north when I press j?" I don't need the MonoBehaviour any more.

## Mocking

My Location object is still a MonoBehaviour, at the time of writing, at least.
Converting that felt like a much larger task and a potention archtectural
rethink that I'm putting off. So, how to create a Location to pass into the
KeyboardMovement?

Just like in other languages, you can mock out objects. However, again, you
can't mock out MonoBehaviours. Instead, create an interface. You can then mock
that with [NSubstitute][1].

This means going through your code and figuring out where LocationInterface
needs to be the type, rather than Location though.

The awkward thing about mocking the Location was that the interface dealt with
two public properties: `x` and `y`. Not getters or setters, but actual public
ints. The interface ended up looking like this:

```
public interface LocationInterface
{
  int x { get; set; }
  int y { get; set; }
}
```

This isn't so bad. The awful news is that the Unity Editor will no longer
display those fields in the component! That means you can't save values in them,
which was a problem for me because that's how my player gets their starting
position.

The fix was janky, but got there:

```
public class Location : MonoBehaviour, LocationInterface
{
  public int _x;
  public int _y;

  public int x { get => _x; set => _x = value; }
  public int y { get => _y; set => _y = value; }
}
```

The Editor now spots the `_x` and `_y` and is even nice enough to just call them
`X` and `Y` so the component UI didn't change at all.

## Automated testing with Unity

It feels a lot like it doesn't want to be tested. There are many hurdles, some
of them are from the language itself, but the inability to create MonoBehaviours
(even for tests) is frustrating AF and shows a lack of interest in being a
testable framework.

It is possible though, but does require thinking about from the very start of
development. I've a long way to go if I want to reach any sort of coverage.

Ultimately, I've ended up with a few good tests. I started with adding unit
tests because my pathfinding algorithm isn't working as expected. One tool in my
belt for when something is unexpectedly breaking is to write a test around it
and that'll allow you to narrow down the scenario in which it's broken. The bad
news here is that my pathfinding tests are all sodding passing and the bug is
still there!

[1]: https://stackoverflow.com/questions/57784897/importing-nsubstitute-into-unity-project
