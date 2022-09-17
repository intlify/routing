<script setup lang="ts">
import { useI18n } from 'vue-i18n-bridge'

import WelcomeItem from './WelcomeItem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import SupportIcon from './icons/IconSupport.vue'
import ToolingIcon from './icons/IconTooling.vue'

const { t } = useI18n()
</script>

<template>
  <div>
    <WelcomeItem>
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>{{ t('components.TheWelcome.documentation.title') }}</template>
      <i18n-t keypath="components.TheWelcome.documentation.message">
        <template #official>
          <a target="_blank" href="https://vuejs.org/">{{ t('components.TheWelcome.documentation.official') }}</a>
        </template>
      </i18n-t>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <ToolingIcon />
      </template>
      <template #heading>{{ t('components.TheWelcome.tooling.title') }}</template>
      <i18n-t keypath="components.TheWelcome.tooling.message">
        <template #vite>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite</a>
        </template>
        <template #vscode>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
        </template>
        <template #volar>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
        </template>
        <template #cypress>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a href="https://www.cypress.io/" target="_blank">Cypress</a>
        </template>
        <template #testing>
          <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
          <a href="https://docs.cypress.io/guides/component-testing/introduction" target="_blank"
            >Cypress Component Testing</a
          >
          <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
        </template>
        <template #newline><br /></template>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <template #readme><code>README.md</code></template>
      </i18n-t>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <EcosystemIcon />
      </template>
      <template #heading>{{ t('components.TheWelcome.ecosystem.title') }}</template>
      <i18n-t keypath="components.TheWelcome.ecosystem.message">
        <template #state>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a target="_blank" href="https://vuex.vuejs.org/">Vuex</a>
        </template>
        <template #router>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a target="_blank" href="https://router.vuejs.org/">Vue Router</a>
        </template>
        <template #test>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a target="_blank" href="https://vue-test-utils.vuejs.org/">Vue Test Utils</a>
        </template>
        <template #devtools>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a target="_blank" href="https://github.com/vuejs/devtools">Vue Dev Tools</a>
        </template>
        <template #awesome>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a target="_blank" href="https://github.com/vuejs/awesome-vue">Awesome Vue</a>
        </template>
      </i18n-t>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <CommunityIcon />
      </template>
      <template #heading>{{ t('components.TheWelcome.community.title') }}</template>
      <i18n-t keypath="components.TheWelcome.community.message">
        <template #discord>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a target="_blank" href="https://chat.vuejs.org">Vue Land</a>
        </template>
        <template #stackoverflow>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a target="_blank" href="https://stackoverflow.com/questions/tagged/vue.js">StackOverflow</a>
        </template>
        <template #news>
          <a target="_blank" href="https://news.vuejs.org">{{ t('components.TheWelcome.community.mailing') }}</a>
        </template>
        <template #twitter>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <a target="_blank" href="https://twitter.com/vuejs">@vuejs</a>
        </template>
      </i18n-t>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <SupportIcon />
      </template>
      <template #heading>{{ t('components.TheWelcome.support.title') }}</template>
      <i18n-t keypath="components.TheWelcome.support.message">
        <template #sponsor>
          <a target="_blank" href="https://vuejs.org/support-vuejs/">{{
            t('components.TheWelcome.support.sponsor')
          }}</a>
        </template>
      </i18n-t>
    </WelcomeItem>
  </div>
</template>
