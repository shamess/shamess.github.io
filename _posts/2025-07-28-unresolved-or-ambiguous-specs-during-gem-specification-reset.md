---
layout: post
title: Unresolved or ambiguous specs during Gem::Specification.reset
date: 2025-07-28 10:35 +0100
---

I'm getting started writing a gem. I've worked on _many_ gems but it turns out writing one from scratch comes with gotchas you just have to learn.

My gem is now using Railties so I can start hooking into some Rails ActiveSupport::Notifications. However, after requiring it, I was getting this problem in the place where I was using the gem:

```
~/git/mirth (brokepoint-upgrade) $ bundle
WARN: Unresolved or ambiguous specs during Gem::Specification.reset:
      connection_pool (>= 2.2.5)
      Available/installed versions of this gem:
      - 2.5.3
      - 2.5.0
      - 2.4.1
      minitest (>= 5.1)
      Available/installed versions of this gem:
      - 5.25.5
      - 5.25.4
      - 5.25.2
      - 5.20.0
      logger (>= 1.4.2)
      Available/installed versions of this gem:
      - 1.7.0
      - 1.6.6
      - 1.6.4
      - 1.6.1
      - 1.6.0
      benchmark (>= 0.3)
      Available/installed versions of this gem:
      - 0.4.1
      - 0.4.0
      - 0.3.0
      nokogiri (>= 1.8.5, >= 1.6)
      Available/installed versions of this gem:
      - 1.18.9
      - 1.18.8
      - 1.18.4
      - 1.18.3
      - 1.17.2
      - 1.16.7
      rack (>= 2.2.4, >= 3)
      Available/installed versions of this gem:
      - 3.1.16
      - 3.1.14
      - 3.1.12
      - 3.1.10
      - 3.1.8
      rack-session (>= 1.0.1)
      Available/installed versions of this gem:
      - 2.1.1
      - 2.1.0
      - 2.0.0
      rack-test (>= 0.6.3)
      Available/installed versions of this gem:
      - 2.2.0
      - 2.1.0
      rails-html-sanitizer (~> 1.6)
      Available/installed versions of this gem:
      - 1.6.2
      - 1.6.0
      useragent (~> 0.16)
      Available/installed versions of this gem:
      - 0.16.11
      - 0.16.10
      erubi (~> 1.11)
      Available/installed versions of this gem:
      - 1.13.1
      - 1.13.0
      rake (>= 12.2)
      Available/installed versions of this gem:
      - 13.3.0
      - 13.2.1
      - 13.1.0
      thor (~> 1.0, >= 1.2.2)
      Available/installed versions of this gem:
      - 1.4.0
      - 1.3.2
      irb (~> 1.13)
      Available/installed versions of this gem:
      - 1.15.2
      - 1.15.1
      - 1.14.3
      - 1.14.1
      - 1.13.1
WARN: Clearing out unresolved specs. Try 'gem cleanup <gem>'
Please report a bug if this causes problems.
Bundle complete! 24 Gemfile dependencies, 130 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
```

It's just a warning, but it's a very noisy one.

The issue here, it turns out, is that I was requiring something in my gem (railties) before bundler had figured out what its dependencies were which means it cannot tell `gem` which specific gems to be loading.

My debugging of this also answered another question I've had for a while: why is it so common to define your gem's version number on a `brokepoint/version.rb`? Why not just stick it right in `brokepoint.rb` where the module is first defined?

## Code that triggers the warning

I shall try to make this example as concise as I can, but it is unfortunately spread across a number of files.

```ruby
# brokepoint.gemspec
require_relative 'lib/brokepoint'

Gem::Specification.new do |s|
  s.name        = 'brokepoint'
  s.version     = Brokepoint::VERSION
```

You see I just define the version below.

```ruby
# lib/brokepoint.rb
require_relative "./brokepoint/railtie"

module Brokepoint
  VERSION = '0.0.1'
end
```

```ruby
# lib/brokepoint/railtie.rb
require 'rails/railtie'

module Brokepoint
  class Railtie < Rails::Railtie
```

## The problem

Loading `lib/brokepoint.rb` when we ask for the version constant will also trigger that `require rails/railtie`. Bundler isn't ready for that yet! It's still in the process of just collecting metadata for the gems being loaded, and suddenly you're asking for all of Rails.

`rubygems` will be quite happy to find a version of Rails for you, based on your `require rails/railtie`, it'll be a gamble what version of Rails you'll get. It likely won't match the version constraints you've set in your Gemfile.

So, it gives you that warning.

## The fix

We need to avoid loading all of our library too early. *That's why people load only their version constant!*

```ruby
# brokepoint.gemspec
require_relative './lib/brokepoint/version'

Gem::Specification.new do |s|
  s.name        = 'brokepoint'
  s.version     = Brokepoint::VERSION
```

```ruby
# lib/brokepoint/version.rb
module Brokepoint
  VERSION = '0.0.2'
end
```

```ruby
# lib/brokepoint.rb
require_relative "./brokepoint/version"
require_relative "./brokepoint/railtie" if defined?(Rails::Railtie)

module Brokepoint
end
```

So now loading the gem only triggers the constant. And then later calling other parts of the gem will trigger the full thing. Without the annoying warning message!
