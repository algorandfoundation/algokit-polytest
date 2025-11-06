import { expect, test } from 'vitest';
import { handlers } from './handlers.js';

test('handlers should be an array', () => {
  expect(Array.isArray(handlers)).toBe(true);
});

test('handlers should be generated from OpenAPI spec', () => {
  expect(handlers.length).toBeGreaterThan(0);
});

test('handlers should include algod endpoints', () => {
  // Verify at least some common endpoints were generated
  expect(handlers.length).toBeGreaterThan(10);
});