---
layout: post
title:  "Setting up nginx to work with EventSource"
date:   2020-10-24 15:48:05 +0100
---

At the moment, I have a few web services running from this machine. The downside is that only one of those services can use port 80, regardless of if there's a subdomain making them distinct. The way to solve this is to put nginx in front of them, allowing nginx to hog port 80 and distribute requests along my application servers, based on the subdomain.

This is actually fairly easy to set up. On a Ubuntu distro-based systems, `sudo apt-get install nginx` will get you most the way there. You'll need to create an upstream and point traffic to it.

`/etc/nginx/sites-enabled/sinc.technicallyshane.com`:

```
upstream rack_upstream {
	server 127.0.0.1:8080;
}

server {
	listen       80;
	server_name  sinc.technicallyshane.com;
	charset UTF-8;

	location / {
		proxy_pass http://rack_upstream;

		proxy_redirect     off;
		proxy_set_header   Host             $host;
		proxy_set_header   X-Real-IP        $remote_addr;
		proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
	}
}
```

The port 8080 you see here is where my puma-based application continues to run.

The only hiccup was that this set up isn't quite complicated enough for EventSource (SSE) connections.

nginx applies a certain level of buffering which will interfer with the immediate nature of EventSource. Disabling this is important.

```
	location /server {
		proxy_pass http://rack_upstream;
		proxy_buffering off;
	}
```

This meant a minor code change in the application, so mount the SSEs from a specific path (/server) which nginx could watch for.

The documentation mentions that your application can instead send the [X-Accel-Buffering][0] header, setting it to "no". This has the same affect without the nginx configuration change.

I initially didn't quite like that idea as it ties the code nginx. However, after thinking about it, there's no a great deal of harm in being tied to nginx. No one is moving back to Apache or elsewhere.

Additionally, setting this through the application allows us to add more endpoints which require this configuration, without having to also edit the nginx configuration. Change is cheaper with the header option.

[0]: http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering
