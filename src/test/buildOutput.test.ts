import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Vite Relative Build Compatibility', () => {
  it('generates dist/index.html with relative asset references and existing files', () => {
    const distIndexPath = path.resolve(__dirname, '../../dist/index.html');
    expect(fs.existsSync(distIndexPath)).toBe(true);

    const htmlContent = fs.readFileSync(distIndexPath, 'utf-8');

    // Confirm relative paths (starting with ./ and not /)
    expect(htmlContent).toContain('href="./favicon.svg"');
    expect(htmlContent).toMatch(/src="\.\/assets\/index-[^"]+\.js"/);
    expect(htmlContent).toMatch(/href="\.\/assets\/index-[^"]+\.css"/);

    // Confirm absence of root-absolute references
    expect(htmlContent).not.toContain('href="/favicon.svg"');
    expect(htmlContent).not.toContain('src="/assets/');
    expect(htmlContent).not.toContain('href="/assets/');

    // Confirm that the referenced JS and CSS files actually exist in dist/assets
    const jsMatch = htmlContent.match(/src="\.\/(assets\/[^"]+\.js)"/);
    const cssMatch = htmlContent.match(/href="\.\/(assets\/[^"]+\.css)"/);

    expect(jsMatch).not.toBeNull();
    expect(cssMatch).not.toBeNull();

    if (jsMatch) {
      const jsPath = path.resolve(__dirname, '../../dist', jsMatch[1]);
      expect(fs.existsSync(jsPath)).toBe(true);
    }

    if (cssMatch) {
      const cssPath = path.resolve(__dirname, '../../dist', cssMatch[1]);
      expect(fs.existsSync(cssPath)).toBe(true);
    }
  });
});
