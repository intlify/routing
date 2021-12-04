#!/bin/bash

set -xe

# Restore all git changes
git restore -s@ -SW  -- packages

# Install pnpm
pnpm install

# Build packages
pnpm build

# Bump versions
npx jiti ./scripts/bump.ts

# Update token
if [[ ! -z ${NODE_AUTH_TOKEN} ]] ; then
  echo "//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}" >> ~/.npmrc
  echo "registry=https://registry.npmjs.org/" >> ~/.npmrc
  echo "always-auth=true" >> ~/.npmrc
  npm whoami
fi

# Release packages
for p in packages/* ; do
  pushd $p
  echo "Publishing $p"
  pnpm publish --access public --no-git-checks --tag edge
  popd
done
