Development
===========

## Releases

**IMPORTANT - NPM**: To correctly run `preversion` your first step is to make
sure that you have a very modern `npm` binary:

```sh
$ npm install -g npm
```

The basic workflow is:

```sh
# Make sure you have a clean, up-to-date `master`
$ git pull
$ git status # (should be no changes)

# Choose a semantic update for the new version.
# If you're unsure, read about semantic versioning at http://semver.org/
$ npm version major|minor|patch -m "Version %s - INSERT_REASONS"

# `package.json` is updated, and files are committed to git (but unpushed).

# Check that everything looks good in last commit and push.
$ git diff HEAD^ HEAD
$ git push && git push --tags
# ... the project is now pushed to GitHub.

# And finally publish to `npm`!
$ npm publish
```

And you've published!
