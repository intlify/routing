<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import HelloWorld from '@/components/HelloWorld.vue'
import type { LocaleObject } from 'vue-i18n-routing'

export default defineComponent({
  components: {
    HelloWorld
  },
  computed: {
    switchableLocale() {
      const _locales = (this.$i18n.locales as LocaleObject[]).filter(i => i.code !== this.$i18n.locale)
      return _locales.length !== 0 ? _locales[0] : { code: 'ja', name: '日本語' }
    }
  },
  mounted() {
    console.log('this', this)
  }
})
</script>

<template>
  <div id="app">
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld :msg="$t('App.msg')" />
        <nav>
          <router-link :to="localePath('/')">{{ $t('App.home') }}</router-link>
          <router-link :to="localePath('/about')">{{ $t('App.about') }}</router-link>
          <router-link :to="switchLocalePath(switchableLocale.code)">{{ switchableLocale.name }}</router-link>
        </nav>
      </div>
    </header>

    <router-view />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
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
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
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
