import { useContext } from "react";
import { FavoritesContext } from "../State/FavoritesProvider";
import { calculatePriceWithDiscount } from "../helpers";

export const useFavoritesTotalValue = () => {
  const { favorites } = useContext(FavoritesContext);

  const totalValue = favorites.reduce((acc, product) => {
    return acc + calculatePriceWithDiscount(Number(product.preco), product.desconto);
  }, 0);

  return totalValue;
};
