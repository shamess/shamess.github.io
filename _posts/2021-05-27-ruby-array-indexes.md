---
layout: post
title: Ruby Array indexes (and ranges)
date: 2021-05-27 15:57 +0100
---

A Ruby array looks a bit like this:

```
scooby_doo_characters = [ 'Daphney', 'Fred', 'Scoob', 'Scrappy', 'Shaggy', 'Velma' ]
```

You might also see it defined with a [percent string][percent]. Or even through `Array.new`.

## ary[index]

However you make the array, you'll be able to refer to items in the same way.

```
puts scooby_doo_characters[2]

# => Scoob
```

It's worthwhile knowing that arrays, like in many languages, are indexed starting from 0. So, `[0]` is the first item in an array. Another fun, special kind of index are negative numbers, for instance where `[-1]` is the final element. `[-2]` is the penultimate one.

```
puts scooby_doo_characters[-2]

# => Scoob
```

<div style="border: 1px dashed #2f5b71; background-color: #2f5b71; border-radius: 5px; margin: 15px; padding: 15px; color: white;">
Fun fact: `-0` isn't a valid index. Or rather, it is, but you'll just be getting `[0]`, as -0 is the only number that everyone agrees is where maths has gone too far.
</div>

## ary[start, length]

The way you grab just a chunk of an array is passing a second argument to it.

```
scooby_doo_characters[1, 3]

# => ['Fred', 'Scoob', 'Scrappy']
```

This is the exact same method as if we were to use `slice(1, 3)`. The thing that always confuses me is that the second argument is the number of items you want returned, not the index to stop at. The impact is that, if you want the all but the last three elements, you can't do something like:

```
scooby_doo_characters[1, -3]
```

Negative lengths do nothing, but it's worth baring in mind that they do not error. 100% percent of the time I use `ary[start, length]` I introduce this bug.

<div style="border: 1px dashed #2f5b71; background-color: #2f5b71; border-radius: 5px; margin: 15px; padding: 15px; color: white;">
The `[]` notation is actually just a method call with a funny looking name; you can make your own `def [] (key)` and `def []= (key, item)` methods if you want. `[]` is special, in that you can't use most other characters. `def () (key)` is not a thing.
</div>

## ary[range]

There's a final way to refer to elements in arrays, which is to give it a range.

Ranges are another feature of Ruby which give you a thing to iterate over. You can make 'em with `Range.new(1, 3)`, but more frequently you'll see them as `(1..3)` (inclusive) or `(1...3)` (not including 3). You can iterate straight over these, using `each` and whatnot, but to see their values on IRB or some much, you can `to_a` them.

<div style="border: 1px dashed #2f5b71; background-color: #2f5b71; border-radius: 5px; margin: 15px; padding: 15px; color: white;">
You can throw ranges straight into arrays, by splatting them. `[*1..3]` is the same as `(1..3).to_a`. However, it looks very odd, and I don't like it. It's a very difficult thing to Google for if you're not familar with it. In fact, the whole reason for this blog post was because I came across `[*?a..?z]` which confused the check out of me.
<br />
<br />
`?a` is just a shorthand for `'a'`, but lead me on a fruitless trail looking for what `*?` did.
</div>

You can give ranges to split out items you want. The following two lines output the same thing:

```
scooby_doo_characters[1, 3]
scooby_doo_characters[(1..3)]
```

Now, if you do `(1..-3).to_a` you don't get anything returned. It's not a valid range. If you try to iterate over it, it will take zero cycles. However, for some exciting reason, you can pass them to `ary[range]`. It does exactly what I wanted earlier: give me the elements from one, until the third last.

```
scooby_doo_characters[(1..-3)]

# => ["Fred", "Scoob", "Scrappy"]
```

My assumption was that under the hood, the Array would use the Range to tell it what indexes it should use, turning it back into a simple `ary[index]` call. It would stop when Range runs out of items. That's not happening though, as Range can only count upwards. In fact, it doesn't even know how to count upwards, but rather needs a `succ` method to tell it what the next value is. The reason the Range can get from 1 to 2 is because `1.succ => 2`. It simply keeps going until the current value is equal to the end value.

So what the heck are Arrays doing?

To understand that, we need to [try to follow the C code][c-code], get frustrated with it, and then realise there's a lovely comment explaining it all.

You can see, it completely ignores the enumerative nature of the Range, treating it as a data structure to simply hold the `start` and `end` values. It never needs to call `each` (or similar) on the Range. And doesn't care what the `first` or `last` values are.

When the `end` is negative, it does some work to figure out how from the end that number is, and then can figure out how many elements we want returning. From there, it can simply go back to `ary[index, length]`.

## Enumerator::ArithmeticSequence

For completeness, I should mention that you can also pass a `Enumerator::ArithmeticSequence` as a range. This is basically a range with larger than 1 step between each number.

[percent]: https://docs.ruby-lang.org/en/2.0.0/syntax/literals_rdoc.html#label-Percent+Strings
[c-code]: https://github.com/ruby/ruby/blob/8b00bfb7c2c33827490c78a16c44b102cb0d724b/array.c#L1762
