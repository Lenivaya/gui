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

  it('Loads and renders react', async () => {
    const { page, browser } = await setup();

    await expect(page).toMatch('proof of concept');
    await expect(page.title()).toBe('DataStory');
    browser.close();
  }, 16000);

  // it('Adds a CreateJSON node', async () => {
  //   const { page, browser } = await setup();

  //   await expect(page).toMatch('proof of concept');
  //   browser.close();
  // }, 16000);
});
