// eslint-disable-next-line @typescript-eslint/no-explicit-any
/*#__PURE__*/ export function _isVue2(vueApp: any) {
  return vueApp.version && Number(vueApp.version.split('.')[0]) === 2
}

// Language: typescript
export function adjustRoutePathForTrailingSlash(
  pagePath: string,
  trailingSlash: boolean,
  isChildWithRelativePath: boolean
) {
  return pagePath.replace(/\/+$/, '') + (trailingSlash ? '/' : '') || (isChildWithRelativePath ? '' : '/')
}
