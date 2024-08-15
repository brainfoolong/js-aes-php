import { expect, test } from '@playwright/test'

test('Run all tests', async ({ page }) => {
  page.on('console', msg => {
    if (msg.type() === 'error')
      throw new Error(`Console Error: "${msg.text()}"`)
  })
  await page.goto('http://127.0.0.1:6597/tests/test-browser.html')
  await expect(page.locator('#console')).toContainText('TEST SUCCESSFUL', { timeout: 20000 })
  await page.goto('http://127.0.0.1:6597/tests/test-browser-module.html')
  await expect(page.locator('#console')).toContainText('TEST SUCCESSFUL', { timeout: 20000 })
})