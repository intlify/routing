import { getCurrentInstance, computed } from 'vue-demi'
import VueRouter from 'vue-router3'

import type { Route } from 'vue-router3'

export const useRouter = () => {
  const vm = getCurrentInstance()
  if (vm == null) {
    throw new Error(`should be used in setup`)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (vm as any).$router as VueRouter
}

export const useRoute = () => {
  const vm = getCurrentInstance()
  if (vm == null) {
    throw new Error(`should be used in setup`)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return computed(() => (vm as any).$route as Route)
}
