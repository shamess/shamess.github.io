---
layout: post
title: Access object throughout request lifecycle with CurrentAttributes
date: 2022-12-22 11:58 +0000
---

The use case I recently had was that a `Cache-Control` header was being sent in
by the requester, and I needed the value of that header really quite deeply
into the application. I needed to store a variable throughout the
request-response life cycle.

There's a Rails solution in [CurrentAttributes].

```ruby
# app/models/response_headers.rb
class ResponseHeaders < ActiveSupport::CurrentAttributes
  attribute :cache_control
end

# app/controllers/home_controller.rb
class HomeController < ApplicationController
  before_action :set_cache_headers

  def index
  end

  private

  def set_cache_headers
    ResponseHeaders.cache_control = request.headers.fetch('Cache-Control', '')
  end
end

# app/lib/something_else.rb
class SomethingElse
  def cache_headers?
    ResponseHeaders.cache_control.blank?
  end
end
```

## Threads

My initial implementation just used `Thread.current[:response_headers]`
directly and storing a singleton there.

As far as I know, CurrentAttributes is just sugar around that, and when you
have a library already inside your codebase doing the thing you want to do,
just lean on that to hide away complexity. CurrentAttributes leads to a fairly
clean looking object and only a little documentation to understand what's going
on.

It has all the problems that come with threads though: if you spin up a thread
to do some other piece of work, it won't have access to the CurrentAttribute'd
object. (Or it will, but it will be a new instance.)

It's not all that typical to use threads (in my experience), so you may not
think you're using any but double check your other libraries. Many HTTP client
libraries will use threads to parellelise requests.

[CurrentAttributes]: https://api.rubyonrails.org/classes/ActiveSupport/CurrentAttributes.html
