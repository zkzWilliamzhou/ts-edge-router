/**
 * ts-edge-router - Compile-time validated edge routing for TypeScript
 * 
 * Generates edge functions for Cloudflare Workers, Vercel Edge, Deno Deploy
 * with full compile-time type safety.
 * 
 * @example
 * ```ts
 * import { route, get, post } from 'ts-edge-router';
 * 
 * export const config = route({
 *   'GET /users/:id': get('/users/:id', ({ id }) => ({ id })),
 *   'POST /users': post('/users', ({ body }) => createUser(body)),
 * });
 * ```
 */

export * from './types';

import type { RouteCollection, CompiledRoute, EdgeConfig, RouteDefinition } from './types';
import { patternToRegex, extractParamNames, createRouteKey } from './utils';

export { patternToRegex, extractParamNames, createRouteKey };

/**
 * Infer parameter names from path
 */
export function inferParamTypes(path: string): Record<string, string> {
  const params: Record<string, string> = {};
  const paramRegex = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
  let match;
  while ((match = paramRegex.exec(path)) !== null) {
    params[match[1]] = 'string';
  }
  return params;
}

/**
 * Validate path format
 */
export function isValidPath(path: string): boolean {
  return path.startsWith('/');
}

/**
 * Define a GET route handler
 * @param path - Route pattern (e.g., '/users/:id')
 * @param handler - Async handler function
 */
export function get(path: string, handler: (params: Record<string, unknown>, ctx: { request: Request; env: Record<string, string> }) => Promise<void>): RouteDefinition {
  return { method: 'GET', path, handler };
}

/**
 * Define a POST route handler
 */
export function post(path: string, handler: (params: Record<string, unknown>, ctx: { request: Request; env: Record<string, string> }) => Promise<void>): RouteDefinition {
  return { method: 'POST', path, handler };
}

/**
 * Define a PUT route handler
 */
export function put(path: string, handler: (params: Record<string, unknown>, ctx: { request: Request; env: Record<string, string> }) => Promise<void>): RouteDefinition {
  return { method: 'PUT', path, handler };
}

/**
 * Define a DELETE route handler
 */
export function del(path: string, handler: (params: Record<string, unknown>, ctx: { request: Request; env: Record<string, string> }) => Promise<void>): RouteDefinition {
  return { method: 'DELETE', path, handler };
}

/**
 * Define a PATCH route handler
 */
export function patch(path: string, handler: (params: Record<string, unknown>, ctx: { request: Request; env: Record<string, string> }) => Promise<void>): RouteDefinition {
  return { method: 'PATCH', path, handler };
}

/**
 * Export all HTTP methods for convenience
 */
export const methods = {
  get,
  post,
  put,
  del,
  patch,
};

/**
 * Compile route definitions into deployment-ready config
 */
export function route(collection: RouteCollection): EdgeConfig {
  const compiledRoutes: CompiledRoute[] = [];

  const entries = Object.entries(collection) as [string, RouteDefinition][];
  for (const [key, route] of entries) {
    compiledRoutes.push({
      method: route.method,
      pattern: patternToRegex(route.path),
      paramNames: extractParamNames(route.path),
      handler: route.handler,
    });
  }

  return {
    routes: compiledRoutes,
    entrypoint: './worker.ts',
  };
}

/**
 * Generate TypeScript worker code for edge deployment
 * @param config - Route configuration
 * @param options - Runtime target: 'cloudflare', 'vercel', or 'deno'
 */
export function generateWorker(config: EdgeConfig, options?: { runtime?: 'cloudflare' | 'vercel' | 'deno' }): string {
  const runtime = options?.runtime ?? 'cloudflare';

  const routerImport = {
    cloudflare: "import { Router } from 'itty-routing';",
    vercel: "import { Router } from 'itty-router';",
    deno: "import { Router } from 'https://deno.land/std@0.204.0/http/mod.ts';",
  }[runtime];

  const handlersCode = config.routes.map((route, index) => {
    const method = route.method.toLowerCase();
    return `${method}(${JSON.stringify(route.pattern.source)}, async (request, env, ctx) => {
  return await handler(request, env, ctx);
});`;
  }).join('\n');

  return `${routerImport}
const app = new Router();
app
${handlersCode};

export default app;`;
}
