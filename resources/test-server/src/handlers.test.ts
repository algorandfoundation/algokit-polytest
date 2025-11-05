import { expect, test } from 'vitest';
import { handlers } from './handlers.js';

test('handlers should be an array', () => {
  expect(Array.isArray(handlers)).toBe(true);
});

test('handlers should be empty initially', () => {
  expect(handlers).toHaveLength(0);
});