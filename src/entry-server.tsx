/**
 * Build-time entry used only by `scripts/prerender.ts`.
 *
 * It renders the app to an HTML string that is written into `dist/index.html`, so the welcome
 * heading reaches the browser in the first response instead of after the JavaScript loads.
 * Nothing in this file ships to visitors.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './app/App';

/** Returns the app's markup for the root element. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
