/**
 * Shared Vitest setup.
 *
 * Testing Library only unmounts rendered trees automatically when test globals are enabled. We keep
 * globals off (explicit imports read better), so cleanup is registered here; without it a second
 * render in the same file would find the first one's elements too.
 */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);
