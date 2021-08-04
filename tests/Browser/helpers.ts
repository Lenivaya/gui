import puppeteer from 'puppeteer';
import 'expect-puppeteer';

export const puppeteerConfig = {
  // product: 'firefox',
  headless: true,
  devtools: false,
  slowMo: 250,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-dev-shm-usage',
    '--allow-running-insecure-content',
    '--disable-web-security',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
  ],
};

export const browserSetup = (browser, page) => {
  const browser = puppeteer.launch(puppeteerConfig);
  const page = browser.newPage();

  page.setViewport({ width: 1366, height: 768 });
  page.setUserAgent('UA-TEST');
  page.goto(`file://${process.cwd()}/public/index.html`, {
    waitUntil: 'networkidle2',
  });
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const addNode = async (nodeName: string, page) => {
  await expect(page).toClick('span#add-node');
  await page.waitForSelector('input#node-search', {
    visible: true,
  });
  await page.focus('#node-search');
  await page.keyboard.type(nodeName);
  await page.keyboard.press('Enter');
  await page.waitForSelector('div.node', {
    visible: true,
  });
};

export const generateRandomString = () => {
  return Math.random().toString(36).substring(7);
};
