#!/bin/bash

set -e

# Pack packages
for PKG in packages/* ; do
  pushd $PKG
  echo "⚡ Packing $PKG ..."
  npm pack 
  popd > /dev/null
done

rm -rf ./playground/**/node_modules/vue-i18n-routing
rm -rf ./playground/**/package-lock.json

# Replace deps
npx jiti ./scripts/replaceDeps.ts

pnpm play:setup

pnpm test:e2e
