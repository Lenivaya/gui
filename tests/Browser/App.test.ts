import puppeteer from 'puppeteer';
import 'expect-puppeteer';

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
    await page.waitForSelector('input#node-search');
    await expect(page).toFill(
      'input#node-search',
      nodeName,
    );
    await page.waitForSelector(`#${nodeName}`);
    await expect(page).toClick(`#${nodeName}`);
    sleep(2000);
  };

  it('Loads and renders react', async () => {
    const { page, browser } = await setup();

    await expect(page).toMatch('proof of concept');
    await expect(page).toMatch('DataStory');
    browser.close();
  });

  it('Adds a CreateJSON node', async () => {
    const { page, browser } = await setup();

    const node = 'CreateJSON';
    await addNode(node, page);
    await expect(page).toMatch(node);
    browser.close();
  }, 20000);

  it('Adds an Inspector node', async () => {
    const { page, browser } = await setup();

    const node = 'Inspector';
    await addNode(node, page);
    await expect(page).toMatch(node);
    browser.close();
  }, 20000);
});
