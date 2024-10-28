---
layout: post
title: Some things I learnt about forms
date: 2024-10-28 17:06 +0000
---

I've been doing web development, using HTML, for more than twenty years if you
can believe it. Here's somethings I learnt only this week.

## Forms only support GET and POST

The spec for `<form>` only covers the behaviour for those two methods.

I've seen Rail's fun little `_method` input on a form, when we want to use
`delete`, but I had just assumed it was a Rails work around for something. I'd
never investigated what.

But no. DELETE, PUT, the rest aren't supported. If you use them, the browser
will send a GET or POST for you.

When I learnt this a few days ago, I found a good Stackoverflow post about it
(which I can't find now). In there, the discussed reason why is surprising: no
one has bothered writing up use cases for the WC3 folk to add to the
specifications. "I can't think of any reason why you'd need it," said one of
the committee members. Which is odd because many web frameworks have found a
reason to add in a workaround.

Another reason against it is that CORS would have to be considered. If a form
could suddenly start sending a DELETE to *another* website that wasn't
expecting it, then all hell could break loose. But, I'm pretty certain that's
not a security hole that any half decent website would have.

## `formaction` is a thing

So you've got your form to edit your Widget all set up, with it's action being
"/widgets/123" and method being "post". In the form, you can edit all the bits
for your widget. The submit button will go ahead and save the form for you.

But what if you want another button: "Save as copy", where all the details have
have been entered get passed as params as usual, but instead you want them all
to go to "/widgets" and make a new widget.

Well, by gosh, you can! `<input type="submit" formaction="/widgets" value="Save
as copy" />`.

I'm not sure this has much of a use case and it ended up not being used in the
code I originally added it to.

There's `formmethod` too, you know.

## Prefer `requestSubmit`

I've been working with a complex form this week (I'm not sure if you can tell).
There's lots of fancy features it has, including automatically submitting on
the change of an input.

In the onchange callback I was calling `this.form.submit()` and being
frustrated that my other javascript `submit` event wasn't being proc'd. In
fact, none of the pages Turbo features were working as expected!

Turns out `submit()` skips right over the `onSubmit` events and goes straight
to making the request. That includes ignoring any input validations you've
added.

On the other hand, `this.form.requestSubmit()` does exactly what you'd expect.

So, even if you're not adding other events, it's best to prefer
`requestSubmit()`.

## forms in forms

One of the complexities of this week's form was that there were a number of
forms-in-forms.

This is frustrating for a few reasons, but they all boil down to an
unpredictable system.

For what it's worth, Safari, Chrome, and Firefox all seem to do what you'd
*hope* would happen. The most local form would get submitted. But it's
completely undocumented and unsupported.

- Which form will it chose? It has a particular behaviour now, but will it stay
  like that in the next Chrome release?
- Which inputs will get sent? Just the 'local' ones, or all of them?
- Will the onSubmit event bubble up to the top form too?

Who knows! Don't do it.
