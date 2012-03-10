Use the "cutarelease.py" script in this repo to make to make cutting a
release of your project a single step.

Basically, it will help cut a release for a git-based project that follows
a few conventions. It'll **update your changelog** (CHANGES.md), add a **git
tag**, **push** those changes, **optionally `npm publish`** (for projects
with a "package.json"), **optionally upload to** [pypi](http://pypi.python.org/pypi)
(for Python projects with a setup.py),
**update your version to the next patch level release**, and **insert
changelog boilerplate** for the new version.

First, this script isn't useful unless you follow these conventions for your
projects:


# Project Conventions

I **use git** for version control.

I use **'X.Y.Z'** (aka major.minor.patch) versioning for all my projects. Increment
the `patch` number for a bug fix. Increment the `minor` version for a change
that adds functionality but doesn't break backward compatibility (or if you
know for damn certain that your compat-change isn't going to break anyone).
Increment the `major` version for major architectural changes and/or backward
compatibility breakages.

I write a **CHANGES.md** change log file for my projects (example: [json
changelog](https://github.com/trentm/json/blob/master/CHANGES.md)). This is a
manually edited file with a section for released and in-progress "interesting
to the user" changes to the project. Yes, there is the commit history but that
is often obtuse to the end user and hard to correlate to released versions.
Basically you want to answer this user question: "I have version N, what will
it mean for me to upgrade to version M."

I **tag my repo for each release** using the version number as the tag name.

The commited **version number at the HEAD of the repo is for the next
*unreleased* version**. So, for example, if "1.2.3" is the latest released
version, then the version at the repo HEAD is "1.2.4".


# State of this Project

I've just quickly put this into its own github repo. Likely this has some
hiccups for general usage (i.e. is tailored to my specific usage). At least
four projects and two people are using this though :), so it isn't totally
busted.

I'm a Python and Node.js guy, so this script will probably need some love to
be nice for Ruby, Perl, etc. projects.


# Installation

Pick one of the following options:

1.  "cutarelease.py" has no external deps (other than a fairly recent Python
    2.x). You can just copy it over to your repo's tools directory.

2.  `npm install cutarelease`. Perhaps a little evil to do this for a Python
    script. Sue me.

3.  Git submodules. So something like:

        mkdir -p deps
        git submodule add https://github.com/trentm/cutarelease.git deps/cutarelease
        git submodule update --init deps/cutarelease

    then use "deps/cutarelease/cutarelease.py" in your Makefile.



# Usage

I tend to add a "make cutarelease" target. For example, in my [json
project](https://github.com/trentm/json) I have something like this:

    cutarelease:
        python tools/cutarelease.py -f package.json -f lib/jsontool.js

A typical patch fix goes like this (example: 
[json issue #23](https://github.com/trentm/json/issues/23)):

- Commit a fix for the issue ([commit](https://github.com/trentm/json/commit/f43c627)).
  This includes an [update to the changelog](https://github.com/trentm/json/commit/f43c627#diff-0).
- Comment on and close the issue ([comment](https://github.com/trentm/json/issues/23#issuecomment-2523558)).
- Run `make cutarelease` (which did [these two
  commits](https://github.com/trentm/json/compare/f43c627406...2a41d3a) and
  tags after the first of those)
- Optionally make a release announcement if significant enough: blog, twitter,
  mailing list, whatever. (E.g.
  [tweet for json 2.0.3](https://twitter.com/#!/trentmick/status/133990424988745728)).



# License

MIT. See LICENSE.txt.

