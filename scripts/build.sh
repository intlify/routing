#!/bin/bash

set -xe

pnpm --filter vue-i18n-routing build

tail -n +2 ./packages/vue-i18n-routing/src/extends/vue-i18n.d.ts >> ./packages/vue-i18n-routing/dist/vue-i18n-routing.d.ts
cp ./packages/vue-i18n-routing/src/vue.d.ts ./packages/vue-i18n-routing/dist/vue.d.ts
cp ./packages/vue-i18n-routing/src/vue-i18n.d.ts ./packages/vue-i18n-routing/dist/vue-i18n.d.ts
