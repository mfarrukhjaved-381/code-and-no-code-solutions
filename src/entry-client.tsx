/**
 * Browser entry point.
 *
 * In production `index.html` already contains the prerendered app, so React hydrates it: the
 * visitor sees content before this script runs, and React only attaches behaviour. The dev server
 * serves an empty root, so it renders from scratch there instead.
 */
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('index.html is missing the #root element');
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Checking for an element, not any child node: the dev template still holds the placeholder
// comment, and hydrating against a lone comment would raise a mismatch.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
