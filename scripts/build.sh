#!/bin/bash

set -xe

pnpm build --filter vue-i18n-routing

tail -n +2 ./packages/vue-i18n-routing/src/extends/vue-i18n.d.ts >> ./packages/vue-i18n-routing/dist/vue-i18n-routing.d.ts
cp ./packages/vue-i18n-routing/src/vue.d.ts ./packages/vue-i18n-routing/dist/vue-i18n-routing.mixins.d.ts
cp ./packages/vue-i18n-routing/src/mixins.d.ts ./packages/vue-i18n-routing/dist/mixins.d.ts
