import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('greets the visitor with the brand name as the only page heading', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Welcome to Code and No Code Solutions');
  });

  it('presents the unit as part of Mercury Sols, linking to the parent site', () => {
    render(<Hero />);

    const link = screen.getByRole('link', { name: 'Mercury Sols' });
    expect(link.getAttribute('href')).toBe('https://mercurysols.org/');
  });
});
