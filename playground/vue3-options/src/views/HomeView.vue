<script lang="ts">
import { defineComponent } from 'vue'

import TheWelcome from '@/components/TheWelcome.vue'

export default defineComponent({
  components: {
    TheWelcome
  }
})
</script>

<template>
  <main>
    <TheWelcome />
    {{ localeHead({ addSeoAttributes: true }) }}
  </main>
</template>
