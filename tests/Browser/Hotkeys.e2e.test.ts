import puppeteer from 'puppeteer';
import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';
import { puppeteerConfig, sleep, addNode } from './helpers';

setDefaultOptions({ timeout: 0 });

describe('Hotkeys', () => {
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

  test('[ENTER] selects node from search', async () => {
    const node = 'CreateJSON';
    await addNode(node, page);

    await expect(page).toMatch(node);
  }, 50000);

  test('[SHIFT + T] opens inspector', async () => {
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyT');
    await page.keyboard.up('Shift');

    await expect(page).toMatch('No data to show here');
  }, 50000);

  test('[SHIFT + J] opens DiagramJson', async () => {
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyJ');
    await page.keyboard.up('Shift');

    await expect(page).toMatch('"nodes": [');
  }, 50000);

  test('[SHIFT + L] opens log', async () => {
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyL');
    await page.keyboard.up('Shift');

    await expect(page).toMatch('this is the log');
  }, 50000);

  test('[SHIFT + R] runs the story', async () => {
    await expect(page).toClick('span#run');
    await page.waitForSelector('.Toastify__toast-body', {
      visible: true,
    });

    await sleep(100);
    await expect(page).toMatch('Successfully ran story!');
  }, 50000);

  test('[SHIFT + D] opens diagram', async () => {
    // Go to inpector first
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyT');
    await page.keyboard.up('Shift');
    await expect(page).toMatch('No data to show here');

    await sleep(1000);

    // Go to diagram
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyD');
    await page.keyboard.up('Shift');
    await expect(page).not.toMatch('No data to show here');
  }, 200000);

  test('[ENTER] opens node modal', async () => {
    const node = 'CreateJSON';
    await addNode(node, page);
    await expect(page).toMatch(node);

    await expect(page).toMatch('node_name');
    await expect(page).toMatch('features');
  }, 50000);

  afterAll(() => browser.close());
});
