import { describe, it, expect } from 'vitest';
import { getBusinessValueInfo } from '../src/utils';

describe('getBusinessValueInfo', () => {
  it('maps high score (9) to Critical', () => {
    const info = getBusinessValueInfo(9);
    expect(info.text).toBe('Critical');
    expect(info.range).toMatch(/Legal/);
  });
  it('maps 7 to Significant Value', () => {
    const info = getBusinessValueInfo(7);
    expect(info.text).toBe('Significant Value');
    expect(info.range).toBe('> £1m');
  });
  it('maps 5 to High Value', () => {
    const info = getBusinessValueInfo(5);
    expect(info.text).toBe('High Value');
  });
  it('maps 3 to Medium Value', () => {
    const info = getBusinessValueInfo(3);
    expect(info.text).toBe('Medium Value');
  });
  it('maps 1 to Low Value', () => {
    const info = getBusinessValueInfo(1);
    expect(info.text).toBe('Low Value');
  });
});
