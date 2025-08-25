'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

interface AdminContextType {
  user: AdminUser | null
  token: string | null
  login: (token: string, user: AdminUser) => void
  logout: () => void
  isLoggedIn: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')
    const storedUser = localStorage.getItem('adminUser')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    }
  }, [])

  const login = (newToken: string, newUser: AdminUser) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('adminToken', newToken)
    localStorage.setItem('adminUser', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoggedIn: !!user && !!token
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}