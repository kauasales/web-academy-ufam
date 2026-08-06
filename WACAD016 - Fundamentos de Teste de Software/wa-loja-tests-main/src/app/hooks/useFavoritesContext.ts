import { useContext } from "react";
import { FavoritesContext } from "../State/FavoritesProvider";

export const useFavoritesContext = () => {
  const favoritesContext = useContext(FavoritesContext);

  return favoritesContext;
};
