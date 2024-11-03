import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const v = body.v
  if (!v)
    return

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(`https://www.youtube.com/watch?v=${v}`, { waitUntil: 'networkidle2' })

  const btnSelector = `button[aria-label="Show transcript"]`
  await page.waitForSelector(btnSelector)

  await page.evaluate((selector) => {
    // @ts-expect-error document only for pupperteer
    const button = document.querySelector(selector)
    if (button) {
      button.scrollIntoView()
      button.click()
    }
  }, btnSelector)

  const transcriptsSelector = 'ytd-transcript-segment-renderer.style-scope.ytd-transcript-segment-list-renderer'
  await page.waitForSelector(transcriptsSelector)
  const transcriptSegments = await page.$$eval(
    transcriptsSelector,
    segments => segments.map((segment) => {
      const text = segment.textContent.trim().replaceAll('\n', ' ')
      return text.replace(/^\d{1,2}:\d{2}\s*/, '')
    }),
  )

  await browser.close()
  return transcriptSegments
})