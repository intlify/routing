import { getCurrentInstance, computed } from '@vue/composition-api/dist/vue-composition-api.mjs'

var isVueRouter3 = true
var isVueRouter4 = false

const useRouter = () => {
  const instance = getCurrentInstance()
  if (instance == null) {
    throw new Error(`should be used in setup`)
  }
  const vm = instance.proxy || instance
  return vm.$router
}

const useRoute = () => {
  const instance = getCurrentInstance()
  if (instance == null) {
    throw new Error(`should be used in setup`)
  }
  const vm = instance.proxy || instance
  return computed(() => vm.$route)
}

export { useRouter, useRoute, isVueRouter3, isVueRouter4 }
