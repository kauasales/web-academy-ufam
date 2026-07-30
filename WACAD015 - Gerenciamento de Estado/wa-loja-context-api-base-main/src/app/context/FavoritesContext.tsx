'use client'

import { createContext, useState, ReactNode, useContext, useMemo } from 'react'
import { Product } from '@/app/types/product'
import { calculateDiscountedPrice } from '@/app/helpers'

interface FavoritesContextType {
  favorites: Product[]
  addFavorite: (product: Product) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  totalFavoritesValue: number
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  totalFavoritesValue: 0
})

export const useFavoritesContext = () => useContext(FavoritesContext)

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([])

  const addFavorite = (product: Product) => {
    setFavorites((prev) => [...prev, product])
  }

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((product) => product.id !== id))
  }

  const isFavorite = (id: string) => {
    return favorites.some((product) => product.id === id)
  }

  const totalFavoritesValue = useMemo(() => {
    return favorites.reduce((acc, product) => {
      return acc + calculateDiscountedPrice(Number(product.preco), product.desconto)
    }, 0)
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, totalFavoritesValue }}>
      {children}
    </FavoritesContext.Provider>
  )
}
