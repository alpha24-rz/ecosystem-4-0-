"use client"

import type React from "react"
import { createContext, useContext } from "react"
import type { User } from "firebase/auth"
import { useAuth } from "@/hooks/useAuth"

interface AuthContextType {
  user: User | null
  userData: any
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signInWithTwitter: () => Promise<any>
  logout: () => Promise<any>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
