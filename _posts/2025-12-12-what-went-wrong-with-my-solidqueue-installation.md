---
layout: post
title: What went wrong with my SolidQueue installation?
date: 2025-12-12 00:45 +0000
---

You're joining me *in medias res* as I've completely broken my application
whilst trying to add SolidQueue. I'm writing this *now* for two reasons. First,
I keep intending to write up debugging sessions and then, when the debugging
has culminated in a working software, I move on quickly to *using* the working
software rather than lingering on the past. Second, we all know that this kind
of writing is good [rubber
ducking](https://blog.codinghorror.com/rubber-duck-problem-solving/).

I don't expect this bug to end up being something world changing - it may well
be a typo. It might also be fun for you to spot the issue before I do, like a
murder mystery.

I'm trying to set up SolidQueue, adding it to my already-set-up Rails
application. (ie. I don't _think_ there was any ActiveJob configuration before
my work today.)

So let me show you exactly where we are right now, and I'll fill in some
details as we go both forwards and backwards in time:

```
shane@macbook tollport/ (activejob) % bundle exec rails db:prepare
Created database 'tollport_queues_development'
Created database 'tollport_queues_test'


shane@macbook tollport/ (activejob) % bin/jobs
/Users/shane/git/tollport/vendor/bundle/ruby/3.2.0/gems/activerecord-8.1.1/lib/active_record/connection_adapters/postgresql/database_statements.rb:167:in `exec': PG::UndefinedTable: ERROR:  relation "solid_queue_processes" does not exist (ActiveRecord::StatementInvalid)
LINE 10:  WHERE a.attrelid = '"solid_queue_processes"'::regclass
                             ^

        from /Users/shane/git/tollport/vendor/bundle/ruby/3.2.0/gems/activerecord-8.1.1/lib/active_record/connection_adapters/postgresql/database_statements.rb:167:in `perform_query'
        from /Users/shane/git/tollport/vendor/bundle/ruby/3.2.0/gems/activerecord-8.1.1/lib/active_record/connection_adapters/abstract/database_statements.rb:571:in `block (2 levels) in raw_execute'
```

We can see here that `db:prepare` creates a couple of new databases for us.
It's done this because when you run `bin/rails solid_queue:install` it'll add
some configuration as well as adding `db/queue_schema.rb`. That file is
_supposed_ to contain the database schema for SolidQueue. But...

It does not. In fact, it is just a copy of my normal schema.

```
shane@macbook tollport/ (activejob) % diff db/schema.rb db/queue_schema.rb | wc
       0       0       0
```

Well, that explains _exactly_ why `solid_queue_processes` isn't being created -
it's not defined anywhere.

How the heck did that happen though? I'm very willing to accept that I've done
something funky to make this happen. I have a suspicion, and I'll try to
recreate that issue again in a second (because I think it might be an
unfortunate Rails bug).

First, lets see if we can fix this issue by deleting the incorrect
`db/queue_schema.rb` and running `bin/rails solid_queue:install` again.

Good news:

```bash
shane@macbook tollport/ (activejob) % grep 'create_table' db/queue_schema.rb
  create_table "solid_queue_blocked_executions", force: :cascade do |t|
  create_table "solid_queue_claimed_executions", force: :cascade do |t|
  create_table "solid_queue_failed_executions", force: :cascade do |t|
  create_table "solid_queue_jobs", force: :cascade do |t|
  create_table "solid_queue_pauses", force: :cascade do |t|
  create_table "solid_queue_processes", force: :cascade do |t|
  create_table "solid_queue_ready_executions", force: :cascade do |t|
  create_table "solid_queue_recurring_executions", force: :cascade do |t|
  create_table "solid_queue_recurring_tasks", force: :cascade do |t|
  create_table "solid_queue_scheduled_executions", force: :cascade do |t|
  create_table "solid_queue_semaphores", force: :cascade do |t|
```

Way better. Bad news:

```bash
shane@macbook tollport/ (activejob) % bin/jobs
/Users/shane/git/tollport/vendor/bundle/ruby/3.2.0/gems/activerecord-8.1.1/lib/active_record/connection_adapters/postgresql/database_statements.rb:167:in `exec': PG::UndefinedTable: ERROR:  relation "solid_queue_processes" does not exist (ActiveRecord::StatementInvalid)
LINE 10:  WHERE a.attrelid = '"solid_queue_processes"'::regclass
                             ^
```

Checking the table shows that it definitely has created the correct schema. And
our "undefined" table is there.

```sql
shane@macbook tollport/ (activejob) % rails dbconsole --database queue
psql (13.1)
Type "help" for help.

tollport_queues_development=# \dt
                     List of relations
 Schema |               Name               | Type  | Owner
--------+----------------------------------+-------+-------
 public | ar_internal_metadata             | table | shane
 public | schema_migrations                | table | shane
 public | solid_queue_blocked_executions   | table | shane
 public | solid_queue_claimed_executions   | table | shane
 public | solid_queue_failed_executions    | table | shane
 public | solid_queue_jobs                 | table | shane
[...]
 public | solid_queue_processes            | table | shane
[...]
(13 rows)
```

Is SolidQueue using the write database?

Ah - well, this is telling of something. And not just about my potential bug.
Running `solid_queue:install` only bothers to tell SolidQueue to run on this
special database for 'production'.

```bash
shane@macbook tollport/ (activejob) % grep -r 'solid_queue.connects_to' config/
config/environments/production.rb:  config.solid_queue.connects_to = { database: { writing: :queue } }
```

Whereas I have this new database set up for all environments, at least in
`config/database.yml`. A lot of config is passed via the DATABASE_URL env var.
More on that very shortly.

```yaml
default: &default
  adapter: postgresql
  [...]

development:
  primary:
    <<: *default
    database: tollport_development
  queue:
    <<: *default
    database: tollport_queues_development
    migrations_paths: db/queue_migrate

[...]

production:
  primary:
    <<: *default
    database: tollport_production
  queue:
    <<: *default
    url: <%= ENV.fetch('QUEUE_DATABASE_URL', nil) %>
    database: tollport_queues_production # this does nothing as `url:` tasks precedence, leaving here as an example of what's in QUEUE_DATABASE_URL
    migrations_paths: db/queue_migrate
```

First, I want to quickly confirm my suspicion and answer the question at hand:
is SolidQueue using the write database? Lets make all environments use this
queue database. Moving the above SolidQueue config from
`config/environments/production.rb` to `config/application.rb` gets us going
again. `bin/jobs` works!

The "telling" aspect I mentioned earlier leads me to this: since
`solid_queue:install` didn't add that configuration to `config/application.yml`
in the first place, the developers probably don't intend you to have the two
databases for dev and test. But, as it's working, and I don't really mind, I'll
let that particular issue be. When following the installation instructions, I
assumed it wanted me to add the new 'queue' to each of the environments. The
docs only mentions `production` though.

So, I had two issues:

1. SolidQueue's schema, which `db:prepare` uses, was straight up wrong.
2. SolidQueue was not aware of the `queue` database whilst in dev.

By deleting the queue_schema.rb and re-installing Solid Queue, I fixed the
first issue. But how did it happen in the first place?

Well, I'm guessing now because I no longer have the commit, but I believe I
messed up my database.yml.

Before this `activejob` branch, my config looked more like this:

```yaml
default: &default
  adapter: postgresql
  encoding: unicode

development:
  <<: *default
  database: tollport_development
```

This is a single database set up. The Rails magic here is that this single
database is called `primary`. To make it a multi-database set up, you add in
the database names:

```yaml
development:
  primary:
    <<: *default
    database: tollport_development
  queue:
    <<: *default
    database: tollport_queues_development
    migrations_paths: db/queue_migrate
```

However, I believe I originally did something like this **which is wrong**:

```yaml
development:
  <<: *default
  primary:
    database: tollport_development
  queue:
    database: tollport_queues_development
    migrations_paths: db/queue_migrate
```

And I can only imagine that that confused the heck out of Rails so much that my
issue happened.

ah well, all working now.
