import { describe, expect, it } from 'vitest';
import { stopProgress } from './scrollStops';

const tops = [0, 1000, 2000, 3500];

describe('stopProgress', () => {
  it('is 0 at the top of the page and before the first stop', () => {
    expect(stopProgress(0, tops)).toBe(0);
    expect(stopProgress(-50, tops)).toBe(0);
  });

  it('reaches a whole number exactly when that stop reaches the top of the viewport', () => {
    expect(stopProgress(1000, tops)).toBe(1);
    expect(stopProgress(2000, tops)).toBe(2);
  });

  it('interpolates within uneven sections by that section height', () => {
    expect(stopProgress(500, tops)).toBe(0.5);
    expect(stopProgress(2750, tops)).toBe(2.5);
  });

  it('holds at the last stop for everything below it', () => {
    expect(stopProgress(3500, tops)).toBe(3);
    expect(stopProgress(9000, tops)).toBe(3);
  });

  it('returns 0 when there are no stops or only one', () => {
    expect(stopProgress(400, [])).toBe(0);
    expect(stopProgress(400, [0])).toBe(0);
  });
});
