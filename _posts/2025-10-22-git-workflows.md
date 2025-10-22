---
layout: post
title: Git workflows
date: 2025-10-22 15:55 +0100
---

The most simple method of working with a Git repo is doing everything in the default branch. If you’re working in your own project, without having to think about other work conflicting with yours or having to review work before it can be deployed, then this is a perfectly good solution. Most of my hobby projects largely have work done in them on the default branch.

_I can't remember why I started writing this. I had it in my drafts. I'm setting it free._

> **“Default branch”**
>
> Many are used to having `master` as the default branch in a repository, but it’s fallen out of favour recently. In around 2020, the community decided that staring at a word all day with so much loaded connotations probably wasn’t good for mental health, some more so than others. Some have noted that the term was never meant in a master-slave way, but rather a “master copy” way. However, either way, it’s not a technically correct word for it. We’ll see in this article that it’s often not the master copy, and is often lagging behind the state of the art. So, `main` has been taken on as a less inaccurate (and mercifully shorter) name. It doesn’t have to be your default branch though. Change it to whatever you like. `git config --global init.defaultBranch main` So, we’ll just go with calling it the default branch for now.

## Working branches or the ‘GitHub flow’

I’d put money on this being the most common method of using a version control system. If you’re working on a team, or just working in parallel on different parts of the codebase, then it makes sense to have an area just for yourself: your own branch.

For each chunk of work, I’ll start off with `git checkout -b banjo-12393-fix-issue-with-signup`. Then in there, I’ll work away on fixing the issue.

Naming these branches is something to pay attention to. *Finding* the branch you’re working on can become difficult if you’re interrupted and have to look at something else for a while. So, many developers come up with their own system for these. My system is my team name, like a namespace to avoid bumping into anyone else, then the ticket number I’m working on, then a legible description of what of the problem being solved. It’s nice to do `git branch` and know what each of the branches are for. It’s also nice to be able to grep through `git branch | grep 12393` to find the branch I’m working on.

In my experience, these branches aren’t often shared between developers. The main reason for that is that there comes a point where you step on their toes. Say you add another commit to Alice’s branch, and now she has to *realise* that somehow, hopefully before pushing their work and overriding yours or having to handle a rebase. Leave these kinds of branches to the developer that created them.

Once the work is complete, this workflow usually leads to a pull request.

> **“Pull request”**
>
> There’s not really any such thing in the core of Git itself that specifies pull requests. Initially, the intended method of sharing code was to send a diff (or a patch) to someone and have them apply it on their end. Git is designed to be distributed - easily clonable elsewhere - but not intended as a team collaboration tool. When Linus Torvolds was putting Git together, there was no plan for everyone to be able to make a branch and push to the Linux kernal as they wanted. He expected patches to be sent around. The idea of a “pull request” was created by the community. In fact, much of the community (like Gitlab), prefer the term “merge request” which shows how non-standard the whole idea is. We’ll see in a bit that Git is not designed to handle dozens of developers working in the same repository synchronously.

That is then reviewed. I imagine most of us are lucky enough that we have a team around us who review our code before we merge it into the default branch. That kind of accountability is not the only reason to use these branches though; even working solo it’s good to create a pull request and review the code yourself. Often, it’s the first time you’ll see the whole changeset. It’s a good habit to self-review your code before you ask anyone else to.

Once reviewed, it gets merged into the default branch. You can then clear away your local branch *and* the branch on the remote. Stay tidy.

You may have read this section thinking “this is what I call a feature branch”, and I’d fully agree with you. I’ve gone with “working branch” here for two reasons: 1) often it’s not features that we’re working on, day to day, and 2) to distinguish it from what we all agree is called a feature branch. (Not until writing this post did I realise that I’d been calling the two things the same name, without issue.)

## Feature branches

In a sophisticated workflow that most engineers have come to expect, once your merge to the main branch, continuous integration will kick in and deploy to production automatically. At least, that’s the case in the web dev world. Outside of that, (say an iPhone app), I imagine that’s not always the case. However, when something lands in the default branch, it’s good behaviour for it to be shippable.

In working branches, discussed above, your work is reviewed and then deployed. That’s handy for releases of work that can be done in one ticket. Small features, bug fixes, and other discrete chunks of work.

There are times when you’re given a large amount of work, which is all expected to be moved to the main branch (and become shippable) at the same time.

It may not be feasible for you to do all the work yourself on this kind of ticket. Even if you are taking on the work yourself, raising a pull request with multiple ideas in it is bad practise. Work of this size can often be (and should be!) split up into small units of work. Usually, you’ll add some sort of subtasks. The work can also be parallelisable and worked on by multiple people.

But how do we overcome our twin problems of a) not stepping on the toes of another developer by pushing to a “shared” branch and b) releasing the work at the same time whilst also keeping changes discrete.

This is where feature branches shine.

It’s nothing sophisticated. Simply, you make a new branch for you’ll treat like your default branch for a while. Take a copy of the default branch and name it after your new feature. Then, you can raise pull requests against this new branch, rather than default.

