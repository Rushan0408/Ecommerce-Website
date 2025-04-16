"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import * as authApi from "@/lib/api/auth"

type AuthContextType = {
  user: authApi.User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<authApi.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for current user session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authApi.getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error("Failed to get current user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user } = await authApi.login({ email, password })
      setUser(user)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Auth provider register called with:', { name, email, password });
      // Call the API register function with the user data
      const result = await authApi.register({ name, email, password });
      console.log('Register API result:', result);
      
      // Update the user state with the returned user data
      if (result && result.user) {
        setUser(result.user);
        return true;
      } else {
        console.error('Registration returned invalid user data');
        return false;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

