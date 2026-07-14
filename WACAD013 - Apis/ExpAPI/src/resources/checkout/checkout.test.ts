import test from 'node:test';
import assert from 'node:assert/strict';
import { addProductToCart, clearCart, getCart } from './checkout.service';

test('adds products to the cart and aggregates quantities', () => {
  clearCart(7);

  addProductToCart(7, 10, 2);
  addProductToCart(7, 10, 3);
  addProductToCart(7, 11, 1);

  assert.deepEqual(getCart(7), [
    { productId: 10, quantity: 5 },
    { productId: 11, quantity: 1 },
  ]);
});

test('clears the cart after resetting it', () => {
  addProductToCart(8, 12, 1);

  clearCart(8);

  assert.deepEqual(getCart(8), []);
});
