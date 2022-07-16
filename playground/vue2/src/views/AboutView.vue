<script setup lang="ts">
import { useI18n } from '@intlify/vue-i18n-bridge'

const { t } = useI18n()
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
