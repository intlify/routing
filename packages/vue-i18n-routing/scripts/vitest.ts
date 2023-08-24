/* eslint-disable @typescript-eslint/no-explicit-any, vue/one-component-per-file */

import { defineComponent, createApp, h, provide, ref } from 'vue-demi'

import type { InjectionKey, Ref } from 'vue-demi'

type InstanceType<V> = V extends { new (...arg: any[]): infer X } ? X : never
type VM<V> = InstanceType<V> & { unmount(): void }
type Plugins = [...any]

export function mount<V>(Comp: V, plugins: Plugins[] = []) {
  const el = document.createElement('div')
  const app = createApp(Comp as any)

  for (const plugin of plugins) {
    app.use(plugin[0], plugin[1])
  }

  // @ts-ignore
  const unmount = () => app.unmount(el)
  const comp = app.mount(el) as any as VM<V>
  comp.unmount = unmount
  return comp
}

export function useSetup<V>(setup: () => V, plugins: Plugins[] = []) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    }
  })

  return mount(Comp, plugins)
}

export const Key: InjectionKey<Ref<number>> = Symbol('num')

export function useInjectedSetup<V>(setup: () => V, plugins: any[] = []) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    }
  })

  const Provider = defineComponent({
    components: { Comp },
    setup() {
      provide(Key, ref(1))
    },
    render() {
      return h('div', [])
    }
  })

  return mount(Provider, plugins)
}

/* eslint-enable @typescript-eslint/no-explicit-any, vue/one-component-per-file */
