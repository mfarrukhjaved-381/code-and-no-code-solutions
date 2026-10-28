/**
 * Writes the server-rendered app into the client build's `dist/index.html`.
 *
 * Runs after both `vite build` passes (see the `build` script). This is what puts the welcome
 * heading in the first HTML response, so the page paints before any JavaScript downloads.
 * A missing placeholder or a malformed server bundle fails the build rather than silently
 * shipping an empty page.
 */
import { readFile, writeFile } from 'node:fs/promises';

const PLACEHOLDER = '<!--app-html-->';
const templateUrl = new URL('../dist/index.html', import.meta.url);
const serverEntryUrl = new URL('../dist-ssr/entry-server.js', import.meta.url);

interface ServerEntry {
  render: () => string;
}

/** Narrows the dynamically imported module instead of trusting its shape. */
function isServerEntry(value: unknown): value is ServerEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    'render' in value &&
    typeof value.render === 'function'
  );
}

const template = await readFile(templateUrl, 'utf8');
if (!template.includes(PLACEHOLDER)) {
  throw new Error(`dist/index.html has no ${PLACEHOLDER} placeholder to fill`);
}

const serverEntry: unknown = await import(serverEntryUrl.href);
if (!isServerEntry(serverEntry)) {
  throw new Error('dist-ssr/entry-server.js does not export a render() function');
}

const appHtml = serverEntry.render();
// A replacer function, not a string: a string replacement would treat "$&" or "$1" inside the
// rendered markup as substitution patterns and corrupt it.
await writeFile(
  templateUrl,
  template.replace(PLACEHOLDER, () => appHtml),
);

console.log(`Prerendered ${String(appHtml.length)} characters into dist/index.html`);
