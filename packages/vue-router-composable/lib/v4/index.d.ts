import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

declare function useRouter<T = Router>(): T
declare function useRoute<T = RouteLocationNormalizedLoaded>(): T

declare const isVueRouter3: boolean
declare const isVueRouter4: boolean

export { useRouter, useRoute, isVueRouter3, isVueRouter4 }
