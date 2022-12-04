---
layout: post
title: My WorkForce WF-7830 is printing badly. Please send help.
date: 2021-06-27 16:01 +0100
---

I brought a printer not too long ago with the hope of printing A3 sheets. The
End Of The World has meant loads of people have been working from home and have
brought all the printers in the world that cost less than £500, so I was lucky
to stumble across the Epson WorkForce WF-7830 for a reasonable price.

The bad news is that it's not printing particularly well. The internet lacks
debugging information (potentially my keywords are wrong), so I figured I'd
make this blog post and see if anyone approaches me.

[![dotmatrix style paper](/assets/dotmatrix.png){: .hang-right }][pdf]

I've designed my own dot matrix inspired paper, after getting excited about it
appearing in a [computerphile video][computerphile]. A first draft of what I'm
attempting to print is attached, to the side. You can see the colours are quite
pale, but not something I'd expect a printer to struggle with.

I was suprised to see when it printed like the below. You can clearly see that
it's not bothered printing blocks of colour, but rather lots of very spaced out
dots. This appears to be very low DPI, when the printer can support a very high
resolution. This happens with both the blue bars and the grey circles.

!['View image' to get a closer view](/assets/dotmatrix-fudge.png){: .hang-nicely }

I've printed this lovely picture of [Leadenhall Market][market], and you can
see similar issues. You see in the original that it's lovely, and crisp. This
was resized by the printer drivers to the page, but I'm not sure that matters.
I don't believe that should introduce these artefacts. You can see [a photograph
of the full print here][full-hall].

![A cropped, printed version of the Leadenhall Market photo](/assets/dotmatrix-leadenhall.png)

I have also printed off a solid square with red-orange gradient. This looks
okay, but is flecked with dark "pixels". I believe it's just my <s>blue</s>
cyan that is the problem.

I've

* printed the same image from my phone with almost identical results;
* run through the 'print quality adjustment', 'print head nozzle check', 'print
  head cleaning', and 'print head alignment' steps;
* toggled quiet mode on and off;
* restarted the printer;
* updated its firmware;
* reinstalled my Macbook drivers.

If you do happen to know what this issue is, please get in touch somehow. Maybe
[twitter][twitter], if you can't get hold of me any other way.

<style>
  .hang-right {
    float: right;
    width: 30%;
  }

  .hang-nicely {
    width: 40%;
  }
</style>

[computerphile]: https://www.youtube.com/watch?v=QRYzre4bf7I
[pdf]: /assets/dotmatrix.pdf
[market]: https://www.flickr.com/photos/75487768@N04/32244871986/in/photolist-R8np3J-xHsXri-HU7f2N-RoScqX-HUEBb6-R8snFK-Hx9AKb-o6iwCg-o4pQRE-o59wzn-j8XUQj-DojHWg-xF3j3v-yctYdK-yjVoyo-ivM22z-Xenxuy-2isocHM-dJcjZN-dUwBLB-j8XTs9-QcrPfU-FiRBot-DmDvfZ-QqsZTF-zq6TiK-nMYd6k-z7D2No-zpfvJe-zq7m8r-ysmgZr-soZBxV-XGZVFi-fxMpf6-QuS3Dq-RdJS8y-Q75Dfg-HjDboA-soXy2g-HzLNk7-fxMo3V-D2jSyr-CE2C51-zmW7To-y82s7Z-zmVQZQ-CKN9we-DAHoYV-GdoxTK-ivLVN7
[twitter]: https://twitter.com/shamess
[full-hall]: /assets/dotmatrix-leadenhall-print.png
