<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    return { t }
  }
})
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
