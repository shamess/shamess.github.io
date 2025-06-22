---
layout: post
title: Sabbatical
date: 2025-06-22 20:36 +0100
---

<style>
article {
}

.meta, .concept-wrapper h1 {
    display: none;
}

aside {
    display: grid;
    grid-template-columns: 50px auto;
    gap: 20px;

    background-color: #ebebeb;
    border-radius: 10px;

    padding: 20px;
    margin: 20px;
}

.ad {
    float: right;
    background-color: #ebebeb;
    border-radius: 10px;

    max-width: 210px;

    float: right;
    padding: 10px;
    margin: 20px;

    img {
        width: 200px;
        height: 200px;
    }

    text-align: center;
    p {
        color: grey;
        font-size: 10pt;
        margin: 3px;
    }
}

@media (width >= 1120px) {
    .meta, .concept-wrapper h1 {
        display: block;
    }

    .wrapper {
        width: 100%;
        max-width: 1120px;
    }

    .post-header {
        display: none;
    }

    .concept-wrapper {
        font-family: "Playfair Display", serif;

        h1, h2 {
            font-family: "Copperplate", serif;
        }

        h1 {
            font-size: 41pt;
            line-height: 50pt;
        }

        h2 {
            font-size: 30pt;
            line-height: 20pt;

            text-align: center;
        }
    }

    h1 {
        margin-bottom: 50px;
    }

    h1 .main {
        display: block;

        font-size: 72px;
    }

    .top-matter {
        display: grid;
        grid-template-columns: 740px 300px;
        grid-template-rows: 60px auto auto;
        gap: 80px;

        grid-template-areas:
            "article meta"
            "article side"
            "article ad";

        justify-items: start;

        margin-bottom: 100px;

        article {
            grid-area: article;

            .bike {
                width: 464px;
                float: left;

                position: relative;
                top: -20px;
                left: -20px;
            }

            aside {
                float: right;
                width: 480px;

                position: relative;
                left: 250px;
                margin-left: -230px;

            }
        }

        .ad {
            grid-area: ad;

            position: relative;
            top: 50px;
        }

        .meta {
            grid-area: meta;
        }

        section.side {
            grid-area: side;
        }
    }

    .afters {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    }
}

.behind-scenes {
    width: 70%;
    background-color: #ebebeb;
    padding: 40px;
    margin: 50px auto;
    border-radius: 10px;
}
</style>

