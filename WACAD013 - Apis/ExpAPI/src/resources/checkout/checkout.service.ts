type CartItem = {
  productId: number;
  quantity: number;
};

const carts = new Map<number, CartItem[]>();

export const clearCart = (userId: number) => {
  carts.set(userId, []);
};

export const getCart = (userId: number): CartItem[] => carts.get(userId) ?? [];

export const addProductToCart = (userId: number, productId: number, quantity: number) => {
  const currentCart = getCart(userId);
  const existingItem = currentCart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    currentCart.push({ productId, quantity });
  }

  carts.set(userId, currentCart);
};
