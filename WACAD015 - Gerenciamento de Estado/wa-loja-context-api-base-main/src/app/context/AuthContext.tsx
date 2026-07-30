'use client'

import { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  email: string | null
  login: (email: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  email: null,
  login: () => {},
  logout: () => {}
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userEmail = localStorage.getItem('user')
    if (userEmail) {
      setEmail(userEmail)
    }
  }, [])

  const login = (email: string) => {
    setEmail(email)
    localStorage.setItem('user', email)
    router.push('/')
  }

  const logout = () => {
    setEmail(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ email, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
