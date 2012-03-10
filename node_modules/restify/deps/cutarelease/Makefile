all:

# Ensure cutarelease.py and package.json have the same version.
versioncheck:
	[[ "cutarelease `cat package.json | json version`" == `python cutarelease.py --version` ]]

cutarelease: versioncheck
	./cutarelease.py -f package.json -f cutarelease.py

.PHONY: versioncheck cutarelease
