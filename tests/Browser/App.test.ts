import puppeteer from 'puppeteer';
import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';

setDefaultOptions({ timeout: 20000 });

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('App', () => {
  const setup = async () => {
    const browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-web-security',
      ],
    });
    const page = await browser.newPage();

    // await page.setViewport({ width: 1280, height: 768 });

    await page.goto(
      `file://${process.cwd()}/public/index.html`,
    );

    return {
      page,
      browser,
    };
  };

  const addAndCheckNode = async (
    nodeName: string,
    page,
  ) => {
    await expect(page).toClick('span#add-node');
    await page.waitForSelector('input#node-search', {
      visible: true,
    });
    await expect(page).toFill(
      'input#node-search',
      nodeName,
    );
    await page.keyboard.press('Enter');
    await expect(page).toMatch(nodeName);
    // await expect(page).toClick(`li#${nodeName}`);
  };

  it('Loads and renders react', async () => {
    const { page, browser } = await setup();

    await expect(page).toMatch('proof of concept');
    await expect(page).toMatch('DataStory');
    browser.close();
  });

  it('Adds a CreateJSON and an Inspector nodes', async () => {
    const { page, browser } = await setup();

    const node1 = 'CreateJSON';
    await addAndCheckNode(node1, page);

    const node2 = 'Inspect';
    await addAndCheckNode(node2, page);

    browser.close();
  }, 90000);
});
