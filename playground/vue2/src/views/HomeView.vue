<script lang="ts">
import { defineComponent } from '@vue/composition-api'

import TheWelcome from '@/components/TheWelcome.vue'

import type { LocaleObject } from 'vue-i18n-routing'

export default defineComponent({
  components: {
    TheWelcome
  },
  computed: {
    switchableLocale() {
      const _locales = (this.$i18n.locales as LocaleObject[]).filter(i => i.code !== this.$i18n.locale)
      return _locales.length !== 0 ? _locales[0] : { code: 'ja', name: '日本語' }
    }
  }
})
</script>

<template>
  <main>
    <TheWelcome />
    <nav>
      <router-link :to="localePath('/')">{{ $t('App.home') }}</router-link>
      <router-link :to="localePath('/about')">{{ $t('App.about') }}</router-link>
    </nav>
    {{ switchableLocale }}
    <code id="head">{{ localeHead({ addSeoAttributes: true }) }}</code>
  </main>
</template>
