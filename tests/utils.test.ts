import { describe, it, expect } from 'vitest';
import { patternToRegex, extractParamNames, createRouteKey } from '../src/utils';

describe('utils', () => {
  it('converts pattern to regex', () => {
    const regex = patternToRegex('/users/:id');
    expect(regex.test('/users/123')).toBe(true);
    expect(regex.test('/users/')).toBe(false);
  });

  it('extracts param names', () => {
    const names = extractParamNames('/users/:id/posts/:postId');
    expect(names).toEqual(['id', 'postId']);
  });

  it('creates route keys', () => {
    const key = createRouteKey('GET', '/users/:id');
    expect(key).toBe('GET /users/:id');
  });
});
