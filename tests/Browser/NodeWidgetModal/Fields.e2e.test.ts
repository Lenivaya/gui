import puppeteer from 'puppeteer';
import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';
import {
  puppeteerConfig,
  pageSetup,
  sleep,
  addNode,
  generateRandomString,
} from '../helpers';
import { sample } from 'lodash';

setDefaultOptions({ timeout: 0 });

describe('Fields', () => {
  describe('Persisting', () => {
    let nodeName;
    let browser;
    let page;

    beforeAll(async () => {
      browser = await puppeteer.launch(puppeteerConfig);
      page = await browser.newPage();
      await pageSetup(page);
    }, 50000);

    test('Fields is being automatically persisted', async () => {
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

      await page.focus(`input[value="${nodeName}"]`);
      const newName = generateRandomString();
      await page.keyboard.type(newName);
      await page.keyboard.press('Escape');

      await expect(page).toMatch(newName);
    }, 100000);

    afterAll(() => browser.close());
  });

  describe('Repeatables', () => {
    let browser;
    let page;

    beforeEach(async () => {
      browser = await puppeteer.launch(puppeteerConfig);
      page = await browser.newPage();
      await pageSetup(page);
    }, 50000);

    const repeatableRowSelector =
      '.flex.flex-row.space-x-1';

    const repeatablesLength = async (el) => {
      const repeatables = await el.$$(
        repeatableRowSelector,
      );
      return repeatables.length;
    };

    test('Repeatables can be added and removed', async () => {
      const node = 'CreateAttribute';
      await addNode(node, page);

      await page.keyboard.press('Enter');
      const modal = await expect(page).toMatchElement(
        '#node-modal',
      );
      expect(await repeatablesLength(modal)).toBe(1);

      await expect(modal).toClick('span', { text: '+' });
      expect(await repeatablesLength(modal)).toBe(2);

      await expect(modal).toClick('span', { text: '-' });
      expect(await repeatablesLength(modal)).toBe(1);
    }, 100000);

    test('Repeatables are being respected', async () => {
      await addNode('CreateJSON', page);
      await addNode('CreateAttribute', page);

      await page.keyboard.press('Enter');
      const modal = await expect(page).toMatchElement(
        '#node-modal',
      );

      const randomValue1 = generateRandomString();
      const randomValue2 = generateRandomString();

      await expect(modal).toFill(
        'input[value="Attribute"]',
        'random1',
      );
      await expect(modal).toFill(
        'input[value="Value"]',
        randomValue1,
      );

      await expect(modal).toClick('span', { text: '+' });

      await expect(modal).toFill(
        'input[value="Attribute"]',
        'random2',
      );
      await expect(modal).toFill(
        'input[value="Value"]',
        randomValue2,
      );
      expect(await repeatablesLength(modal)).toBe(2);
      await page.keyboard.press('Enter');

      // await addNode('Inspect', page);
      // await expect(page).toClick('span#run');
      // await page.waitForSelector('.Toastify__toast-body', {
      //   visible: true,
      // });
      // await sleep(100);
      // await expect(page).toMatch('Successfully ran story!');

      // await expect(page).toClick('div#inspector-icon');
      // await sleep(500);
      // await expect(page).toMatch('random1');
      // await expect(page).toMatch('random2');
      // await expect(page).toMatch(randomValue1);
      // await expect(page).toMatch(randomValue2);
    }, 200000);

    afterEach(() => browser.close());
  });
});
