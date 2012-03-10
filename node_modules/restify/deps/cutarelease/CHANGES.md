# cutarelease Changelog

## cutarelease 1.0.6 (not yet released)

(nothing yet)

## cutarelease 1.0.5

- Fix npm package name (had forgotten unwanted hyphens in naming).


## cutarelease 1.0.4

- Fix to 1.0.3 '-f' improvements.


## cutarelease 1.0.3

- Improvements in handling "version files" -- those passed in with "-f" arg.
  Support "-f type:path" in addition to the existing "-f path" to be explicit
  about the type (one of "javascript", "python", "json" or "version"). Also
  improve the guessing to be able to pick up on the shebang line in scripts.


## cutarelease 1.0.2

- [issue #1 follow up] Looser req's on project name in CHANGES.md h2's.


## cutarelease 1.0.1

- [issue #1] Don't require the project name in the CHANGES.md h2's.


## cutarelease 1.0.0

Initial release, taken from json/support/cut_a_release.py (which I think is the
latest of a number of forks of this script I have kicking around).