<div class="concept-wrapper">
    <h1><span class="main">Sabbatical</span></h1>

    <div class="top-matter">
        <div class="meta">
            Week 25, June 2025.
        </div>

        <article>
            <p>My employer has very generously accepted my request for a sabbatical. For six months, starting in July, I'll be off work and left to my own devices.</p>
            <p>Some parts of <em>why now</em> don't need to be mentioned here, but just to say that there are a few reasons all aligning at the same time so I'm very pleased to be able to take this time for myself (and those unmentioned obligations).</p>
            <p>As far as I understand, my company didn't have a sabbatical policy and I may have triggered its creation by asking. It was heartwarming to see my manager put so much effort into getting the company to allowing me to take this time. I'm very grateful. The main message was "we don't want to lose you, so we're going to make this work". It's worth asking your employer if you feel you can afford some unpaid time. (A contractor friend of mine was also fully for making extended time off more common - and boosting the contracting industry!)</p>
            <p>The most common use of a sabbatical is travelling, but I'm not planning on going far afield. I am hoping to do some cycling day trips though, fuelled by cycle.travel which I’ve found to be a great planning tool. I’ll be particularly please if I can cycle somewhere and camp overnight. That might be the most adventurous I get.</p>
            <p>I'm hoping to spend time on software development tools in areas where the alternatives are just too expensive or complicated for smaller projects. Hopefully, what I build will be 'pay once' solutions. For the same reason I like to buy music CDs these days. As once.com says, “Add up your SaaS subscriptions last year. You should own that shit by now.” I’m fairly sure that for the money my employer pays to LaunchDarkly each year we could have hired someone to build it for us, without any of the gimmicks that are added to justify a yearly price hike.</p>
            <p>That’s why feature flagging and AB testing is one of the ideas I want to look into. At carwow, we have really made feature flagging work for us. We have no staging servers, but still have all the confidence of having a ‘pre-live’ state. More companies should work like this. I fear they don’t because flagging software to help them is expensive to get started with. (Or, it quickly stops being inexpensive.) I mean, take a look at their pricing page. “$10 per service connection / mo.” I’ve no idea what that means. It’s off putting. I’m sure there are others providing this service, probably with smaller-project friendly pricing models. There may be others, but this software is often priced per-seat, or per-user, or per-whatever. When none of the actual costs of running the service are per-anything. Just host it yourself and worry about how to scale it when the need comes up.</p>
            <p>Another project idea I will look into building is bug tracking. Again, Bugsnag (etc) are weirdly priced and expensive. I’m super aware (after doing the smallest amount of market research) that this area is pretty well covered by self-hosted versions of Sentry and others, but I don’t think competition should be all that scary all the time. There are two ideas I want to focus on with bug tracking: a) bug tracking that helps <em>local development</em> as well as production bug tracking, and b) specific to Ruby and maybe even specific to Rails.</p>
            <p>At my workplace, I believe we <em>can</em> toggle on error tracking for development machines, but no one ever does. It’s a little too public for when you’re spiking something and don’t want your other colleagues to see how often you’ve mistyped ‘vehicle’. Plus, it should work offline too. There’s zero reason you should need to be online to write code.</p>
            <p>I have some Rails specific ideas too. Better breadcrumbs, for instance, which can only be implemented when you know exactly the kind of ecosystem the project is working in. There’s very little likelihood of Bugsnag adding Rails specific debugging features - they can’t afford to focus on a smaller subset of developers. I don’t really have that problem though.</p>
            <p>I don’t know how software is distributed when it's not a SAAS platform, so I've got a lot to learn here. All my previous projects have been web-based. Now I’ll have lines of code to ship. A third, project idea is around Shopify-meets-private-Docker-repositories that I have an MVP working for. Again, hopefully pay-once and self-hosted. Is that an idea? Does it already exist?</p>
            <p>It is interesting that the pay-once model is all the more dying. Whilst being annoyed with the Ruby API docs going down this week (or the certificate has expired or some such) I remembered that Dash was a good way to get around Rails docs in a local way. Just as I open it up, I’m told that it has switched to a subscription model. I don’t blame anyone for picking this style of business, by the way. But it is annoying. The reasoning the developer gave (I’m going to very badly paraphrase this, so please go and read their communications on this) was that they <em>need</em> customers to be paying more than once in order to have this be a sustainable business. The way they’ve been doing it so far is by releasing new, paid major versions. But that means adding new features to justify it. In reality, no one needs to features, we need better support for the docsets. So, the subscription method makes more sense. I will say though that companies (some already mentioned) will still feel the need to ship features no one wants just so they can increase the price.</p>
            <p>I don't have huge expectations of these being successful. When I’m charging £250 for a software package that carwow pay tens of thousands of pounds a year for, it can’t possibly be that kind of successful. I'm focusing on learning and enjoying programming for the sake of it. It's crucial that I go back to work at the end of the year as a better developer with new skills. And, (desperately hopefully) with a couple of products that sometimes pay for my mobile phone bill each month.</p>
        </article>

        <section class="side">
            <h2>E-bike problems in Nottingham</h2>

            <p>Not so long ago I was told a story about a friend of a friend, who has recently learned how to walk again after being hit by an e-bike and being paralysed by it. Last month, the caretaker of my studio building was knocked unconscious and left with a broken collar bone after being smashed by one. This week, on my way to the Hackspace I had to wait for a police cordon to be taken down; it was up because a police car had collided with an erratically driven “e-bike”.</p>
            <p>I shouldn’t call these things “e-bikes” though. They’re illegally driven mopeds.</p>
            <p>E-bikes in the UK can only go to 15 mph and must be peddle assisted, with a maximum amount of output it is allowed to give. After 15 mph, the pedal assist must be automatically turned off. If the user isn’t peddling, it must not give an aid to the wheels.</p>
            <p>When you see a Deliveroo cyclist going up a hill at 20 miles per hour, they’re on an unlawful bike; you need a valid insurance and driver’s license, and in most cases it needs an MOT. A bicycle modded with an battery and motor will not pass an MOT.</p>
            <p>What I’m most shocked about is why the police aren’t doing anything about it.</p>
            <p>Well, some good news is that they sort of are. There are seven cases of ‘mechanically propelled vehicle without a license’ appearing in Nottingham’s Magistrate Court on Monday. Seven!</p>
            <p>It still does not feel like enough though. I see dangerous, unlawful e-bikes being ridden every day when I cycle to work. It needs to be taken more seriously by police.</p>

            <h2>Blue Prince</h2>

            <p>If you’ve not played it yet, you should! <a href="https://shane.city/2025/06/you-should-play-blue-prince/">I’ve written a spoiler-lite review of the game over on Shane.city if you haven’t played it yet.</a></p>
            <p>It’s the first time I’ve tried writing an actual review for something over there. It was quite fun to write. Getting images for it was frustrating though. I decided to handdraw some of the bits from the game to break up the text and make it a bit more whimsical. At the time of writing <em>this</em>, I’m not sure what the ‘feature’ image should be. I may end up with just a screenshot, but that doesn’t feel good.</p>
        </section>
    </div>

    <div class="afters">
        <div>
            <h2>Just loads of bats</h2>

            <p>My partner and I enjoy the bats that fly around our garden in the evening, and will often pause our day and take a few moments outside to cool off and watch them dance around the skies. They’re very nimble and agile fliers. They have to be to catch an estimated 3,000 insects <em>each</em> every evening.</p>
            <p>So it was a bit shocking when we saw one hit the side of our house. Even more shocking when we saw it crawl up the wall, and disappear between the brickwork and the roof.</p>
            <p>It’s funny because recently we’d been chatting about where the bats lived. “Probably in those big trees”, we agreed. But no. In our sodding house.</p>
            <p>This is a mix of excitement and annoyance. It’s pretty cool that have some bat-friends. The homeowner part of me thought “owning a house sucks” and not for the first time.</p>
            <p>We don’t know much at the moment. I popped my head into the attic and didn’t see any signs of the bats. It’s possible they’re just in the walls. Apparently, they don’t need that much space to live. According to the (heavily pro-bat propaganda) website we found on the issue, as pests go they’re not that bad. They don’t carry diseases. They don’t chew through things. Their poop is dehydrated and does not cause damage to wood, etc. We can attest that they’re largely silent too.</p>
            <p>Once they’re in, there’s no evicting them. If they are in our attic, we’re allowed to box in the ingress, to allow them to live there. We are not allowed (legally!) to close off any holes they use or dissuade them in any way.</p>
            <p>We’re working on getting a bat survey. I don’t expect it will be cheap. My estimate is that there are nine bats, but Tim stood watch more vigorously and counted 43 leaving before any returned.</p>
        </div>

        <div class="ad">
            <a href="https://m.do.co/c/181470abc83a"><img src="/assets/ads/digital-ocean-bezos.svg" title="I recently trunked down my DO usage, but still use it for static hosting, a few cloud VPS, and DNS for some bits!" alt="Stop giving Bezos money. Switch to Digial Ocean today with a free $200." /></a>

            <p>An ad to help pay for a service I use. You should too.</p>
        </div>
    </div>
</div>
