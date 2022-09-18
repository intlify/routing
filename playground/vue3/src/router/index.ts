import { createRouter as _createRouter } from 'vue-i18n-routing'
import { createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

import type { I18n } from '@intlify/vue-i18n-bridge'

export function createRouter(i18n: I18n) {
  return _createRouter(i18n, {
    version: 4,
    defaultLocale: 'en',
    baseUrl: 'https://localhost:3000',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English'
      },
      {
        code: 'ja',
        iso: 'ja-JP',
        name: '日本語'
      }
    ],
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/AboutView.vue')
      }
    ]
  })
}
