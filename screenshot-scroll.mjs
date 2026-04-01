import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

function getNextFilename(label) {
  const files = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
  const nums = files.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
}

const url = process.argv[2] || 'http://localhost:3456';
const scrollY = parseInt(process.argv[3] || '0');
const label = process.argv[4] || `scroll${scrollY}`;

const browser = await puppeteer.launch({
  executablePath: '/Users/noki/.cache/puppeteer/chrome/mac_arm-146.0.7680.153/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  args: [
    '--no-sandbox',
    '--use-gl=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ]
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 3500));

// Scroll to position
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await new Promise(r => setTimeout(r, 800));

const filename = getNextFilename(label);
const filepath = path.join(screenshotsDir, filename);
await page.screenshot({ path: filepath, fullPage: false });
console.log(`Saved: temporary screenshots/${filename}`);

await browser.close();
