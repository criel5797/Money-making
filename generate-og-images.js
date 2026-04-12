'use strict';

/**
 * generate-og-images.js
 * Converts SVG og:images to PNG using Playwright for SNS compatibility.
 * Run after generate.js: node generate-og-images.js
 */

var fs = require('fs');
var path = require('path');
var playwright = require('playwright');

var OUT = path.join(__dirname, 'dist', 'Money-making');

// Collect all og-image.svg paths
function findOgImages(dir) {
  var results = [];
  if (!fs.existsSync(dir)) return results;
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var e of entries) {
    var full = path.join(dir, e.name);
    if (e.isDirectory()) {
      var sub = findOgImages(full);
      for (var s of sub) results.push(s);
    } else if (e.name === 'og-image.svg') {
      results.push(full);
    }
  }
  return results;
}

async function convertAll() {
  var svgPaths = findOgImages(OUT);
  console.log('SVG og:image 파일 수:', svgPaths.length);

  var browser = await playwright.chromium.launch();
  var page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  var done = 0;
  for (var svgPath of svgPaths) {
    var pngPath = svgPath.replace('.svg', '.png');
    var fileUrl = 'file:///' + svgPath.replace(/\\/g, '/');
    try {
      await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 10000 });
      await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
      done++;
      if (done % 5 === 0) process.stdout.write('\r변환 중... ' + done + '/' + svgPaths.length);
    } catch (e) {
      console.error('실패:', svgPath, e.message);
    }
  }

  await browser.close();
  console.log('\n✅ PNG 변환 완료:', done + '/' + svgPaths.length);
}

convertAll().catch(function(e) {
  console.error('오류:', e);
  process.exit(1);
});
