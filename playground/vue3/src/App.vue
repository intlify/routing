<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { localePath, switchLocalePath, useI18nHead } from 'vue-i18n-routing'
import { useHead } from '@vueuse/head'

import type { LocaleObject } from 'vue-i18n-routing'

const { t, locale, locales } = useI18n()
const router = useRouter()
const i18nHead = useI18nHead({ addSeoAttributes: true })

const title = computed(() => router.currentRoute.value.name?.toString().split('___')[0] || '')
useHead({
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  title: computed(() => t(`App.${title.value || 'home'}`)),
  htmlAttrs: computed(() => ({
    lang: i18nHead.value.htmlAttrs!.lang
  })),
  link: computed(() => [...(i18nHead.value.link || [])]),
  meta: computed(() => [...(i18nHead.value.meta || [])])
})

const switchableLocale = computed(() => {
  const _locales = (locales!.value as LocaleObject[]).filter(i => i.code !== locale.value)
  return _locales.length !== 0 ? _locales[0] : { code: 'ja', name: '日本語' }
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld :msg="t('App.msg')" />
      <nav>
        <router-link :to="localePath('/')">{{ t('App.home') }}</router-link>
        <router-link :to="localePath('/about')">{{ t('App.about') }}</router-link>
        <router-link :to="switchLocalePath(switchableLocale.code)">{{ switchableLocale.name }}</router-link>
      </nav>
    </div>
  </header>

  <router-view />
</template>

<style>
@import '@/assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
