/// <reference types="vite/client" />

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare global {
  namespace JSX {
    type Element = VNode
    type ElementClass = Vue
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
