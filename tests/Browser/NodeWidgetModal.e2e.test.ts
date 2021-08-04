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
    test('Fields is being automatically persisted', async () => {
      const node = 'CreateJSON';
      await addNode(node, page);

      await page.keyboard.press('Enter');
      await page.waitForSelector('div#node-modal', {
        visible: true,
      });

      const newName = 'json creator';

      await page.waitForSelector(
        'input[value="CreateJSON"]',
        {
          visible: true,
        },
      );
      await page.focus('input[value="CreateJSON"]');
      await page.keyboard.type(newName);
      await page.keyboard.press('Escape');

      await expect(page).toMatch(newName);
    }, 100000);
  });

  test('Fields is being persisted by Enter submission', async () => {
    const node = 'HTTPRequest';
    await addNode(node, page);

    await page.keyboard.press('Enter');
    await page.waitForSelector('div#node-modal', {
      visible: true,
    });

    const newName = 'request over http';

    await page.waitForSelector(
      'input[value="HTTPRequest"]',
      {
        visible: true,
      },
    );
    await page.focus('input[value="HTTPRequest"]');
    await page.keyboard.type(newName);
    await page.keyboard.press('Enter');

    await expect(page).toMatch(newName);
  }, 100000);

  afterAll(() => browser.close());
});
