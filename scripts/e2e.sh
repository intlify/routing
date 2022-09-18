#!/bin/bash

set -e

# Pack packages
for PKG in packages/* ; do
  pushd $PKG
  echo "⚡ Packing $PKG ..."
  npm pack 
  popd > /dev/null
done

# Replace deps
npx jiti ./scripts/replaceDeps.ts

pnpm play:setup

pnpm test:e2e
