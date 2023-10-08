---
layout: post
title: Building something in Rails
date: 2023-10-08 17:39 +0100
---

*I keep intending to write about the aspects of software development that I'm learning whilst working on my personal project. It feels important to write about it because it's very rare that a greenfield project comes along and I have make decisions which ordinarily are decided on by much more forward-thinking team mates. It's rare enough that I need to think about, say, Docker deployment that I will not remember the lessons learnt next time. Those who do not learn history really are doomed to repeat it.*

*Nonetheless, each time I sit down to write I'm distracted by format, storytelling, code blocks, and intimidated by making public my experience in fear of revealing my lack of experience. Lets put all that aside and focus on just writing down how my project currently works, with no expectation that it's the perfect solution but actually a just work in progress.*

*If you'd like to suggest improvements, corrections, or different technologies: please do so, however you're comfortable reaching out. However, don't be offended if I don't quickly change my attention to your welcomed comments. This is a hobby project so I tend to only work on bits which are interesting at the time, which changes every time I sit down to work on it.*

*This is a living blog post.*

## The game
For context, here's what the project is.

The project is *Institute of Adventurers*, which I usually just call *Institute*. It's no longer an apt name, but that can change later.

The game initially started as a sort of idle clicker, but without the clicking, where the player sets-and-forgets a quest for their Party of Adventurers. A few hours later, the Party comes back, and the player gets excited about what loot they've found. To get to the Quest Location, the Party stop at Locations along the route, where they may buy or sell resources. (Also all automated.) They may discover other paths, or other Quest Prompts which the player can use to send their Party off again later.

The aim to make something a player might spend twenty minutes on, and then not have to return to until tomorrow. Just a quick thing to add as part of your daily routine, that maybe you do whilst on the bus or whilst waiting for the peas to boil. This is directly apposed to Tribal Wars, for instance, where not checking for a few hours might mean you've lost everything.

