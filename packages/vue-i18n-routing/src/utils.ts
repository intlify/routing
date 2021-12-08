export function adjustRoutePathForTrailingSlash(
  pagePath: string,
  trailingSlash: boolean,
  isChildWithRelativePath: boolean
) {
  return pagePath.replace(/\/+$/, '') + (trailingSlash ? '/' : '') || (isChildWithRelativePath ? '' : '/')
}