Now, PRs can be small, single units of work that can be reviewed easily.

Once that feature branch is ready and safe to deploy, raise a PR from it to the default branch. Marvel a bit at all the changes you’ve made, though you may not need to review it strenuously as each piece has already been reviewed. Then, merge that and move your ticket to done. (Or “User test” or whatever.)

This workflow is not without it frustrating disadvantages.

The biggest of these is that the default branch will (all too quickly) deviate from the feature branch. You’ll need to stay on top of this by rebasing the feature branch frequently. These conflicts can get gnarly, and only get worse with time, so a feature branch should have a short life span.

This workflow has all but vanished from my workplace because of this issue. We end up spending more time handling conflicts than is worth it. Instead, a more correct solution is *feature flags*. In that case, you can stick to normal working branches.


> **Feature flags**
>
> Feature flags aren’t a git workflow thing, but since I already brought them up I shall explain them quickly. Instead of hiding your completed work in a feature branch, you want to merge it as soon as it’s ready. The way you can do that, without releasing it to be shipped, is by flagging the feature as unavailable. One way to do this is with a simple `if param[:enable_payment_system]` condition in your view, or controller, which skips over the whole feature by default. This may take some thinking about how to do cleanly, but I often find that this kind of thinking leads to cleaner code anyway even after you remove the feature flag.

## ”gitflow”

I’m unsure if anyone still bothers with this. I expect some do, likely more corporate places that like to follow operating procedures that show up in books from the 90s. It’s also very possible that this just isn’t popular in continuously delivered web development, but is still very useful in software houses that produce versioned software.

This is a whole system that consists of feature branches (like those above), develop branches (where code has been finished but isn’t ready for a release yet), release branches (for all the changes which will go into version 1.1 or version 1.2, which are both expected to be released at some point), hotfix branches (which jump over the previous kinds of branches), and then master once the code is ready to go into the latest branch to build on top of.

It’s all a bit much. I’ve never used this, and really hope not to.

## Merging methodologies

Alongside the ways of using a git repo to work on your code, there are also different ways to getting your code merged.
### Pushing straight to the default branch

Commit your work, then `git push`. Done.

This is a common way of working on personal projects, where you’re alone and not expecting a review of a team mate. It is essentially never done in any professional environment though.

There are two times that come to mind where I’ve seen this done at work.

First, when working on a “spike” that in a new repository. A spike is very quickly throwing together to come to validate an idea. This might not be done solo and can be done with others on the team too. It is useful when speed is important, and the code quality is not. Usually, the ultimate goal of these spikes to to throw the repo away and start again with the insights of the spike on a fresh repo, where normal processes are restarted.

The second is rarer still, and I think it’s not a point of pride, but rather a process that hasn’t fully been solidified yet. In Ruby packages, I’ve seen a new feature get added via a normal Pull Request methodology, but then the version bump of the library happening afterwards (often by the maintainer) who then just pushes the single commit. These commits are often automated, and a review wouldn’t be very helpful.
### Opening a Pull Request straight to the default branch (and other branches, whilst we’re at it)

The vast majority of the time, pull requests are raised against the default branch to be reviewed by other developers. In every professional place I’ve worked code on the default branch gets automatically deployed to production. It’s a good, often hygienic, method of finishing off your work to make sure that code is never hanging around, going stale, and then surprising someone when it fails a few days later when someone gets around to manually deploying.

When working with feature branches, you’d of course be merging into other branches, but *those* would be pointing at the default branch. (If they’re not, the situation you’ve found yourself is a complicated one!)

I wrote earlier about how it’s often not considered polite to jump into someone else’s working branch and start making changes. There are occasions when you’d like to do that though. For instance, if you’re reviewing a PR and want to suggest a change to it. It might complicate things to do that by simply changing the code on the branch, but you *could* checkout their branch, make the change, and then push to a different branch. Raising your own pull requests against theirs, so they can see the changes you’re thinking of.

I have worked in one place where we had a ‘staging’ branch, which the gitflow people would call the ‘develop’ branch. The staging branch would get deployed to a staging environment so user acceptance testing could be done before merging everything from that branch into the default branch. Just like with gitflow, my feeling that this style is falling out of fashion. (Instead, see: feature flags.)

It’s your CI process that is protecting you from merging buggy code, so long as your code is well tested. A common practice with CI is halting the entire pipeline if something fails along the way. When this happens, most git hosts will stop you (or strongly persuade you away from) merging your pull request.


