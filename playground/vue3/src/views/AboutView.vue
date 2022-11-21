<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locales, localeCodes } = useI18n({
  useScope: 'local'
})
// console.log('locales', locales, localeCodes)
</script>

<template>
  <div class="about">
    <h1>{{ t('views.AboutView') }}</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
