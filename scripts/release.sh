#!/bin/bash

set -xe

# Restore all git changes
git restore -s@ -SW  -- packages

pnpm install

pnpm build

# Release packages
for p in packages/* ; do
  pushd $p
  echo "Publishing $p"
  popd
done
