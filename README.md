# ts-edge-router

Compile-time validated edge routing for TypeScript with zero runtime reflection.

Generate Cloudflare Workers / Vercel Edge configs directly from typed route definitions. All paths and methods are checked at build time.

## Features

- Route definitions as TS functions
- Compile-time path parameter validation
- Zero runtime router lookup
- Outputs for Cloudflare Workers, Vercel Edge, Deno Deploy

## Usage

```ts
import { route, get, post } from 'ts-edge-router';

export const app = route({
  'GET /users/:id': get(({ id }) => ...),
  'POST /users': post(({ body }) => ...),
});
```

## License

MIT
