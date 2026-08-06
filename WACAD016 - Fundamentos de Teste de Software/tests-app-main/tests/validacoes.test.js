const { firstName, checkStockAvailability, calculateTotalPrice } = require('../src/utils/validacoes');

describe('validacoes - unit tests', () => {
  describe('firstName()', () => {
    it('returns the first name when full name has spaces', () => {
      expect(firstName('Maria da Silva')).toBe('Maria');
    });

    it('returns the full name when there is no space', () => {
      expect(firstName('Maria')).toBe('Maria');
    });
  });

  describe('checkStockAvailability()', () => {
    it('returns false when stock is zero', () => {
      expect(checkStockAvailability('book', 1)).toBe(false);
    });

    it('returns true when sufficient stock exists', () => {
      expect(checkStockAvailability('laptop', 1)).toBe(true);
    });

    it('returns false for unknown product type (defensive)', () => {
      expect(checkStockAvailability('unknown-product', 1)).toBe(false);
    });

    it('returns false when requested quantity is greater than stock', () => {
      expect(checkStockAvailability('headphone', 10)).toBe(false);
    });
  });

  describe('calculateTotalPrice()', () => {
    it('calculates sum(price * quantity) for each product', () => {
      const products = [
        { price: 10, quantity: 2 }, 
        { price: 15, quantity: 2 }, 
        { price: 20, quantity: 1 }, 
      ];
      expect(calculateTotalPrice(products)).toBe(70);
    });

    it('returns 0 for an empty array', () => {
      expect(calculateTotalPrice([])).toBe(0);
    });
  });
});