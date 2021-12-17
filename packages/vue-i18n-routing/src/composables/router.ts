import { getCurrentInstance, computed, isVue2 } from 'vue-demi'
import VueRouter from 'vue-router3'
import { useRoute as useModernRoute, useRouter as useModernRouter } from 'vue-router'

import type { Route } from 'vue-router3'

const useLegacyRouter = () => {
  const vm = getCurrentInstance()
  if (vm == null) {
    throw new Error(`should be used in setup`)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (vm as any).$router as VueRouter
}

const useLegacyRoute = () => {
  const vm = getCurrentInstance()
  if (vm == null) {
    throw new Error(`should be used in setup`)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return computed(() => (vm as any).$route as Route)
}

export function useRoute() {
  return isVue2 ? useLegacyRoute() : /* #__PURE__*/ useModernRoute()
}

export function useRouter() {
  return isVue2 ? useLegacyRouter() : /* #__PURE__*/ useModernRouter()
}
