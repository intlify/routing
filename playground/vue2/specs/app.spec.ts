import { setup, url, createPage } from 'vite-test-utils'
import { test, expect } from 'vitest'

await setup({
  browser: true
})

test('i18n & routing', async () => {
  const page = await createPage()
  await page.goto(url('/'))

  page.on('console', (...args) => console.log(...args))

  // initial title
  const header = await page.locator('h1.green')
  expect(await header.textContent()).toBe('You did it!')

  // check `localeHead`
  const localeHead = await page.locator('code#head')
  let head = JSON.parse((await localeHead.textContent()) || '{}')
  expect(head.htmlAttrs.lang).toBe('en-US')

  // go to about page
  const aboutMenu = await page.locator('header a[href="/about"]')
  await aboutMenu.click()
  const aboutHeader = await page.locator('.about h1')
  expect(await aboutHeader.textContent()).toBe('This is an about page')

  // change locale
  const jaAbout = await page.locator('header a[href="/ja/about"]')
  await jaAbout.click()
  expect(await header.textContent()).toBe('それをしました！')
  expect(await aboutHeader.textContent()).toBe('これはアバウトページです')

  // go to home page
  const jaHome = await page.locator('header a[href="/ja"]')
  await jaHome.click()
  head = JSON.parse((await localeHead.textContent()) || '{}')
  expect(head.htmlAttrs.lang).toBe('ja-JP')
})