The game tries to stick to my [3 Principles](https://haikushane.com/2019/02/11/3-principles-of-the-game-i-want/), which requires the player to predefine what they want their character to do, and then they let the character get on with it. That means that the world has to run largely by itself and any NPCs need to be actively sustaining themselves. After some development, I realised that the NPCs are identical to players except that they run on "reasoning engines" rather than a human decided course of action. That realisation has lead to the game becoming more and more of a simulation, and I've sort of forgotten about the player as it goes on. The last few weeks of development has been focused on implementing the Kobold's hunt/steal-explore-settle-populate cycle and the Phoenix's hunt-populate cycle.

There's a 4th Principle I'm sliding into this project too: no one is telepathic and information does not travel instantly. If a Party find a new town on their way to the Shattered Mines, the player will not find out about this until the Party return. I think this adds a huge amount of realism, especially for NPCs, but does end up being a bit awkward to implement: I've got many KnowLocation (Party ID, Location ID) and KnownPurchaseOrder (entire copy of the Order) style tables where knowledge is kept track of and synced only when the player and Party meet up again, so to speak. I really like the idea of a Party not returning, and the player having no idea why. Should we send another party after them to investigate?

## Tech and Arch
I don't think this needs to be a technically impressive project. There are rarely flexed fundamentals I could get better at, so I'm sticking to those.

This is a Rails project, with a Postgres database, leaning on scheduled Sidekiq jobs quite a lot. I'm using Hotwire. For asset compilation, I'm leaving it to whatever Rails 7 started me with. I've really no idea what that is (but guessing esbuild), and is something I'd like to learn more about.

Locally, I'm developing with a simple Procfile, all running on my Macbook.

```
web: bin/rails server -p 3000
js: yarn build --watch
css: yarn build:css --watch
sidekiq: bundle exec sidekiq
```

Nothing locally is in a docker container, and I think I'm alright with that. There's still a Docker Desktop performance penalty, so there's no upside at the moment for me to worry about that. Maybe if the project introduce a specificly required library I'll be forced to, but until then I'm happy with rbenv, bundle, and yarn keeping all my dependancies in sync between 'production' and development.

Speaking of production: nothing is public yet and is more like a staging server. Since I have sidekiq jobs running all the time, for Kobolds to collect their food and whatnot, I thought it would be fun to have a server running somewhere. This server is an old computer in my basement accessible only over Tailscale. That server is running each of the services in Docker containers, all on the one machine though.

Since I've had so little interest of late in enhancing the player-facing side of the game, the current, best way of seeing how the "simulation" is going is through database queries. I'm excited to start pulling out those queries into more attractive dashboards as some point soon.

## Dockerisation
The aim here is to be able to take an application and put it onto another machine quickly, without worrying about the state of that machine. If it can run Docker, then you can be fairly sure of how the application will run. Contrast this to the difficult days of making a new OVH server and carefully installing the right version of PHP by hand, and crossing your fingers that a compatible version of ImageMagick is still bundled with it.

So, when getting Institute set up on the basement server, I knew that it should be via Docker and not by making a `setupMachine.sh` script to install Ruby.

After dozens of "last try [wip]" commits, I finally ended up with a Dockerfile like this.

<!-- Taken at 7501e2baccccd0150b192f20b6e9f281a6cf76c8 -->

```Dockerfile
FROM ruby:3.2.2-alpine

ARG APP_VERSION=80

RUN apk add --update --no-cache \
      binutils-gold \
      build-base \
      curl \
      file \
      g++ \
      gcc \
      git \
      less \
      libstdc++ \
      libffi-dev \
      libc-dev \ 
      linux-headers \
      libxml2-dev \
      libxslt-dev \
      libgcrypt-dev \
      make \
      netcat-openbsd \
      nodejs \
      openssl \
      pkgconfig \
      postgresql-dev \
      tzdata \
      yarn 

ENV `RAILS_SERVE_STATIC_FILES`=true
ENV APP_VERSION=${APP_VERSION}

ENV BUNDLER_VERSION=2.4.10
RUN gem install bundler -v 2.4.10

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle config set deployment 'true'
RUN bundle config set path 'gem_cache'
RUN bundle check || bundle install
COPY package.json yarn.lock ./
RUN yarn install --check-files

COPY . ./

RUN bundle exec rails assets:precompile ; yarn build ; yarn build:css

ENTRYPOINT ["./entrypoints/docker-entrypoint.sh"]
```

Because it took so, *so* many revisions to get working I'm not sure which bits are left in during wild debugging, and which bits are important. For instance, all those libraries are copy and pasted from somewhere else: I may not need them all. I'll come back to this soon clean it up, but whilst it's working it's not a huge priority.

### Asset precompilation issue

One egregious bug was around **asset compilation**.

The Rails app would fail to load a page due to the assets being missing. Even after `docker exec -it institute_app_1 /bin/sh`ing and running the `assets:precompile` step again, nothing was fixed.

A clue that I missed was that running `bundle exec rails assets:precompile` actually did all the work to make the asset files (which I should have noticed were missing from `public/assets/`). Typically, running precompile *a second time* will not output as much debug as the first time.

After trying to understand if it was an nginx issue (this in hindsight was a silly avenue to take, as it was clearly Rails that was failing to find the assets), and then playing around with `RAILS_SERVE_STATIC_FILES` for much too long, I spotted the issue. I had this:

```Dockerfile
RUN rails assets:precompile ; yarn build ; yarn build:css
```

`rails` is not in the `$PATH`, and was actually failing with a single "can't find rails" before spitting out loads of JS and CSS info lines.

I spotted this by eventually slowly reading the Docker output on build, which wasn't top of mind because I had Github doing this for me.

**Some points of investigation:**
- `assets:precompile` makes sense, but why are we following up with yarn? What is `precompile` if `yarn` is needed to compile also?
- Why didn't the docker build fail when `RUN` had a failing command? Was it because it was followed up by a command that eventually succeeded?

### docker-compose

I did try for a short period of time to have Postgres and Redis be outside of containers. However I ran into two issues: networking for Postgres was more difficult than I expected, and it still ran into the same issue as I wanted to avoid for the app which was delicately `apt-get install`ing specific versions of libraries which would be clobbered the moment I wanted to run a different postgres version at the same time.

So, I followed the Internet's advice and am using `docker-compose`. This file is almost entirely copy and pasted from some other blog (who I'm afraid I can't remember the name of to attribute it).

<!-- Taken at 7501e2baccccd0150b192f20b6e9f281a6cf76c8 -->

```yml
version: '3.4'

services:
  app: 
    image: shamess/institute:latest
    # build:
    #   context: .
    #   dockerfile: Dockerfile
    depends_on:
      - database
      - redis
    ports: 
      - "3000:3000"
    volumes:
      # - .:/app
      - gem_cache:/usr/local/bundle/gems
      - node_modules:/app/node_modules
    env_file: .env-compose
    networks:
      - default
      - outside
  database:
    image: postgres:13.1
    env_file: .env-compose
    volumes:
      - db_data:/var/lib/postgresql/data
  redis:
    image: redis:7.2
  sidekiq:
    image: shamess/institute:latest
    # build:
    #   context: .
    #   dockerfile: Dockerfile
    depends_on:
      - app      
      - database
      - redis
    volumes:
      # - .:/app
      - gem_cache:/usr/local/bundle/gems
      - node_modules:/app/node_modules
    env_file: .env-compose
    entrypoint: ./entrypoints/sidekiq-entrypoint.sh
volumes:
  gem_cache:
  db_data:
  node_modules:
networks:
  outside:
    external: true
```

The `image` here is generated with Github Actions and popped onto Dockerhub.

Since I'm not using docker-compose during development, I don't run this locally. If I did, I believe I'd use `build` rather than `image`. I've left the commented out build code there, just in case I decide to. Same with the mounted `app`.

Also worth noting here is my `networks`, which *are* manually configured on the server. More on that later.

**Some points of investigation:**
- In situations where the dev is using this file in two environments, is a `docker-compose-local.yml` file typical?
- My assumption that running my application inside Docker locally is an assumption that's quite old. Is it still the case the virtualisation on Intel Macs is quite slow? There *are* a number of downsides to not using docker locally, including inconsistent service versions.
- When using this on production, what's the point of the `gem_cache`? Same with `node_modules`. I'm only running on Rails application on this server, with no intent of adding more right now. Is this a wasted volume? They're probably not expensive, but do add complexity to the build and this file.

### Entrypoints
The entrypoint script gets run each time the docker container is restarted, so that's where I've put various database maintenance bits. I've very low confidence that this is optimal.

<!-- Taken at 7501e2baccccd0150b192f20b6e9f281a6cf76c8 -->

```sh
#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

export RAILS_ENV=production

echo "db:create"
bundle exec rails db:create
echo "db:environment:set"
bundle exec rails db:environment:set RAILS_ENV=production

# echo "db:setup"
# bundle exec rails db:setup

echo "db:migrate"
bundle exec rails db:migrate

echo "db:load_world"
bundle exec rails database:load_world
echo "db:set_autoincrement"
bundle exec rails database:set_autoincrement

echo "server"
bundle exec rails server -b 0.0.0.0
```

I'm certain that the environment set up is incorrect here and could be cleaned up. Always setting this to production seems wrong, especially if there's an expectation that the image can be used locally also. This whole file is another case of "keep trying until it works".

For instance, `db:create` and `db:setup` get commented in and out as required.

**Some points of investigation:**
- There's also `db:prepare`. Which is the correct one to run here?

### Building
On merge to main, Github does much of the work to get the image built, shipped off to Dockerhub, and also deployed to the basement.

```yml
name: "Build & Deploy to Basement"
on:
  push:
    branches: [ "main" ]
concurrency:
  group: build
  cancel-in-progress: true
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:11-alpine
        ports:
          - "5432:5432"
        env:
          POSTGRES_DB: rails_test
          POSTGRES_USER: rails
          POSTGRES_PASSWORD: password
    env:
      RAILS_ENV: test
      DATABASE_URL: "postgres://rails:password@localhost:5432/rails_test"
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Install Ruby and gems
        uses: ruby/setup-ruby@55283cc23133118229fd3f97f9336ee23a179fcf # v1.146.0
        with:
          bundler-cache: true
      - name: Install node
        uses: actions/setup-node@v3
        with:
          node-version: 18.12.1
      - name: Set up database schema
        run: bundle exec rails db:schema:load
      - name: Assets
        run: yarn install ; yarn build ; yarn build:css
      - name: RSpec
        run: bundle exec rspec

  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Install Ruby and gems
        uses: ruby/setup-ruby@55283cc23133118229fd3f97f9336ee23a179fcf # v1.146.0
        with:
          bundler-cache: true
      - name: Lint Ruby files
        run: bundle exec rubocop --parallel

  build_docker:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - name: Install docker
        run: |
          sudo apt-get update
          sudo apt-get install ca-certificates curl gnupg
          sudo install -m 0755 -d /etc/apt/keyrings
          curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
          sudo chmod a+r /etc/apt/keyrings/docker.gpg
          echo \
            "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
            "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
            sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
          sudo apt-get update

      - name: Checkout code
        uses: actions/checkout@v3

      - name: Docker build
        run: docker build --build-arg APP_VERSION=${{ github.run_id }} -t shamess/institute:latest .

      - name: Docker login
        run: docker login --username shamess --password ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Docker push
        run: docker push shamess/institute:latest

      - name: Setup Tailscale
        run: |
          curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/focal.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
          curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/focal.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list
          sudo apt-get update
          sudo apt-get install tailscale

      - name: Login to tailscale
        run: sudo tailscale up --authkey=${{ secrets.TAILSCALE_AUTH }}

      - name: Upload docker-compose
        run: rsync -e 'ssh -o "StrictHostKeyChecking=no"' docker-compose.yml shane@100.75.250.65:apps/institute

      - name: Restart docker-compose
        run: ssh -o "StrictHostKeyChecking=no" shane@100.75.250.65 'cd apps/institute ; docker-compose down ; docker-compose pull ; docker-compose up --detach --build'
```

This file was also a great deal of toiling and wip commits, all squashed together later on to hide a winding and torturous path. So even more so than the Dockerfile, this script is full of bits which may not need to exist any more.

The `concurrency` section is [a rather nice Github feature](https://github.blog/changelog/2021-04-19-github-actions-limit-workflow-run-or-job-concurrency/). I'll often work offline, raise a bunch of PRs later on, and then merge them quite quickly. There's no need to deploy each of those individually (or use up my build minutes), so it cancels any builds when a newer build is queued.

```yml
concurrency:
  group: build
  cancel-in-progress: true
```

**Tailscale** is a very fun project, and allows me to keep the basement server off of the Internet, so to speak. It's only accessible within the VPN that Tailscale sets up. That means that Github also needs to add the CI container to my Tailscale. This works really well, and the credentials expire automatically shortly afterwards.

**Some points of investigation:**
- None of the version specified here match the Dockerfile and docker-compose.yml versions. Is there a way to automatically sync those?
- Why are assets compiled in the `test` block? Do we need them? If so, why don't we need `asset:precompile`?
- Is Alpine a better choice for this? Is it faster to build? (Probably faster to download!)
- Why doesn't the MagicDNS trick work on CI? "shane@100.75.250.65" should be "shane@basement".
- `StrictHostKeyChecking` is definitely something that can be fixed by adding the basement's public key to the `known_hosts` file. (Or something?)
- I bet I can make this more generic, and not reference basement specifically. Maybe looping through all tailscale server tagged with "institute" and have the deployment run on each.
- Zero down time? More like "30 - 60 seconds down time".
- Wouldn't Kamal just take care of all of `Restart docker-compose`?
- This is missing anything to do with migrations (which I've not have to run since adding this deployment).
