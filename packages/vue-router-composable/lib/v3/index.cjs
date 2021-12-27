var VueCompositionAPI = require('@vue/composition-api') // eslint-disable-line @typescript-eslint/no-var-requires
const useRouter = () => {
  const vm = VueCompositionAPI.getCurrentInstance()
  if (vm == null) {
    throw new Error(`should be used in setup`)
  }
  return vm.$router
}

const useRoute = () => {
  const vm = VueCompositionAPI.getCurrentInstance()
  if (vm == null) {
    throw new Error(`should be used in setup`)
  }
  return VueCompositionAPI.computed(() => vm.$route)
}

exports.useRouter = useRouter
exports.useRoute = useRoute
exports.isVueRouter3 = true
exports.isVueRouter4 = false
