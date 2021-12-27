import { isVue2 } from 'vue-demi'
import { useLegacyRoute, useLegacyRouter } from './router/vue2'
import { useModernRoute, useModernRouter } from './router/vue3'

export function useRoute() {
  return isVue2 ? useLegacyRoute() : useModernRoute()
}

export function useRouter() {
  return isVue2 ? useLegacyRouter() : useModernRouter()
}
