import puppeteer from 'puppeteer';
import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';

setDefaultOptions({ timeout: 5000 });

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('App', () => {
  const setup = async () => {
    const browser = await puppeteer.launch({
      headless: true,
      devtools: false,
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 768 });

    await page.goto(
      `file://${process.cwd()}/public/index.html`,
    );

    return {
      page,
      browser,
    };
  };

  const addNode = async (nodeName: string, page) => {
    await expect(page).toClick('span#add-node');
    await expect(page).toFill(
      'input#node-search',
      nodeName,
    );
    await expect(page).toClick(`li#${nodeName}`);
    sleep(2000);
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
    await addNode(node1, page);

    const node2 = 'Inspector';
    await addNode(node2, page);

    await expect(page).toMatch(node1);
    await expect(page).toMatch(node2);
    browser.close();
  }, 90000);
});
