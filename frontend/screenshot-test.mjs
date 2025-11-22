import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Wait for animations
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({
      path: `landing-${viewport.name}-${viewport.width}x${viewport.height}.png`,
      fullPage: true
    });

    console.log(`✓ Screenshot saved: landing-${viewport.name}-${viewport.width}x${viewport.height}.png`);
  }

  await browser.close();
  console.log('\n✅ All screenshots captured!');
})();
