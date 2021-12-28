import VueRouter from 'vue-router'

import type { ComputedRef } from '@vue/composition-api'
import type { Route } from 'vue-router'

declare function useRouter<T = VueRouter>(): T
declare function useRoute<T = ComputedRef<Route>>(): T

declare const isVueRouter3: boolean
declare const isVueRouter4: boolean

export { useRouter, useRoute, isVueRouter3, isVueRouter4 }