> **Continuous Integration**
>
> “CI” servers watch for changes to branches and do some build steps. These build steps might be
> - Running the test suite
> - Running linters which check the quality of the code changed
> - Compile assets
> - Generate and push Docker images
> - Deploying the code to the server
> - Sending notifications or kicking off other systems to begin their work
> - Building a package and pushing to the package repository
> The CI server might do a better job at running all of the tests than you would locally - maybe faster or more reliably. The output of all of these are often visible on pull requests, which give reviewers confidence that the changes meet certain standards.
>
>Usually, you can set up systems like GitHub and GitLab to now allow merging of a PR whilst the build is failing (one of the tasks has finished with an unexpected output).
>
> When I started my career, we were using Jenkins, a self-hosted and open source CI server. The world has changed a lot since then, and CI has become Big Business. A lot of my experience is using CircleCI, which has been getting more and more expensive (and more and more fancy). GitHub also have a very good CI system now, which is nice to have it hooked straight into where your code is anyway. My expectation for the future is that these things will get prohibitively more expensive and we’ll end up going back to self-hosted solutions. Many of these third party providers already let you run your builds on your own servers (and they handle queueing and whatnot).

The key thing to note about this method is that once your CI build is green and you’re code has been signed off by a peer, when you hit that ‘Merge’ button, it goes straight into the default branch and is ready for everyone to `git fetch` and start working on top of it - for better or worse!

## Merging strategies
Actually, the button you press is likely more complicated than just “Merge”. There are a few different ways of merging.
### Fast forward merging

Whilst this is considered the 'default' method of merging by git, it is one I've rarely seen in the wild. Likely because it is not Github's idea of the default.

A fast forward merge is the simplest of merges. They happen where there is no conflict between the two branches, and the commits from the new branch can be placed on top of the main branch, as simple moving `main` to the pointer of the merged branch.

The commits are all kept the same. There's no tweaking the hash because the parent is different: the commits are always the same.

### Non-fast forward merging

This is a very similar kind of merge as the above, except that it _always_ adds a merge commit. This is what you'll see by default in Github. It's handy for a few reasons:

**A bit more provenance.** You can tell exactly where the commits came from: another branch. Probably a _named_ branch that will give you a bit more context. The merge commit will group the new commits together forever.

**Optionally, a lot more context for the group of commits.** Github will add the PR description to the merge commit message (and of course you can do that yourself if manually merging). Whilst the individual commits should explain what change they've made, a merge commit is a good place for a proper description of why the change needs to be made.

**Easy to revert the whole thing.** With a fast forward merge, you'll need to select commit-by-commit to revert the whole idea. That is a bit more faff than just reverting the merge commit.

### "Squash and merge"

This is a destructive method of merging your code. Ultimately, it still does a non-fast forward merge, but Github/lab will force all of your code changes into the merge commit.

This way of working considers the individual commits as an artefact that's only useful during development. Once merged, who cares. This is nice in some ways: you'll end up with one commit per ticket, maybe. That's kinda nice. On merge, there are fewer chances of multiple merge conflicts, as it'll just be one commit that needs to be checked for conflicts rather than multiple (which might all hit the same conflict).

I dislike this way of working, even though it is how the majority of places I've worked at like to do their merging.

You don't technically lose any commit messages - they're all added into the merge commit. However, you do end up with that whole, bulky message being displayed in your `git blame`, rather than just the single commit that cleanly explained the change to that particular line of code.

### “Rebase and merge”

This merging methodology does a `git rebase original/base_branch` and then pushes the base_branch. This is essentially doing a fast forward push, except if you were doing it on the command line you’d be able to handle conflicts interactively. On GitHub, it won’t let you use this option if it involves a conflict.

GitHub will rewrite all of your commits even if there’s no need (say, if the rebase is clean). It will change the author of the commit from your locally configured author, to your GitHub ‘verified’ user.

This is a critical issue for me with this merge method. There are some features, like `git branch -d` which will check if the branch you’re deleting has *all* of its commits somewhere else. Otherwise, it’ll warn you that you’re about to lose some work. That will always happen when the author has been changed (because all of the commits have changed!). So you’re forced to use the more dangerous `-D` because you’re not expecting `-d` to ever work.
### Merge trains

Merge trains aim to avoid issues with merges in close proximity to each other. Say you have your work in `cool-feature` and a colleague has their work in `their-feature`. Both branches are pushed, they pass code review at roughly the same time, they have CI run against them and they're both green builds.

So, hit merge on `cool-feature` and your colleague hits merge on `their-feature`. Then, something frustrating happens: despite there being no conflicts between the two, behaviour has changed enough now that some tests are failing.

You can revert one of the PRs but the whole thing is a frustrating mess.

The manual way to get around this safely is to rebase your code before merging it, always. In fact, there are Github settings where you can enforce that all PRs be sitting on top of the main branch. This is _very_ annoying though - what if someone beats you to another merge? Then you have to rebase again and hope to catch it as the stars align when that build completes.

Instead, if merge trains were used, both merged PRs would go into a queue. CI would get `cool-feature` merged and start building it for deploy (or whatever). Then though, instead of merging `their-feature` straight away, it will automatically rebase that code and then run the tests again. If they pass this time, it merges it without any other intervention.

This magic automation has never sat right with me though. I don't like my code going onto a production server At Some Point In The Future. So, as trendy as merge trains are, I think I'll stick with more simpler methods of merging.

Though - this is almost always a team decision, and rarely be people align with me on this! It seems everyone has their opinions on git workflows.
