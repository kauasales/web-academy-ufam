export const calculatePriceWithDiscount = (price: number, discount: number) => {
  return price - (price * discount) / 100;
};
