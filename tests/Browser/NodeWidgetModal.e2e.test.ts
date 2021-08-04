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
    beforeAll(async () => {
      const possibleNodesNames = [
        'CreateJSON',
        'HTTPRequest',
        'Inspect',
      ];

      const node = sample(possibleNodesNames);
      await addNode(node, page);

      await page.keyboard.press('Enter');
      await page.waitForSelector('#node-modal', {
        visible: true,
      });

      await page.waitForSelector(`input[value="${node}"]`, {
        visible: true,
      });
      await page.focus(`input[value="${node}"]`);
    }, 50000);

    test('Fields is being automatically persisted', async () => {
      const newName = generateRandomString();
      await page.keyboard.type(newName);
      await page.keyboard.press('Escape');

      await page.waitForSelector('div.node', {
        visible: true,
      });
      await expect(page).toMatch(newName);
    }, 100000);

    test('Fields is being persisted by Enter submission', async () => {
      const newName = generateRandomString();
      await page.keyboard.type(newName);
      await page.keyboard.press('Enter');

      await page.waitForSelector('div.node', {
        visible: true,
      });
      await expect(page).toMatch(newName);
    }, 100000);
  });

  // describe('Fields | Repeatables', () => {});

  afterAll(() => browser.close());
});
