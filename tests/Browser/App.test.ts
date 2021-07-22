import puppeteer from 'puppeteer';
import 'expect-puppeteer';

describe('App', () => {
  const setup = async () => {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.emulate({
      viewport: {
        width: 500,
        height: 2400,
      },
      userAgent: '',
    });

    await page.goto(
      `file://${process.cwd()}/public/index.html`,
    );

    return {
      page,
      browser,
    };
  };

  const { page, browser } = setup();

  it('Loads and renders react', async () => {
    await expect(page).toMatch('proof of concept');
  }, 20000);
});
