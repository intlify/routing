import { getCurrentInstance, computed } from '@vue/composition-api/dist/vue-composition-api.mjs'

var isVueRouter3 = true
var isVueRouter4 = false

const useRouter = () => {
  const vm = getCurrentInstance()
  if (vm == null) {
    throw new Error(`should be used in setup`)
  }
  return vm.$router
}

const useRoute = () => {
  const vm = getCurrentInstance()
  if (vm == null) {
    throw new Error(`should be used in setup`)
  }
  return computed(() => vm.$route)
}

export { useRouter, useRoute, isVueRouter3, isVueRouter4 }
