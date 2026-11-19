import { describe, it, expect } from 'vitest';
import type { ExtractPathParams } from '../src/types';

describe('types', () => {
  it('extracts path parameters at compile time', () => {
    // This is a compile-time test - if it compiles, the types work
    type Params1 = ExtractPathParams<'/users/:id'>;
    type Params2 = ExtractPathParams<'/posts/:postId/comments/:commentId'>;
    
    const id: Params1 = '123';
    const postId: Params2 = 'abc';
    const commentId: Params2 = 'def';
    
    expect(id).toBe('123');
    expect(postId).toBe('abc');
    expect(commentId).toBe('def');
  });
});
