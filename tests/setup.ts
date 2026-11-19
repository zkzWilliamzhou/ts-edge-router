// Test setup file
import { expect } from 'vitest';

// Extend expect with custom matchers
expect.extend({
  toBeValidRoute(received: unknown) {
    const isValid = received && typeof received === 'object' && 'method' in received && 'path' in received;
    return {
      pass: isValid,
      message: () => `expected ${JSON.stringify(received)} to be a valid route`,
    };
  },
});
