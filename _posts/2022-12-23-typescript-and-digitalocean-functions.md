---
layout: post
title: Building TypeScript and DigitalOcean Functions
date: 2022-12-23 08:04 +0000
---

I'm making use of two new technologies (for me): DigitalOcean's Functions (AWS
Lambda alternative) and TypeScript.

Couple of assumptions I may be wrong about:

* Even during development, you need to upload your Functions to test them.
  There's no local way of running them realistically. (Baring unit tests, which
  are possible but not entirely realistic.)
* It's a good idea to write these Functions in TypeScript. (I've already
  benefitted from it catching a null-branch bug.)
* TypeScript isn't supported by DO. That's not surprising.
* `tsconfig.json` only allows one `outDir`.
* I currently don't need an esbuild or a webpack.

This means I've ended up with a build script like this:

```bash
#!/bin/bash

set -xe

# clean up the build folder
rm -rf build/*

# src contains all my typescript, including `src/functions` which are my DO
# Functions
tsc

# since .yml isn't a .ts file, tsc ignores it. DO requires this file to know
# what shape functions are in.
cp src/functions/project.yml compiled/functions/

# doctl sls deploy hates unknown files, so remove the map files
find compiled/functions -name "*.map" -type f -delete

doctl serverless deploy compiled/functions
# ditch this folder before moving it to build
rm -rf compiled/functions

cp index.html build/
cp compiled/* build/
```

Does this look normal? It works. But I'm not sure how long for or if I'm
`build.sh`ing myself into a corner. Is this a solved problem?

PS. I thought this would be a good question for StackOverflow initially, but
then got nervous regarding the difference between [stackoverflow and
software-engineering][stackoverflow] and gave up.

[stackoverflow]: https://meta.stackoverflow.com/questions/254570/choosing-between-stack-overflow-and-software-engineering
