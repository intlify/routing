#!/bin/bash

set -e

# Restore all git changes
git restore -s@ -SW  -- packages

# Build packages
pnpm build

# Update token
if [[ ! -z ${NODE_AUTH_TOKEN} ]] ; then
  echo "//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}" >> ~/.npmrc
  echo "registry=https://registry.npmjs.org/" >> ~/.npmrc
  echo "always-auth=true" >> ~/.npmrc
  npm whoami
fi

# Release packages
for PKG in packages/* ; do
  pushd $PKG
  TAG="latest"
  echo "⚡ Publishing $PKG with tag $TAG"
  npx npm@8.17.0 publish --tag $TAG --access public --tolerate-republish
  popd > /dev/null
done
