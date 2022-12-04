---
layout: post
title: Worknotes - March
date: 2021-04-06 17:24 +0100
---

My goodness, what a strange month.

Recruitment continues to be a big priority for us; we’re still on the lookout
for a [senior developer][hiring]. We approached a recruitment service this month though,
which has been hugely beneficial. They’re given us many more candidates than
we’ve been able to find on our own. They’ll be awfully expensive in the end,
but along with death and taxes, recruitment being expensive is something which
might just hold as an inescapable truth. We’ve begun talking to more PHP
developers – Altmetric is largely Ruby, but there’s a chunk of PHP. Our
assumption is that if we’re going for a senior role, many of the skills learned
by a PHP developer should be transferrable to other languages. This has not
been the case for all of our candidates so far, which I’ve found interesting.
In some cases, we’ve seen candidates paralysed by take-home tests where they
can’t lean into their favoured MVC framework.

There’s also this odd thing where some developers will exclusively use
`index.php` as an entry point into their code, even when building an executable
PHP file, and not something to be served by a web server. The first time this
happened, I thought it was curious, but the second and third time it happened I
started questioning my own thinking around the convention…

The dev team also had some conversations around [Rocksteady][rocksteady], our
deployment-with-Nomad automation tool. One of the features of Rocksteady is
that it gives you a big ole textbox to write in your Jobspec. This is stored
within Rocksteady and comes with some downsides. The two big ones we need to
tackle are: lack of version control and lack of peer review of changes. The
first one is sort of handled by Nomad, but not permanently.

My favourite suggestion so far: jobspecs, like Dockerfiles, live alongside the
git repository they manage. This way, you can make your code change to the
project and have the jobspec change appear alongside it, in the same pull
request. Deploying an older branch (or a staging branch) is done as normal, and
the related jobspec is used to start the job.

There are more ideas though, and I’m sure the Altmetric team will talk about
them louder as we make progress on it.

And then, in March all hell broke loose when [our data centre set on fire][fire] and
half of our infrastructure was lost.

I say “all hell broke loose” to be dramatic, but in reality this was quite a
stress free major incident. Just a few weeks before we’d done a tabletop,
disaster scenario which lead us to improving some processes. We had no idea
they’d be put to the test shortly after though. We were better prepared for a
few parts: we communicated as much as we could with our customers to let them
know how far away from fully up-and-running we were throughout. The dev team
gathered around the following morning and assessed what needed to be done and
in what order. It’s at times like these where you get to be taken aback by how
professional and smart your colleagues are.

This was one of the points in a company’s life when its values get tested. One
of the longest lived principles Altmetric has is that we avoid “crunch” time as
much as we can. It would have been very easy, and justifiable, for senior
management to ask us all to work evenings and weekends to get us back to
normality faster, but our values held. People worked hard during the day,
knowing that they’d get their evenings and weekends entirely to themselves.
There were some exceptions here, but largely handled by our heroic SREs, who
I’m hoping will get chance to take a long break very soon.

Now that every has settled, we have a modest list of things we could have done
better. The thing which kicked us in the teeth the hardest wasn’t actually that
many of our servers were set on fire – Nomad largely moved everything to the
more typically temperatured boxes. The biggest issue we faced was the impact of
treating data in Redis as if it was permanently saved. There were a couple
decades-old keys in one particular Redis which, when missing, caused some data
corruption that we’d have to spend days cleaning up. So the lesson for the
future: Redis should be considered a lossy datastore, and if a key is missing,
it shouldn’t wreak havoc.

[hiring]: https://www.altmetric.com/jobs/senior-software-developer/
[rocksteady]: https://github.com/powerrhino/rocksteady
[fire]: https://www.theregister.com/2021/03/10/ovh_strasbourg_fire/
