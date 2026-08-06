import { useContext } from "react";
import { FavoritesContext } from "../State/FavoritesProvider";

export const useIsProductFavorite = (id: string) => {
  const { favorites } = useContext(FavoritesContext);

  const isFavorite = favorites.some((item) => item.id === id);

  return isFavorite;
};
