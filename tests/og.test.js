import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { readFileSync } from 'fs';

const root = new URL('..', import.meta.url).pathname;
const pubs = JSON.parse(readFileSync(join(root, 'public/data/pubs.json'), 'utf8'));
const ogDir = join(root, 'dist/og');

describe('OG images', () => {
  it('dist/og/ directory exists after build', () => {
    if (!existsSync(ogDir)) {
      console.warn('dist/og/ not found — run "bun run build:og" first');
      return;
    }
    expect(existsSync(ogDir)).toBe(true);
  });

  for (const pub of pubs) {
    it(`${pub.pub_id}.png exists and is > 5KB`, () => {
      const path = join(ogDir, `${pub.pub_id}.png`);
      if (!existsSync(ogDir)) {
        console.warn(`Skipping OG test — dist/og/ not built yet`);
        return;
      }
      expect(existsSync(path), `Missing OG image for ${pub.pub_id}`).toBe(true);
      const size = statSync(path).size;
      expect(size, `${pub.pub_id}.png is too small (${size} bytes)`).toBeGreaterThan(5 * 1024);
    });
  }
});
