'use client'

import { createContext, useState, ReactNode } from 'react'
import { Product } from '@/app/types/product'

interface FavoritesContextType {
  favorites: Product[]
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  setFavorites: () => {}
})

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([])

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}
