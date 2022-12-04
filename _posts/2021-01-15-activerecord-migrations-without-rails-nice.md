---
layout: post
title: 'ActiveRecord Migrations without Rails: Nice'
date: 2021-01-15 00:24 +0000
---

You can get Rake-based ActiveRecord Migrations in your non-Rails project with
only the smallest amount of massaging.

If you're like me, you've been missing the nice ability to simply do `rails
db:migrate` since this is a feature that's mostly missing if you're outside of
Rails. The good news is that it hasn't gone too far away, but does still
require a little effort to get working.

You'll have to create your own Rakefile to stock with your tasks. Fortunately,
most of the work behind the Rails db tasks are all [behind single method
calls][tasks]. So, to add migrations and schema dumps, you can do the
following:

```ruby
namespace :db do
  require "active_record"
  require_relative "config/database"

  require "active_record/tasks/database_tasks"
  ActiveRecord::Tasks::DatabaseTasks.db_dir = "db/"

  desc "Migrate the database"
  task :migrate do
    ActiveRecord::Tasks::DatabaseTasks.migrate

    puts "Done"
  end

  desc 'Create a db/schema.rb'
  task :schema do
    db_config = ActiveRecord::Base.connection_db_config

    ActiveRecord::Tasks::DatabaseTasks.dump_schema(db_config)

    puts "Done"
  end
end
```

This is much better than [my previous efforts][previous-efforts] because it's
no longer monkeying with fairly internal tools to ActiveRecord. This is a
slightly more open API for running these tasks, which'll keep working so long
as Rails continues using them.

Even though I linked to the DatabaseTasks file myself, I didn't actually read
it properly. In the end it was none other than the ex-CTO of the worlds best
altmetrics provider and current provider of excellent technical services, [Paul
Mucur][mudge] that lead me to the water on this one.

[tasks]: https://github.com/rails/rails/blob/5cfd58bbfb8425ab1931c618d98b649bab059ce6/activerecord/lib/active_record/tasks/database_tasks.rb#L229
[previous-efforts]: https://technicallyshane.com/2021/01/13/activerecord-migrations-without-rails.html
[mudge]: https://mudge.name/
