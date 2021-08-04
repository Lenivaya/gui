import puppeteer from 'puppeteer';
import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';
import { puppeteerConfig, sleep, addNode } from './helpers';

setDefaultOptions({ timeout: 0 });

describe('Node modal', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch(puppeteerConfig);
    page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('UA-TEST');
    await page.goto(
      `file://${process.cwd()}/public/index.html`,
      { waitUntil: 'networkidle2' },
    );

    await sleep(5000);
  }, 200000);

  describe('Fields | Persisting', () => {
    beforeAll(async () => {
      const node = 'CreateJSON';
      await addNode(node, page);
    }, 50000);

    test('Fields is being automatically persisted', async () => {
      await page.keyboard.press('Enter');
      await page.waitForSelector('div#node-modal', {
        visible: true,
      });

      const newName = 'json creator';

      await page.focus('#field-node_name > input');
      await page.keyboard.type(newName);
      await page.keyboard.press('Escape');

      await expect(page).toMatch(newName);
    }, 50000);
  });
});
