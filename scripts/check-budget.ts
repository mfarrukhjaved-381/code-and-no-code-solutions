/**
 * Fails when the JavaScript needed for the first screen exceeds the budget (NFR-4).
 *
 * Only scripts that `dist/index.html` references count: those are what the browser downloads
 * before the page becomes interactive. The deferred 3D bundle is fetched later and is measured
 * separately, so it cannot hide inside this number or push it over.
 *
 * A bundle-size tool could not express "only what the initial HTML references", which is why
 * this is a short script rather than a dependency.
 */
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const INITIAL_JS_BUDGET_KB = 90;

const distUrl = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', distUrl), 'utf8');

// Entry scripts and their modulepreloaded imports both block interactivity, so both count.
const scriptPaths = [
  ...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="\/(assets\/[^"]+\.js)"/g),
].flatMap((match) => (match[1] ? [match[1]] : []));

if (scriptPaths.length === 0) {
  // Reporting zero here would mean the pattern broke, not that the page is free.
  throw new Error('No scripts found in dist/index.html; the budget check cannot run');
}

let totalBytes = 0;
for (const path of scriptPaths) {
  const gzippedBytes = gzipSync(await readFile(new URL(path, distUrl))).length;
  totalBytes += gzippedBytes;
  console.log(`${path}  ${(gzippedBytes / 1024).toFixed(1)} KB gzip`);
}

const totalKb = totalBytes / 1024;
const summary = `Initial JS ${totalKb.toFixed(1)} KB gzip, budget ${String(INITIAL_JS_BUDGET_KB)} KB`;
if (totalKb > INITIAL_JS_BUDGET_KB) {
  console.error(`OVER BUDGET: ${summary}`);
  // Setting exitCode, not exiting immediately: fails the CI step but lets the report finish writing.
  process.exitCode = 1;
} else {
  console.log(`Within budget: ${summary}`);
}
