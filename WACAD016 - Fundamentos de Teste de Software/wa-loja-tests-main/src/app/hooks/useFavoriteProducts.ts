import { useContext } from "react";
import { FavoritesContext } from "../State/FavoritesProvider";

export const useFavoriteProducts = () => {
  const { favorites } = useContext(FavoritesContext);

  return favorites;
};
