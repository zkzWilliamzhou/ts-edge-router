/**
 * Type definitions for ts-edge-router
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ExtractPathParams<P extends string> = 
  P extends `${string}:${infer Name}`
    ? Name
    : never;

export interface RouteContext {
  request: Request;
  env: Record<string, string>;
  waitUntil?: (promise: Promise<void>) => void;
}

export type RouteHandler = (
  params: Record<string, unknown>,
  context: RouteContext
) => Promise<void>;

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
}

export type RouteCollection = Record<string, RouteDefinition>;

export interface CompiledRoute {
  method: HttpMethod;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

export interface EdgeConfig {
  routes: CompiledRoute[];
  entrypoint: string;
}
