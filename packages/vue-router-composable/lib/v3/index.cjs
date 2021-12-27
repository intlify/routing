var VueCompositionAPI = require('@vue/composition-api') // eslint-disable-line @typescript-eslint/no-var-requires
const useRouter = () => {
  const instance = VueCompositionAPI.getCurrentInstance()
  if (instance == null) {
    throw new Error(`should be used in setup`)
  }
  const vm = instance.proxy || instance
  return vm.$router
}

const useRoute = () => {
  const instance = VueCompositionAPI.getCurrentInstance()
  if (instance == null) {
    throw new Error(`should be used in setup`)
  }
  const vm = instance.proxy || instance
  return VueCompositionAPI.computed(() => vm.$route)
}

exports.useRouter = useRouter
exports.useRoute = useRoute
exports.isVueRouter3 = true
exports.isVueRouter4 = false
