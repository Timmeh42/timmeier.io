---
title: CSS 3D Business Card
tags: posts
layout: post.html
---
# {{ title }}

Prior to the current iteration of my website, I had a simple 'digital business-card'
front page. The skeumorphic-cards theme lives on in my current site; although with
more correct HTML and without flashy flipping effects.

Born out of an experiment in making a realistic-looking postcard with CSS 3D
transforms (and without Javascript), I spent a fair amount of time tweaking every
aspect of this business card - the subtle gradients, background shadow, and even
the shadows on the faux-debossed text transition between shades when flipping the
card over.

The HTML behind the card is an awfully non-semantic use of the `<checkbox>` element
and `<label>` to enable clicking anywhere on the card to flip to the other side.
The CSS was hand-written and all units were originally in `px`, which were converted
without modification straight to `rem` to allow the demo to scale down for small
screens.

See the live effect below - unfortunately CSS 3d-transforms require hardware
acceleration, so the effect does not work on some mobile browsers.

<iframe src="/demos/business-card/index.html"></iframe>