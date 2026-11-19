import { describe, it, expect } from 'vitest';
import { get, post, route, generateWorker, patternToRegex, extractParamNames, methods } from '../src/index';
import type { EdgeConfig } from '../src/types';

describe('integration', () => {
  it('completes full routing flow', () => {
    const usersRoute = get('/users/:id', ({ id }) => ({ userId: id }));
    const createUser = post('/users', ({ body }) => ({ created: body.name }));

    const config: EdgeConfig = route({
      'GET /users/:id': usersRoute,
      'POST /users': createUser,
    });

    expect(config.routes).toHaveLength(2);
    expect(config.entrypoint).toBe('./worker.ts');
  });

  it('generates valid worker code', () => {
    const config = route({
      'GET /users/:id': get('/users/:id', async ({ id }) => ({ id })),
    });

    const code = generateWorker(config, { runtime: 'cloudflare' });
    expect(code).toContain("import { Router } from 'itty-routing'");
    expect(code).toContain('export default app');
  });

  it('handles parameter extraction correctly', () => {
    const regex = patternToRegex('/users/:id/posts/:postId');
    expect(regex.test('/users/123/posts/456')).toBe(true);
    expect(extractParamNames('/users/:id/posts/:postId')).toEqual(['id', 'postId']);
  });

  it('supports all HTTP methods via methods object', () => {
    expect(typeof methods.get).toBe('function');
    expect(typeof methods.post).toBe('function');
    expect(typeof methods.put).toBe('function');
    expect(typeof methods.del).toBe('function');
    expect(typeof methods.patch).toBe('function');
  });
});
