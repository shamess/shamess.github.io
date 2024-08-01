---
layout: post
title: This blog post is a Web Component
date: 2024-07-27 17:02 +0100
---

It can be embedded anywhere!

Take a look at the source of this page.

This sort of a work in progress, but I don't want it sitting in my drafts for
ages, so here you go.

<style>
::slotted(*) {
  font-style: italic;
  color: red;
}
</style>

<template data-type="blog-post" data-format="markdown">
# This blog post is a Web Component

<div><slot name="byline">By Shane.</slot></div>

At work we're adding SwiperJS and I was reviewing the PR implementing it and
noticed a bunch of HTML5 that I'm a bit behind on. What the heck is a shadow
root? What's this `part` selector?

![A review comment from me, excited about the `part` attribute.](/assets/github-comment-part-webcomponent.png)

So, I wanted to dive in a little. Hopefully this blog post has ended up using
all three pieces of tech in a Web Component:

1. Custom element
2. Shadow DOM
3. Templates and slots

This post you're reading is being rendered inside a custom element:
`technically-shane-blog-post`. Its job is to take the URI for the post's
content, as well as a selector of where to find the blog content to render.

In many ways, these feel like React or Stimulus controllers, with a bit less
sugar.

The shadow DOM is crucial to making this embeddable anywhere. The CSS won't be
able to be messed up by the surrounding page _or_ the other way around. You can
be certain that the CSS you've applied won't get overriden elsewhere.

Templates and slots allow the "host" to tweak some bits. Okay, well, I've not
yet figured out how to use Slots. I think this is to do with me not using the
template tag correctly (using `innerHTML` rather than `content`). I'll come
back to this!

## Can I use the component inside the component?

Lets find out!

...

No.

What I wanted to build here was the ability for the component to check its
width, and if it was small enough then it would only render the first few lines
of the blog post. Thus, avoiding an infinite loop of loading blog posts.

However, the encapsulation works both ways, it seems: the CSS (etc) from
outside the Web Component can't easily access inside the component, but also
the other way doesn't work either. The Web Component can't see its own width or
offsetWidth.

Additionally, adding `container-type: size` makes the entire web component lose
track of its height: just as if I'd used `display: inline` on the whole thing.

So, no Web Component inside Web Component just yet.

## Is this blog post readable by Google or other scrapers?

I'm not sure. Probably not... I think probably not. I might not care too much
about that.

I'm almost certain that screenreading software will wait for the Javascript to
be rendered before relaying the content to their reader, so I'm not worried
about that.
</template>

<technically-shane-blog-post content="https://technicallyshane.com/2024/07/27/this-blog-post-is-a-web-component.html" body-selector="template[data-type='blog-post']">
</technically-shane-blog-post>

<script src="/assets/javascript/technically-shane-blog-component.js" type="module" defer></script>
