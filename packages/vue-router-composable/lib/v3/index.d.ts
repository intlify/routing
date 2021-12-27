import VueRouter from 'vue-router'

import type { ComputedRef } from '@vue/composition-api'
import type { Route } from 'vue-router'

declare const useRouter: () => VueRouter
declare const useRoute: () => ComputedRef<Route>

declare const isVueRouter3: boolean
declare const isVueRouter4: boolean

export { useRouter, useRoute, isVueRouter3, isVueRouter4 }
