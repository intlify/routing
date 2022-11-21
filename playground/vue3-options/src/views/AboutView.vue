<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  mounted() {
    console.log('foo', this.$i18n.locales, this.$i18n)
  }
})
</script>
<template>
  <div class="about">
    <h1>{{ $t('views.AboutView') }}</h1>
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
