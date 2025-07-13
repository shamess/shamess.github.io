---
layout: post
title: ActiveRecord Relationships and POROs
date: 2025-07-13 09:15 +0100
---

<style>
.in-short {
    background-color: #9182ff;
    margin: 5px;
    padding: 10px;

    border: 1px solid black;
    border-radius: 10px;

    .title {
        font-weight: bolder;

        border-bottom: 1px solid black;
    }

    div {
        padding: 5px;
    }
}
</style>

<div class="in-short">
    <div class="title">In short</div>

    <div><strong>Problem:</strong> I have an ActiveRecord polymorphic `belongs_to` relationship between an Inventory and various inventory owners. The owners are all also ActiveRecord models. The problem arises when one of the 'owners' is not an ActiveRecord model. Is it possible to have a `belongs_to :some_plain_old_ruby_object`?</div>
    <div><strong>Current state of problem:</strong> This is too much *fighting the framework*. Just give the PORO a table and be done with it.</div>
</div>

Here's some code to lay the land for this idea.

```ruby
class Inventory < ApplicationRecord
	# polymorphic relationship requires an owner_type and owner_id on
	# the Inventory, which is used to look up the owner based on assumed
	# and conventional table names.
	belongs_to :owner, polymorphic: true

	# not needed for the example, but may help show how the Inventory is
	# used
	has_many :item_slots

	# allows 'tagging' inventories with key-value properties
	include Taggable
end
```

```ruby
class Player < ApplicationRecord
	has_one :inventory, as: :owner
end

class LevelCoordinate < ApplicationRecord
	has_one :inventory, as: :owner
end
```

*Of course,* players are database-backed models. There's loads of them, with state to keep track of. Less obviously, LevelCoordinate is the same: lots of them with their own details to be saved. And they both have inventories.

With our inventory and a few inventory-users set up, we can do things like ask "where is the Item::ShineyRock right now?" A query like this works really well.

```ruby
Inventory.joins(:item_slots).find_by(item_slots: { item: Items::ShineyRock.name }).owner
```

## The wrinkle

There is a class like this which does not have any need to be in the database, so we skip ActiveRecord. It *does* need an Inventory though, for all the stuff that people chunk into it to be stored. We can try to wrangle this.

```ruby
class Dumpster
	ONLY_ID = 1

	def inventory
		Inventory.create_or_find_by(
			owner_type: "Dumpster",
			owner_id: ONLY_ID
		) do |inventory|
			inventory.width = 500
			inventory.height = 400
		end
	end
end
```

But of course, Rails tries to do a bunch of validations on this new relationship. We get back a fairly unenlightening error:

```
mirth(dev)> Dumpster.new.inventory
  TRANSACTION (0.2ms)  BEGIN
  TRANSACTION (0.2ms)  ROLLBACK
app/models/dumpster.rb:5:in `inventory': undefined method `current_scope' for class Dumpster (NoMethodError)

        elsif (scope = klass.current_scope) && scope.try(:proxy_association) == self
                            ^^^^^^^^^^^^^^
        from (mirth):5:in `<main>'
```

What I began doing was adding in many of the methods that it complains about, but the rabbit hole gets quite deep. Eventually, I ended up digging around in the bowels of ActiveRecord private APIs to try and replicate them.

### Previous attempts

There was very recently someone else asking a similar question over on the rubyonrails discussion forum: [Polymorphic association, can I have one association not backed by a table?](https://discuss.rubyonrails.org/t/polymorphic-association-can-i-have-one-association-not-backed-by-a-table/89269) However, their solution does not work here.

I spotted a gem (which seems to have vanished) which followed the same idea, and is unable to get passed the `current_scope` issue above.

### Can we do something on the Inventory?

I was hoping to find some place to inject my own bit of logic: if the owner_name is "Dumpster", then bail out early and just return my singleton-like object and stop before we start making calls the database.

I couldn't find anything that fit the bill though.

## Fighting against the framework

Ultimately, I've fallen into a fairly common trap when working with opinionated frameworks: forcing it to do something it does not want is not going to work.

Instead, I'm following the normal way of doing these kind of relationships and have made Dumpster into an ActiveRecord. It's table will only ever have one Dumpster in it, and probably only ever an ID with no other attributes, but it does Just Work.
