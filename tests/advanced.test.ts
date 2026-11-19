import { describe, it, expect } from 'vitest';
import { get, post, route, inferParamTypes, isValidPath, methods } from '../src/index';
import type { EdgeConfig } from '../src/types';

describe('advanced features', () => {
  it('infers parameter names from paths', () => {
    const params = inferParamTypes('/users/:id');
    expect(params.id).toBe('string');
  });

  it('validates path format', () => {
    expect(isValidPath('/users')).toBe(true);
    expect(isValidPath('users')).toBe(false);
  });

  it('creates typed route keys', () => {
    const config: EdgeConfig = route({
      'GET /users/:id': get('/users/:id', ({ id }) => ({ userId: id })),
      'POST /users': post('/users', ({ body }) => ({ created: (body as any).name })),
    });
    expect(config.routes).toHaveLength(2);
  });

  it('supports all HTTP methods via methods object', () => {
    expect(typeof methods.get).toBe('function');
    expect(typeof methods.post).toBe('function');
    expect(typeof methods.put).toBe('function');
    expect(typeof methods.del).toBe('function');
    expect(typeof methods.patch).toBe('function');
  });

  it('supports nested path parameters', () => {
    const params = inferParamTypes('/api/v1/users/:userId/posts/:postId');
    expect(params.userId).toBe('string');
    expect(params.postId).toBe('string');
  });
});
