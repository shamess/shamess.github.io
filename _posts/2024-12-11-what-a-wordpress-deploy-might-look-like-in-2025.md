---
layout: post
title: What a wordpress deploy might look like in 2025
date: 2024-12-11 22:44 +0000
---

Long gone are the days where we'd spend a few hours getting PHP and Apache
working to get Wordpress running on a VPS. Right? Surely they have a
containerised way of running it by now? Lets find out.

*This is a bit messy, because I really wanted to write this up before I lost
enthusiasm. Feel free to tell me I'm wrong and that there's a better way to do
it over on [mastodon](https://d20.social/@shane).*

Very often, I get a nagging in my brain to start a blog. I have more blogs than
blog posts at this point (only a mild exaggeration). Due to a change in my life
goals, I'm no longer willing to give WordPress.com more money than I already
am, and I can't tolerate their free offering. That leaves me with hosting it
myself, I guess.

Another old fashion piece of tech is Hosting Things In The Cloud. (At least, I
hope this is becoming increasingly old fashion.) I recently nabbed a Hetzner
box for ridiculously cheap, with more resources than I could possibly need, so
I'm going to set Wordpress up on there.

There's no way I'm setting up PHP on it though. So, I'm after a docker-compose
file.

There's [a DigitalOcean
one](https://www.digitalocean.com/community/tutorials/how-to-install-wordpress-with-docker-compose)
knocking around that might be fine, but I think we can do better.
(Alternatively, use DigitalOcean, and have [$200 credit on
me](https://m.do.co/c/181470abc83a), and then you don't need to bother reading
this blog post. What a freaking good deal.)

## potentially controversial git directory?

Lets make a new folder, say `wordpress-blog`. Here's an exciting first step,
lets do a `git init`. I've decided to save a bunch of stuff with git. In case
anything goes wrong. It's also a really easy way of backing up things else
where.

I haven't made this into a complete solution, but it has the bones of
something.

Here's your `.gitignore`.

```
.env
dbdata
*.swp

wp-content/cache
```

## docker-compose

This has the mysql database to run. If you're already running mysql on your machine, I assume you know how to tweak this config to make use of that.

```
services:
  db:
    image: mysql:8.0
    container_name: mysqldb
    restart: unless-stopped
    env_file: .env
    environment:
      - MYSQL_DATABASE=wordpress
    volumes:
      - ./dbdata:/var/lib/mysql

  wordpress:
    depends_on:
      - db
    image: wordpress
    container_name: wordpress
    restart: unless-stopped
    env_file: .env
    environment:
      - WORDPRESS_DB_HOST=db:3306
      - WORDPRESS_DB_USER=$MYSQL_USER
      - WORDPRESS_DB_PASSWORD=$MYSQL_PASSWORD
      - WORDPRESS_DB_NAME=wordpress
      - WORDPRESS_CONFIG_EXTRA=require '/var/www/additional-config/additional-config.php';
    volumes:
      - ./additional-config:/var/www/additional-config
      - ./php.ini:/usr/local/etc/php/conf.d/custom.ini
      # - ./wp-content:/var/www/html/wp-content
    ports:
      - 8987:80
```

## volumes?

Wordpress isn't really built for running in a container (still, after all this time). So I've forced a few things in to make it work.

First, the `WORDPRESS_CONFIG_EXTRA`. This is eval'd by PHP, and so we're just going to get it to run a local script for us. In `additional-config/additional-config.php` I have the following:

```
<?php

define( 'WP_SITEURL', 'https://shane.city' );
define( 'WP_HOME', 'https://shane.city' );
define( 'WP_MEMORY_LIMIT', '500M' );
define( 'WP_MAX_MEMORY_LIMIT', '512M' );
define( 'FS_METHOD', 'direct' );
```

There's no way to set these via ENV vars, so we have to do this weird injection.

We also need to tell PHP to allow us to upload larger files. In `php.ini` I have:

```
upload_max_filesize = 500M
post_max_size = 530M
memory_limit = 600M
max_execution_time = 300
max_input_time = 300
```

This is mounted to a directory that PHP checks for ini files. It'll load this one last, so they won't get overwritten.

We'll get to the wp-content folder in a second.

## .env

The .env file you want is something like this:

```
MYSQL_ROOT_PASSWORD=bash_keyboard_for_a_bit
MYSQL_USER=bash_keyboard_some_more
MYSQL_PASSWORD=really_go_wild_with_randomness
```

At this point, you should be able to `docker compose up`. In fact, do that so we can sort out the wp-content folder.

## wp-content

You'll note that the final volume is the `wp-content` one. This is going to
replace the whole wp-content folder inside wordpress. You see it's commented
out right now. That's because we need to run docker-container to get it to
populate that directory, and then we want to copy the directory from the
container into place.

So, with it still running do this:

```
docker cp wordpress:/var/www/html/wp-content .
```

Then, stop the container. Uncomment the volume from your docker-compose.yml.

Now you can `git add .` and commit all of your wordpress set up.

You'll note that you're adding tonnes of wordpress files. But, they're the ones
which you'll want to be editing. Themes, which you may want to delete, add, or
change. Same as plugins. So it makes sense you want them in your git version
control.

### and the media?

In a bit, you'll see that it also includes all the media you upload. I think
this is fine too. It's certainly the gnarliest bit of this set up.

You certainly want this volume locally. Otherwise, it'll get throw away every
time you restart your container. In other tutorials (like the digitalocean one
above), you'll notice that they mount the whole of the wordpress codebase as a
the volume. This is not useful. It'll mean you'll be manually upgrading
Wordpress for ever, rather than just rebuilding to get the latest version.

So, you'll be manually `git add .` to store your uploaded content in git.

### missing the actual posts though?

Out of scope (because I haven't thought about it yet) is how to get the posts
out of the database to get them in git too, to be a real back up solution.
Maybe I'll work on this eventually.

## nginx

My config for this isn't terribly clean. It's a copy and paste of others that I
know work.

```
server {
    server_name shane.city;

    root /root/wordpress/html;
    index index.php index.html index.htm;

    location / {
        proxy_pass http://127.0.0.1:8987; # Forward to the exposed WordPress container port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;

        client_max_body_size 600m;
    }

    location ~ \.php$ {
        proxy_pass http://127.0.0.1:8987;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_index index.php;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;

        client_max_body_size 600m;
    }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
}
```

I'm just now noticing that my `root` directive is wrong. But everything seems
to be working, so hey ho.

You can actually add this config file to you git-versioned folder too! Then use
`ln -s` to link that file to your `/etc/nginx/sites-enabled` directory.

Remember to run certbot as normal to get SSL.

Do a quick `nginx -s reload` and then start your container again and your
wordpress install should be up.
