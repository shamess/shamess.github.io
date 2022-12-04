---
layout: post
title: Raspberry Pi and Neopixel
date: 2021-02-06 14:12 +0000
---

I decided to do something with one of the (four or five) Raspberry Pi's kicking around the house. I ended up excitedly buying a newer Pi and a Neopixel, so I didn't solve my abundance of Pi problem, but I have gotten somewhere with a project.

The Neopixel 8x8 grid is an LED board that can be programmed from the Pi. The panel can be easily expanded to add additional ones, all over one data line making it an easy project to start with, and turn into something bigger if you wanted. Each LED can get incredibly bright - too bright to look at directly - and can be individually assigned a full range of 24 bit RBG colours.

# Shopping list

My hope was that the Pi and Neopixel were the only two things I needed to buy, but I was very wrong. I did very little research whilst looking at the two devices and assumed they might be connected via USB, which was a mistake. There's a number of bits you'll need.

|Qty|Item           
|---|--------------
|  1|[Raspberry Pi 4](https://thepihut.com/products/raspberry-pi-4-model-b)
|  1|[MicroSD with NOOBs preinstalled](https://thepihut.com/products/noobs-preinstalled-sd-card)
|  1|[USB-C power supply](https://thepihut.com/products/raspberry-pi-psu-uk)
|  1|[NeoPixel NeoMatrix 8x8](https://thepihut.com/products/adafruit-flexible-8x8-neopixel-rgb-led-matrix)
|  1|[74AHCT125](https://thepihut.com/products/74ahct125-quad-level-shifter-3v-to-5v)
|  1|[Power Brick - 5V 5A](https://thepihut.com/products/neopixel-power-brick-5v-5a-25w)
|  1|[2.1m Breadboard-friendly 2.1mm DC barrel jack](https://thepihut.com/products/breadboard-friendly-2-1mm-dc-barrel-jack)
|  1|[Through-Hole Resistors - 470 ohm](https://thepihut.com/products/through-hole-resistors-470-ohm-5-1-4w-pack-of-25)
|  1|[1000uF 6.3V capacitor](https://www.cricklewoodelectronics.com/1000H6V3.html)
|  1|[Adorable half-sized bread board](https://thepihut.com/products/raspberry-pi-breadboard-half-size)
|  2|[Male-to-female jumper cables](https://www.cricklewoodelectronics.com/40-Male-to-Female-Jumper-Cables-on-rainbow-ribbon-cable.html)
|  6|[Male-to-male Jumper Cables](https://www.cricklewoodelectronics.com/65-Breadboard-Jumper-Leads-Solderless.html)

In total, I spent £112.50. Which is quite a lot... However, I did buy two of some things, and almost all of it can be plucked out the breadboard and reused in other projects.

Something to note is that there appears to be a parts shortage, at least in websites that ship to the UK. I purchased all my items from Cricklewood Electronics, The Pi Hut, and Pimorini. Maybe in better times, this would all be cheaper.

## Raspberry Pi

I'm using the Raspberry Pi 4. Every Pi has a bunch of 3.3v GPIO headers, and as such any of them will work. That includes the Pico, which is less than £4, somehow.

You'll also need a way to power the Pi.

## Neopixel

I picked up the NeoMatrix with 64 "pixels". I've done some reading around and can't be sure what needs to change if you have another kind of Neopixel. I believe they all have the ground (GND), 5V, and DIN (data) solder sockets though.

The voltage maybe the thing which changes - if the voltage required is different to 5v, this design won't work. You'll need a different kind of level shifter.

## Quad Level-Shifter

You need a 74AHCT125 chip.

At this point I have to reveal, for those that haven't noticed yet, that I'm not an electrical engineer. This is the first time in my life I've had to understand the difference between amperage and voltage.

The data line from the Pi is coming out at 3.3v. The beefy Neopixel wants to be communicated with at 5v. This chip will make that conversion for us.

Later on, I've given a diagram of what needs to connect to what, but it's fun to look at [the pinout diagram for the chip too][74AHCT125]. VCC is the power. GND needs to go to your ground. You'll also see that there's four A, Y, OE. 1A is the data in, which outputs to its Y, 1Y. To turn that input/output on or off, it uses the associated OE (1OE), which must be connected to the ground. (I'm unable to explain why the ground is used like this... Research for another day.)

## Power supply and barrel jack

I got a fairly standard 2mm barrel jack, as well as a specific Neopixel power supply (5v, 5amp). That power supply does not come with the figure-of-eight wire that connects it to the wall plug. I looted one of these from an old laptop.

The Neopixel requires its own power, and cannot run off of the Pi's.

Good news: if the amperage isn't high enough in whatever you currently have, the Neopixel won't break. It just won't be able to get as bright and/or light all the LEDs. However, as I said before, the LEDs are able to get _very_ bright and will require 3.5amps if you are on full brightness and have all of them on. I doubt you'll do this, except for fun though. Maybe you could get away with 2amps, with just one board.

The voltage is much more important to get right; it must be 5v. (I say this, but apparently the power supply, advertised at 5v is around 5.2v, but nothing has gone wrong. I don't understand why.)

## Resistor

I got a pack of 25 470 ohm resistors for about 50p. Wild.

I'm going to have to plead ignorance here too; I'm not entirely sure why this was needed, only that it was highly recommended. The internet, similarly, seems confused on this. The consensus seemed to be that it does a good job minimising the peaks in current, which will allow for a cleaner data transmission. It has little to do with keeping the Neopixel safe (as the 74AHCT125 chip is basically already doing that). This sounds suspiciously like what I'm about to say for the capacitor, which I do understand a little better, so maybe I got this resistor bit wrong.

## Capacitor

I brought a 1000uF 6.3V capacitor, on the back of [advice from the Neopixel people][powering_neopixels].

I'll do my best to explain what I've learnt about this.

You don't really need this component, and indeed the official tutorial of putting this board together completely misses it out. However, its job a) subside the initial burst of current and b) to act as [a "bypass" capacitor][bypass_capacitor]. (Thanks Matt, for directing me to this explanation!)

The amperage drawn by the Neopixel varies hugely depending on the LEDs you have turned on. The power supply does not react instantly when amperage changes; there's high frequency noise which happens. From what I can tell, you'll have to be very unlucky to see any affects from this, but it could cause an interuption to the stable draw needed. For instance, your 74AHCT125 chip might receive an unusual peak or trough, causing it to misinterpret a signal.

Adding a capacitor reduces those peaks by just... swallowing them up and storing them, I guess?

For something which costs 50p, you may as well add one. It'll be a totally unreproducable bug you experience if you do ever.

## Breadboard

I brought the adorable half board advertised specifically for Raspberry Pi projects (which has very little to do with the Pi, so I guess I was just pulled in by a marketting trick - either way, the board is a good size for this project).

## Wires

I brought a bunch of varying sized male-to-male and male-to-female jumper cables.

You'll want a small supply of short (10cm) and longer (20cm~) cables. I'm happy that I have a good stock now. They're reusable, until you solder them at least.

# Design

I began following [the wiring tutorial from Adafruit][wiring], but also had to add in the capacitor and resistor. That tutorial understands much more about what's going on that this blog post does, so maybe start there.

I'm still getting to grips with Fritzing, but here's the design I made. (SVG only, I'm afraid. Fritzing file available on request, but I haven't completed it yet.)

![Design for the board linking Neopixel and Raspbery Pi](/assets/NeopixelRasbPi_bb.png){: .center-image }

The device in the lower right is the power jack. If you brought the barrel jack, as listed above, you can push it into the board, matching the positive and negative with the board. Positive on the lower rail, and negative (ground) on the upper. There's no wires, despite what the diagram shows.

It may not be as clear as a more professional board, so here's what you want to connect:

* Capacitor as close to the power jack as possible. Note the `-` on one side. That must go into the matching track.
* 74AHCT125 should go across the centre of the board, giving you access to top and bottom pins. The semi-circle shows you where the left side of the chip is.
* 74AHCT125's first pin on the top should go to power supply 5v. (You can use any hole in the pinboard from f-j, so long as it's in the column above the first pin. You can use _any_ hole on the 5v row.)
* 74AHCT125's first pin on the bottom should go to power supply ground.
* 74AHCT125's last pin on the bottom should go to power supply ground.
* The Pi's GPIO 18 should go to 74AHCT125's second pin on the bottom.
* The Pi's ground should go to the power supply's ground. (There's a bunch of pins for ground on the Pi, but do the one just below GPIO 18 for ease of finding it.)
* 74AHCT125's third pin on the bottom should be connected to the resistor. The resistor should plug into an unused column, say column #9.
* The Neopixel's data in (DIN) should be connected to a free hole in column #9 (with your resistor).
* The Neopixel's 5V should be connected to a free hole on the power supply's 5v.
* The Neopixel's ground should be connected a free hole on the power supply's ground.

# Soldering

If you're startlingly like me, you'll need a boyfriend to solder the pins on the Neopixel. For aesthetic reasons, you want to bring the wires up from below the pixel, and have them solder on top. They've told you all these years how good they are at it, so I'm sure they can do a good job.

That's the only bits you'll need to solder. Thank goodness.

# Pi setup

This was super easy, thanks to the micro-sd with NOOBS preinstalled. After [enabling SSH][ssh] by dropping a file onto the SD card, you can use an ethernet cable and SSH into it and set up wifi.

# Python library

The Neopixel shouldn't technically work with the Pi, as the Pi doesn't give exactly timed instructions over the GPIO pins, which the NeoPixel expects. That's easily worked around by using the [CircuitPython libraries][circuit_python], which make coding incredibly easy.

Here's a tiny example:

```
import board
import neopixel

pixels = neopixel.NeoPixel(
    board.D18, 64, brightness=0.05, auto_write=False
)

pixels.fill((255, 0, 0))
pixels[35] = (125, 125, 125)
pixels[36] = (125, 125, 125)

pixels.show()
```

You'll note how low I set the brightness there...

The [CircuitPython page][circuit_python] is really good to get going on the code.

[circuit_python]: https://learn.adafruit.com/neopixels-on-raspberry-pi/python-usage
[bypass_capacitor]: https://www.youtube.com/watch?v=1xicZF9glH0
[74AHCT125]: https://cdn-shop.adafruit.com/product-files/1787/1787AHC125.pdf
[powering_neopixels]: https://learn.adafruit.com/adafruit-neopixel-uberguide/powering-neopixels
[wiring]: https://learn.adafruit.com/neopixels-on-raspberry-pi/raspberry-pi-wiring
[ssh]: https://www.raspberrypi.org/documentation/remote-access/ssh/
