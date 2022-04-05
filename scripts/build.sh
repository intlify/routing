#!/bin/bash

set -xe

pnpm build --filter vue-i18n-routing

tail -n +2 ./packages/vue-i18n-routing/src/extends/vue-i18n.d.ts >> ./packages/vue-i18n-routing/dist/vue-i18n-routing.d.ts
# tail -n +9 ./packages/vue-i18n-routing/src/vue.d.ts >> ./packages/vue-i18n-routing/dist/vue-i18n-routing.d.ts
