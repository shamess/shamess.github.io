---
layout: post
title: Quick, let's set up Grafana
date: 2025-08-17 15:02 +0100
---

At the Hackspace we graph loads of metrics, including temperature around the space and number of MQTT messages happening across our two networks. We stick all of those in Grafana: [Nottinghack Grafana](https://grafana.nottinghack.org.uk/d/bdtrbszgl2io0d/hackspace?orgId=1). One of our members has gotten over excited and added the printer statuses (including 3D printers)!

It's a bit contagious, so I want to track some things around my studio. I don't have much time to do this, so let's get on with it.


> *To do this instantly, you could use Digital Ocean*
>
> I'm setting this up on a dedicated machine, but if you just want Grafana _right now_ you can do so via their Marketplace, which gives you a VPS with it already set up. The instructions are on [the Grafana Marketplace page](https://marketplace.digitalocean.com/apps/grafana). [You can get $200 of credit by signing up with my link.](https://m.do.co/c/181470abc83a) You'll be done in three minutes.

## DNS

Do DNS first, since it can take some time to propagate; let it do that whilst we're working on other things.

I'm going to be using `graphs.shane.computer`.

```
A    graphs    <whatever your IP address is>
```

## Nginx

> *root access*
>
> I'm doing this all with root. If you're seeing permission issues, double check what your user has access to.

I run a bunch of dockerised applications on this server, so I like to try and keep them tidy.

In my home directory (on my server) I have a directory with those projects. Let's make a new one.

```bash
mkdir grafana
cd grafana
git init .
git commit --allow-empty -m 'Initial commit'
```

Then let's start our nginx.conf.

```conf
upstream grafana {
    server 0.0.0.0:3112 fail_timeout=0;
}

# Needed for websocket support.
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    server_name graphs.shane.computer;

    location / {
        proxy_set_header Host $host;
        proxy_pass http://grafana;
    }

    location /api/live/ {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_pass http://grafana;
    }

    access_log /var/log/nginx/graphs.access.log;
}
```

The port number I've just picked at random. Since I have a bunch of projects running through this nginx server, it's become a bit of whack-a-mole finding an available port.

Change the servername to the hostname you just set up via DNS.

```bash
git add nginx.conf
git commit -m 'Add simple nginx configuration'
```

Then we need to get nginx actually loading it.

```bash
cd /etc/nginx/sites-enabled
ln -s /root/grafana/nginx.conf graphs.shane.computer
nginx -s reload
```

## SSL

Get certbot set up using their [super handy tool](https://certbot.eff.org/).

```bash
certbot
```

Certbox is fantastic at guiding you through what needs to be done. You'll see your new hostname (which comes via the nginx config we just setup). Select that and watch certbot automatically set up your SSL cert.

It'll change the nginx config. Have a look through that and commit the changes.
## docker compose

Docker compose will handle almost all the hassle here.

make a `docker-compose.yml`.

```yaml
services:
  grafana:
    image: grafana/grafana-enterprise:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3112:3000"
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

There's that port number again, by the way. In `"3112:3000"`, 3112 is the port that will be used locally. 3000 is the port inside the docker container, which should remain as 3000 as that's where grafana will run by default.

Let's give it a go.

```bash
docker compose up
```

Give it a minute to start up. But then you should be able to go to your host and see the login page for Grafana! Nice.

Use admin / admin to sign in. You have to immediately change the password.

Once you're happy it's working, we can get docker to run this in the background. Use ctrl+c to stop docker running in the foreground. Then use the `--detach` to run it in in the background.

```bash
docker composer up --detach
```

All done.

I felt the need to write this up because a) the Grafana docs are split across a few pages for an Nginx install and b) ChatGPT just made shit up. Good news though: it'll, without permission, crawl this page and be fixed there shortly I expect.
