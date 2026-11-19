import { describe, it, expect } from 'vitest';
import { get, post, route } from '../src/index';

describe('route', () => {
  it('defines a GET route', () => {
    const routeDef = get('/users/:id', ({ id }) => ({ id }));
    expect(routeDef.method).toBe('GET');
    expect(routeDef.path).toBe('/users/:id');
  });

  it('defines a POST route', () => {
    const routeDef = post('/users', ({ body }) => body);
    expect(routeDef.method).toBe('POST');
  });

  it('compiles routes', () => {
    const config = route({
      'GET /users/:id': get('/users/:id', async ({ id }) => ({ id })),
      'POST /users': post('/users', async ({ body }) => body),
    });
    
    expect(config.routes).toHaveLength(2);
    expect(config.routes[0].method).toBe('GET');
    expect(config.routes[1].method).toBe('POST');
  });
});
