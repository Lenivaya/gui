import puppeteer from 'puppeteer';
import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';
import { puppeteerConfig } from './puppeteerConfig';

setDefaultOptions({ timeout: 10000 });

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('App', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch(...puppeteerConfig);
    page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      `file://${process.cwd()}/public/index.html`,
    );
  });

  const addNode = async (nodeName: string, page) => {
    await expect(page).toClick('span#add-node');
    await page.waitForSelector('input#node-search', {
      visible: true,
    });
    await expect(page).toFill(
      'input#node-search',
      nodeName,
    );
    await page.keyboard.press('Enter');
    // await expect(page).toClick(`li#${nodeName}`);
  };

  it('Loads and renders react', async () => {
    await expect(page).toMatch('proof of concept');
    await expect(page).toMatch('DataStory');
    browser.close();
  }, 20000);

  it('Adds a CreateJSON and an Inspect nodes', async () => {
    const node1 = 'CreateJSON';
    await addNode(node1, page);

    // const node2 = 'Inspect';
    // await addNode(node2, page);

    await expect(page).toMatch(node1);
    // await expect(page).toMatch(node2);

    browser.close();
  }, 100000);

  afterAll(() => browser.close());
});
