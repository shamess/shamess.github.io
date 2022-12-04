---
layout: post
title:  "Hiding the Nomad frontend"
date:   2020-10-30 19:33:05 +0000
---

Here's the situation. You're excitedly following along with the [Getting Started][0] Nomad tutorial and it's all going really well. You've created a Digital Ocean droplet to fool around with and you're overjoyed that you've gotten your Redis server running three instances. Then you get to the "Web UI" section and think to yourself, "hm, but I never turned this on."

Indeed, if you grab your public IP address and port the default :4646 port on the end, you can see the Web UI. This web UI comes with all sorts of access, including the API where just about anyone can create and start jobs. This isn't something you want open.

What you need to do, quite quickly to be honest, is [set up some droplet firewall rules][1]. The most basic of these might look like the following:

```
Inbound rules:

Type      Protocol      Port Range
SSH       TCP           22
HTTP      TCP           80
HTTPS     TCP           443

Outbound rules:

Type         Protocol         Port Range
ICMP         ICMP
All TCP     TCP             All ports
All UDP     UDP             All ports
```

You'll need SSH so you don't get kicked off, and we'll be using HTTP/S soon.

After saving this and applying it to your droplet (note: you create and apply the firewall rule to your droplet on different tabs of that page) you should no longer be able to access the nomad web UI on port 4646. You'll just get a timeout if you try.

Our next objective is to get that UI back, but in a much safer way. Ideally, on port 80 on a subdomain.

Setting up the DNS is super easy on Digital Ocean: "Create" your domain, pop in the subdomain you want and point it at your nomad droplet.

Next is to install nginx, which'll act as our reverse proxy between port 80 and 4646.

```
upstream nomad_ui {
        server 127.0.0.1:4646;
}

server {
        listen       80;
        server_name  nomad.yourdomain.com;
        charset      UTF-8;

        location / {
                proxy_pass http://nomad_ui;

                auth_basic "You sure you know what you're doing, kid?";
                auth_basic_user_file /etc/nginx/auth_files/nomad_ui;
        }
}
```

A key thing to point out here is that we're also adding some basic auth. You'll need to create this file. Most places around the internet (including Digital Ocean's own tutorial) suggest installing some Apache tooling to create this file, but it's really not needed. You likely already have openssh installed.

```
openssl passwd -6
```

Pop in a new password when prompted and copy and paste that into `/etc/nginx/auth_files/nomad_ui` (in a directory you might need to create). Before the password, add your username and a colon as seperator. It might look something like this:

```
raymond:$6$dw8NeSxPPi7MG4gC$be/Jhx4SxmHa0x2BDsm8LD08xpE57xMU8akAjQxyeq
```

Reload your nginx: `nginx -s reload`.

And you should be done!

_This is one in a series of posts where Shane feels the need to write down what he did or else forever forget._

[0]: https://learn.hashicorp.com/collections/nomad/get-started
[1]: https://cloud.digitalocean.com/networking/firewalls/new
