/**
 * Utility functions for ts-edge-router
 */

/**
 * Parse a path pattern like '/users/:id' into a RegExp
 */
export function patternToRegex(pattern: string): RegExp {
  const regexPattern = pattern
    .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '(?<$1>[^/]+)')
    .replace(/\*/g, '(.*)')
    .replace(/\//g, '\\/');

  return new RegExp(`^${regexPattern}$`);
}

/**
 * Extract path parameter names from a pattern
 */
export function extractParamNames(pattern: string): string[] {
  const paramRegex = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
  const matches = pattern.matchAll(paramRegex);
  return Array.from(matches, m => m[1]);
}

/**
 * Create a typed route key from method and path
 */
export function createRouteKey(method: string, path: string): string {
  return `${method} ${path}`;
}
