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

  const addNode = async (nodeName: string, page) => {
    await expect(page).toClick('span#add-node');
    await page.focus('input#node-search')
    await expect(page).toFill(
      'input#node-search',
      nodeName,
    );
    await page.keyboard.press('Enter');
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
    await addNode(node1, page);

    // const node2 = 'Inspector';
    // await addNode(node2, page);

    const nodesNames = await page.$$eval('.node', (els) =>
      els.map((el) => el.textContent),
    );

    console.log(nodesNames);

    // await expect(page).toMatch(node1);
    // await expect(page).toMatch(node2);
    browser.close();
  }, 90000);
});
