---
layout: post
title: The non-facy way of deploying a Rails app and a step toward the future
date: 2025-08-29 10:56 +0100
---

This month I've deployed three Rails projects to a server. This is all a fairly manual process - it's only vaguely more sophisticated than the old days of FTPing up files to a server. It has served me well so far. Maybe these notes will help someone else who's not making use of Heroku, Kamal, Capistrano, or other sophisticated deployment methods yet.

1. Add a DNS record to point to the server for the application. (Do this first to avoid propagation delays later on.)
2. Create a sample nginx.conf file with an ideal setup.
3. Create a sample docker-compose file with an ideal setup.
4. Add the non-sample version to .gitignore.
5. Push the application source code from my working machine to Github.
6. Pull that down on Hetzner.
7. Copy the two sample files and fill them with server related tweaks.
	1. Use `docker ps` to figure out which ports are available.  After a few Rails projects on one server, you can't rely on guessing a number in the 3000 range to be unique any more.
8. `ln -s /home/shane/rails-project/nginx.conf /etc/nginx/sites-enabled/rails-project.shane.computer ; nginx -s reload` to set up the project for nginx.
9. `certbot` to get the SSL cert set up for the domain.
10. `docker compose up` gets everything going.
11. Done!

## My least favourite part

It bugs the heck out of me that I have the entire code base just hanging loose in a directory. There's a few reasons for this.

1. Using git as a mechanism for transporting files you end up with a real working directory of files. You cannot push to this from elsewhere. It's janky.
2. Configuration files, like those nginx.conf and docker-compose.yml are hidden away by .gitignore, since you don't want those committed. At least not in the project codebase! I actually do want them version controlled though, like we saw in my [set up of grafana](https://technicallyshane.com/2025/08/17/quick-let-s-set-up-grafana.html).
3. I don't *need* all of the project files. Just the files that make it work.
4. This forces a `docker build` of the project; although I'm quite pleased with my beefy server, it is rather slow at building images. My ancient intel macbook is faster.

The obvious, correct way of transporting applications like these are just passing around the docker image. For that you need a container repository.

## distribution/distribution

If you host your container images with github you get very little storage space for images, even on a paid plan. On Docker Hub, it'll run you $16 per month per user. It's expensive with no real need to be. In fact - that seems to fall right into my sabbatical's ethos of making SaaSs that are expensive and tailored to teams available for solo developers at a more affordable rate!

[distribution/distribution](https://distribution.github.io/distribution/) is the open source software that github and docker hub both use to run that side of their business. You docker `docker login` to log into your own, private image repository and then can `docker pull` and `docker push` as normal. It can live on your own server, which you're already paying for, so why not! Plus, it's all private if you set it up correctly.

This month, I've been working on a Rails wrapper around that service which gives you a lovely interface to manage users, what images they can access and publish, and a few other nice features.

At the moment, it's very roughly set up. (I'm now quite adept at implementing JWT!) But last night I got my software to deploy itself by using this private repository. So I can now:

1. Ditch the repo living on the server.
2. Build the image locally - fast!
3. Push the image.
4. `docker pull` on the server.
5. `docker compose up` to restart with the new code.

Exciting!
