import puppeteer from 'puppeteer';
import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';
import {
  puppeteerConfig,
  sleep,
  addNode,
  generateRandomString,
} from './helpers';
import { sample } from 'lodash';

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
    let nodeName;

    beforeAll(async () => {
      const possibleNodesNames = [
        'CreateJSON',
        'HTTPRequest',
        'Inspect',
      ];

      const node = sample(possibleNodesNames);
      nodeName = node;
      await addNode(node, page);

      await page.keyboard.press('Enter');
      await page.waitForSelector('#node-modal', {
        visible: true,
      });
    }, 50000);

    test('Fields is being automatically persisted', async () => {
      await page.focus(`input[value="${nodeName}"]`);

      const newName = generateRandomString();
      await page.keyboard.type(newName);
      await page.keyboard.press('Escape');

      await expect(page).toMatch(newName);
    }, 100000);
  });

  describe('Fields | Repeatables', () => {
    const repeatableRowSelector =
      '.flex.flex-row.space-x-1';

    test('Repeatables can be added and removed', () => {
      const node = 'CreateAttribute';
      await addNode(node, page);

      await page.keyboard.press('Enter');
      const modal = await expect(page).toMatchElement(
        '#node-modal',
      );
      // await page.waitForSelector('#node-modal', {
      //   visible: true,
      // });

      let repeatables = await page.$$(
        repeatableRowSelector,
      );
      expect(repeatables.length).toBe(1);

      await expect(modal).toClick('span', { text: '+' });
      repeatables = await page.$$(repeatableRowSelector);
      expect(repeatables.length).toBe(2);

      await expect(modal).toClick('span', { text: '-' });
      repeatables = await page.$$(repeatableRowSelector);
      expect(repeatables.length).toBe(1);
    });
  }, 100000);

  afterAll(() => browser.close());
});
