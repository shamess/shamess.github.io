---
layout: post
title: Deploying just one configuration file with Docker
date: 2025-09-13 09:13 +0100
---

There are two parts of my project. The ./webserver directory is a Rails app and that bundles up easily into an image. I can build that image and then deploy it to my repo, to be pulled down and run by my server. The second part of my project is a 40 line configuration script... how do I deploy that?

`just-in-time.liq` is a script which populates my Liquidsoap container with what tracks to be playing on [my 24 Hours of Radio project](https://radio.shane.computer/). That's all I really need for this part of the project.

The just-in-time.liq needs to be accessed by the liquidsoap instance, which I just pull straight down from `image: savonet/liquidsoap:v2.3.3`. The just-in-time.liq script is loaded as a volume.

```yaml
services:
  liquidsoap:
    image: savonet/liquidsoap:v2.3.3
    command: liquidsoap /config/just-in-time.liq
    env_file: .env
    volumes:
      - ./liquidsoap/config:/config
      - media:/media
```

However, to get it onto the server, I'm having to copy and paste it. An easily forgotten deployment task.

There's a strong argument to say that this should be handled by continuous integration, but that's not really the root of my issue: that script shouldn't be hanging around my server's project-setup directory. That directory ideally contains a docker-compose.yml, a .env, and an nginx.conf. That's all stored in a git repo. The liquidsoap script doesn't feel like it should be in amongst that.

## Tiny container?

How about if I build my own version of `savonet/liquidsoap:v2.3.3` with that configuration script baked in? This felt very odd to me when I first thought of it, but it's actually strikingly similar to what we do with Rails projects.

I was worried I'd end up with a bloated image, but in reality it's just the size of the `savonet/liquidsoap:v2.3.3` image I'm using anyway plus the size of the script. No big deal. And I [already have `distribution` set up](https://technicallyshane.com/2025/08/29/the-non-facy-way-of-deploying-a-rails-app-and-a-step-toward-the-future.html#distributiondistribution)!

```yaml
FROM savonet/liquidsoap:v2.3.3

COPY ./liquidsoap/just-in-time.liq /tmp/just-in-time.liq

CMD ["liquidsoap", "/tmp/just-in-time.liq"]
```

(I'm using the tmp folder here as it's the only folder that the liquidsoap user has access to. The `/config` only worked when docker-compose pulled rank to create it with the right user. I don't think there's any auto-cleanup of tmp directories that I should be worried about.)

That's it! I build this alongside my `radio` project and push both of them to the registry.

```yaml
services:
  liquidsoap:
    build: .
    container_name: radio-liquidsoap
    env_file: .env
    volumes:
      - media:/media
```

The server's docker-compose.yml changes just a little to support this: point the `image` to my own image rather than the official one.
