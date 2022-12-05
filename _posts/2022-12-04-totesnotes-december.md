---
layout: post
title: Totesnotes - December
date: 2022-12-04 12:30 +0000
---

It's been a very strange couple of weeks.

* One of the many things I learnt from [Tom Stuart's wasm series][wasm] is that
  `ri` is a thing. I set this up in vim: `nmap ,r byw :!ri <C-R>"<CR>` which
  may be my first custom remapping. "Press `,r` in normal mode to 'select' the
  word under the cursor and open the Ruby docs for it."
  * Next day followup: Apparently vim has this by default! It's `<S-k>`. Thanks, [mudge]!
* I've revived [d20.social] as a personal mastodon host, after giving up
  on twitter. It's quite nice over here. I'm hoping to conversation around the
  "deadbird site" drops off soon, so it can be back to cool Ruby bits and nerdy
  D&D stuff.

  You're very welcome to join me over there, but you may find [ruby.social] to
  be more lively.
* Mastodon is a Rails piece of software, so I'm very comfortable finding my way
  around. My hope over the next few months is to get at least one contribution
  in to the project.
* Homebrew is both blessed and awful. A quick `brew install something` came
  with a `brew update` that dropped my vim colour scheme and I can't remember
  what the hell I had before. Also, for whatever reason, my `<C-R>` reverse
  search on my console has stopped working. It should be more like a Gemfile,
  with controlled versions that are easy to rollback.

  `brew bundle` exists, but with no way of managing versions.

  > Homebrew does not support installing specific versions of a library, only
  > the most recent one, so there is no good mechanism for storing installed
  > versions in a .lock file.
* Immediate followup: `bindkey '^R' history-incremental-search-backward` was
  missing from my zsh config. :shrug: I didn't remove it.

  Whilst I have it open, I've added `export HOMEBREW_NO_AUTO_UPDATE=1` to my
  .zshrc.
* I moved this blog to have github build it, rather than me. Until now, I only
  had the \_site directory in git, which felt dangerous and the opposite of
  what normally happens.
  * Next day follow up: after needing to edit a post, I usually need to get
  my laptop out. But now I can just edit it in Github and it'll all build
  happily!
* Taskmaster ended this week, with maybe the least fun contestant winning.
* Severance was a fantastic TV show. I believe it's renewed for a second
  series, but I've been thinking about if stopping the story at the end of
  series one would be a good writing tactic. Everything sort of resolved, but
  not quite.

  Anyway, I won't say more.
* Nanowrimo was not a huge success this time around. I've not finished my 50k,
  but the story is still chugging along.

[wasm]: https://www.youtube.com/playlist?list=PLGinoXCc3xS24Zy-Nj-5PjdFgbOctcHjH
[d20.social]: https://d20.social/shane
[ruby.social]: https://ruby.social
[mudge]: https://mudge.name/
