import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Logic modules are DOM-free; UI tests can opt into jsdom per file
    // with the comment `// @vitest-environment jsdom`.
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
