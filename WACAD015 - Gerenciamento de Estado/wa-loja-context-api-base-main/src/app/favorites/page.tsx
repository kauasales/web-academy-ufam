'use client'

import { useContext } from 'react'
import { FavoritesContext } from '../context/FavoritesContext'
import FavoritesList from '../components/FavoritesList/FavoritesList'

export default function FavoritesPage() {
  return (
    <main>
      <div className='container p-5'>
        <FavoritesList />
      </div>
    </main>
  )
}
