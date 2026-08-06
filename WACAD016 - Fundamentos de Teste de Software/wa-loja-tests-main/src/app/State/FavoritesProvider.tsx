"use client";
import React, { createContext, useState } from "react";

interface IFavorites {
  favorites: Product[];
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const FavoritesContext = createContext<IFavorites>({
  favorites: [] as Product[],
  setFavorites: () => {},
});

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Product[] | []>([]);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
