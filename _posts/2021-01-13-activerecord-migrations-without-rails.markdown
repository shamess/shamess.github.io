---
layout: post
title:  "ActiveRecord Migrations without Rails: Is This How It Works?"
date:   2021-01-13 19:45:05 +0000
---

I often start (short lived) projects in plain old Ruby, and then I realise I need models with persistance and think, "oh, this should have been a Rails app".

Anyway, this happened and I decided to see how modular the Rails bits actually are. ActiveRecord has a life of its own, usable outside of Rails, so maybe I can sprinkle that in. 🌈

`< ActiveRecord::Base` works super well. Marvelous job their, team.

Where I fell down a rabit hole for a while was with the migrations. I'm totally dependant on `bundle exec rails db:migrate` to run them and that obviously doesn't come with Rails-less ActiveRecord. At this point, my project didn't even have Rake in it.

I mean, I guess it's fine that I have to write my own. But it feels like these things should live inside ActiveRecord, right? But if there's a simple place I can `require 'active_record/secret_tasks'` that'd be cool.

Instead, I'm currently living off of something like this:

```ruby
namespace :db do
  require "active_record"

  require_relative "config/database"

  desc "Process the migration files in db/migrations"
  task :migrate do
    ActiveRecord::MigrationContext.new(["db/migrations/"], ActiveRecord::Base.connection.schema_migration).migrate
    Rake::Task["db:schema"].invoke

    puts "Done"
  end


  desc 'Create a db/schema.rb'
    task :schema do
      require 'active_record/schema_dumper'

      filename = "db/schema.rb"
      File.open(filename, "w:utf-8") do |file|
        ActiveRecord::SchemaDumper.dump(ActiveRecord::Base.connection, file)
      end
  end
end
```

Much of this comes from [a gist by schickling][gist] which I had to dig around for a while to figure out how to make their code work in Rails 6.

_REAL TIME UPDATE:_ Further down in that thread, diegodurs had already done all this work and even found that `connection` comes with its own `migration_connection`. I wish I had scrolled down that far...

This is still leaving us with some cobbled together Rakefile at the whims of low attention spanned developers doing rework. Rails already has all these cool, implemented as intended, features. Is the code hidden in there somewhere?

I'm not very good at spleunking through code I don't have to work with every day. [This is at least a rake file][rake_file] and looks so close to what I want, but then something weird is happening in `app_task`. There's a magic(?) (it's all magic until I understand it, I suppose) `APP_RAKEFILE` chilling in there. Which sort of leads us to [a `tt` file which is sort of ERB][tt], but I dunno who's building it. Is `dummy_app` our key here? No? Is it `bundler/gem_tasks`? Either way, its linking out to the respective rake files of other applications, so lets jump to ActiveRecord. But that only has [stuff about testing???][ar-rake]. There is a deeper down selection of tasks, but these quickly stop looking [like Rake things at all][what-is-this].

Will I ever return with an answer to all these questions? Who knows.

[gist]: https://gist.github.com/schickling/6762581
[rake_file]: https://github.com/rails/rails/blob/5cfd58bbfb8425ab1931c618d98b649bab059ce6/railties/lib/rails/tasks/engine.rake
[tt]: https://github.com/rails/rails/blob/5cfd58bbfb8425ab1931c618d98b649bab059ce6/railties/lib/rails/generators/rails/plugin/templates/Rakefile.tt
[ar-rake]: https://github.com/rails/rails/blob/5cfd58bbfb8425ab1931c618d98b649bab059ce6/activerecord/Rakefile
[what-is-this]: https://github.com/rails/rails/blob/5cfd58bbfb8425ab1931c618d98b649bab059ce6/activerecord/lib/active_record/tasks/database_tasks.rb
