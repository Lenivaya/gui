import puppeteer from 'puppeteer';
import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';

setDefaultOptions({ timeout: 0 });

// const sleep = (ms: number) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

describe('App', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
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
    page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('UA-TEST');
    await page.goto(
      `file://${process.cwd()}/public/index.html`,
      { waitUntil: 'networkidle0', timeout: 0 },
    );
    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
    await page.setDefaultTimeout(0);
  }, 50000);

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
    await page.waitForSelector('div.node', {
      visible: true,
    });
  };

  it('Loads and renders react', async () => {
    await expect(page).toMatch('proof of concept');
    await expect(page).toMatch('DataStory');
  });

  it('Creates nodes', async () => {
    const node = 'CreateJSON';
    await addNode(node, page);

    const node2 = 'Inspect';
    await addNode(node2, page);

    // const node3 = 'Comment'
    // await addNode(node3, page);

    await expect(page).toMatch(node);
    await expect(page).toMatch(node2);
    // await expect(page).toMatch(node3);
  }, 100000);

  afterAll(() => browser.close());
});
