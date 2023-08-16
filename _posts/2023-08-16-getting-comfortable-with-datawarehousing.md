---
layout: post
title: Getting more comfortable with data warehousing
date: 2023-08-16 17:01 +0100
---

For the past week or so [my tech lead](https://fosstodon.org/@leapingfrogs) has been super patient with me whilst I've been getting more comfortable with working with Snowflake. I've grokked a few lessons finally and picked up a few tips, so I wanted to share them here.

## INNER JOIN as required, \[LEFT] JOIN as optional.
This one I definitely did already know, but only by having to look up the venn diagram each time. Working with Snowflake this week has unlocked another way of thinking about JOINs.

`INNER JOIN` is akin to `belongs_to`, where Rails gets very upset when the other part of the relationship is missing. `LEFT JOIN` is more like `belongs_to :.., optional: true`. The record you're searching for will still be returned, but the joined record may just be full of null values.

(I'm sure the Rails analogy doesn't go much further than that.)

## INNER JOINs to exclude data
Usually the intent of joining two tables together is because you want data from both records in one place to further query over, aggregate, or some other function where the data from the second table is useful.

However, INNER JOINs are a useful tool to just enforce the existence of the second table's record. For instancing, looking for all `PhoneNumber`s which have received at least one call: `select phone_numbers.* from phone_numbers inner join calls on calls.phone_number_id = phone_numbers.id`.

## Joining across multiple datasets
This is more a feature of data warehousing, but it's hard to know how powerful this is until you need to make a few dashboards.

It's very nice being able to link together users from `users -> zendesk call -> zendesk deals -> orders`, and then maybe include in some Amplitude data. It's all very cool.

The biggest hurdle is knowing which data is a) available and b) sampled.

## Digging through JSONB
There are some places where we use Papertrail, which stores the changes in a JSONB column.

That means being able to do things like `select user_versions.object_changes:hair_colour` and Snowflake just plucks it out. Fantastic! It's especially cool that it doesn't require some complicated function to reference the JSON attributes: just a colon does it.

You can use those values anywhere in the SQL, not just the `select`.

## Working backwards from the graph
On more than a few occasions I felt a bit frozen with indecision whilst writing some of the queries I needed for a dashboard. Which tables will I need to join on to get the data I want? What kind of aggregation will be needed? Just knowing what the first characters to start typing was a bit overwhelming.

I found it makes more sense to me if I start with what I expect the graph to look like and then labelling where each component needs to come from. Say I want a graph showing the number of photos uploaded per user, over time. **The first step is figuring what what the graph will look like.** The X axis is probably going to be each date, the Y will be the number of photos. So what will the _table_ need in it? Well, the date and number of photos, grouped by the user, I guess. And that leads nicely into what the `select` needs to return, and from then joining tables until all the details fit into place.

This may seem very obvious now, but two weeks ago my instinct would have been to immediately jump into writing the SQL and going in circles for a while because I hadn't figured out my destination.

## WHERE 1=1
The statement `WHERE 1=1` might look strange at first, but it's very useful whilst drafting queries. Instead of

```sql
where speed < 0.2 and
	container = 'steel'
```

you can build your queries like this:

```sql
where 1=1
	and speed < 0.2
	and container = 'steel'
```

The query_plan is identical, but it's way easier to quickly comment lines out without having to affect the line before it.

```sql
where 1=1
	and speed < 0.2
	-- and container = 'steel'
```

## Get the latest record from a 1:M JOIN
So we want to know: what was the last modification that happened to a user? Say we want to output something like `user_id, latest_version_id`.

The problem is if you just join Users to UserVersions you'll get all of them, and there's no "just the latest, please!" function. Instead, we can use this windowing thing, which I just learnt today.

```sql
with latest_user_versions as (
	select *, ROW_NUMBER() OVER (PARTITION BY user_versions.item_id order by user_versions.created_at desc) as _row_number
	from user_versions
)
select latest_user_versions.item_id as user_id, latest_user_versions.id as latest_version_id
from latest_user_versions
where _row_number = 1
```

And then you'll get a table with the ID of latest Papertrail change log for the user.
