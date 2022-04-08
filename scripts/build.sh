#!/bin/bash

set -xe

pnpm build --filter vue-i18n-routing

# tail -n +2 ./packages/vue-i18n-routing/src/extends/vue-i18n.d.ts >> ./packages/vue-i18n-routing/dist/vue-i18n-routing.d.ts
cp ./packages/vue-i18n-routing/src/vue.d.ts ./packages/vue-i18n-routing/dist/vue-i18n-routing.vue.d.ts
cp ./packages/vue-i18n-routing/src/vue-i18n.d.ts ./packages/vue-i18n-routing/dist/vue-i18n-routing.vue-i18n.d.ts
