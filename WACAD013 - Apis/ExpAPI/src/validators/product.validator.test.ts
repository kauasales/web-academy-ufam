import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBody, createProductSchema } from './product.validator';

test('validateBody returns English validation errors when the language cookie is set to en', () => {
  const req = {
    body: {
      name: 'A',
      price: -1,
    },
  } as any;

  const res = {
    locals: { language: 'en' },
    statusCode: 200,
    payload: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.payload = payload;
      return this;
    },
  } as any;

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  validateBody(createProductSchema)(req, res, next);

  assert.equal(res.statusCode, 400);
  assert.equal(nextCalled, false);
  assert.deepEqual(res.payload.errors, [
    'Product name must have at least 3 characters.',
    'Price must be a number greater than zero.',
  ]);
});
