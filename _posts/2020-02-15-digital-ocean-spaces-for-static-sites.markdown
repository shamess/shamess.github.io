---
layout: post
title:  "Digital Ocean Spaces for static websites"
date:   2020-02-15 18:17:05 +0000
---

<p><a href="https://m.do.co/c/181470abc83a"><img src="/assets/ads/digital-ocean-spaces.png" alt="Host on spaces starting with $100 credit" style="width: 200px; float: right; margin-left: 10px; background-color: grey; padding: 5px;" /></a></p>

[Digital Ocean][0]\* has a product called Spaces, which is a drop in replacement for the majority of uses of Amazon's S3. Including static website hosting.

I've had to turn to Spaces instead of S3 because I've got technicallyshane.com managed by DO, because then they can point all sorts of subdomains to my droplets and other services. I really just wanted a quick place for me to put my [bookmarklet to filter hover.com domains by price][1].

Pros vs S3:

* S3's UI has gotten gradually more complex, which DO gives a fresh edge too.
* S3's IAM permissions is a complex overhead for just a silly static website.
* My DNS doesn't have to change. (No need to pay for Route 53.)
* You can still use the S3 SDK.
* CDN for free, with one button.
* Subdomain per-bucket set up with one button.

Cons vs S3:

* $5 per month, right from the start. You get unlimted "buckets" and a cumulative total of 250Gb included in that though. 1TB bandwidth.
* index.html isn't loaded from the root. This is probably a show stopper for most people, but I'm alright with it right now. There's no sign of them adding support for this.

The change from S3 to Spaces is as easy as adding one line:

```
const fs = require('fs');
const AWS = require('aws-sdk')

const spacesEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DEPLOY_KEY_ID,
  secretAccessKey: process.env.DEPLOY_KEY
});

const remoteDirectory = "hover";
const build = `${__dirname}/../build`;

fs.readdirSync(build).forEach(file => {
  if (file[0] == '.') return;

  var params = {
    Body: fs.readFileSync(`${build}/${file}`, "utf-8"),
    Bucket: 'name-of-your-space',
    Key: `${remoteDirectory}/${file}`,
    ACL: "public-read",
    ContentDisposition: "inline",
    ContentType: "text/html",
  };

  s3.putObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else     console.log(data);
  });
});
```

\* This is an affiliate link that'll give you $100 credit to spend in 60 days. Two months free Spaces, plus a bunch of droplets, I guess.

[0]: https://m.do.co/c/181470abc83a
[1]: https://bookmarklets.technicallyshane.com/hover/index.html
