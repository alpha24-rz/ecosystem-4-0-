"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db, googleProvider, twitterProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ user?: User; error?: string }>
  signIn: (email: string, password: string) => Promise<{ user?: User; error?: string }>
  signInWithGoogle: () => Promise<{ user?: User; error?: string }>
  signInWithTwitter: () => Promise<{ user?: User; error?: string }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success?: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const createUserDocument = async (user: User, additionalData: any = {}) => {
    if (!user) return

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user
      const createdAt = serverTimestamp()

      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData.name || "",
          email,
          photoURL: photoURL || "",
          role: "user",
          isActive: true,
          createdAt,
          lastLoginAt: serverTimestamp(),
          ...additionalData,
        })
        console.log("User document created successfully")
      } catch (error) {
        console.error("Error creating user document:", error)
      }
    } else {
      // Update last login
      try {
        await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true })
      } catch (error) {
        console.error("Error updating last login:", error)
      }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("Starting sign up process...")

      // Check if Firebase is properly initialized
      if (!auth) {
        throw new Error("Firebase auth not initialized")
      }

      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log("User created successfully:", result.user.uid)

      // Update user profile with name
      if (result.user && name) {
        await updateProfile(result.user, { displayName: name })
        console.log("User profile updated with name")
      }

      // Create user document in Firestore
      await createUserDocument(result.user, { name })

      return { user: result.user }
    } catch (error: any) {
      console.error("Sign up error:", error)
      return { error: error.code || error.message }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Starting sign in process...")

      // Check if Firebase is properly initialized
      if (!auth) {
        throw new Error("Firebase auth not initialized")
      }

      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log("User signed in successfully:", result.user.uid)

      // Update last login
      await createUserDocument(result.user)

      return { user: result.user }
    } catch (error: any) {
      console.error("Sign in error:", error)
      return { error: error.code || error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign in...")

      if (!auth) {
        throw new Error("Firebase auth not initialized")
      }

      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign in successful:", result.user.uid)

      await createUserDocument(result.user)

      return { user: result.user }
    } catch (error: any) {
      console.error("Google sign in error:", error)
      return { error: error.code || error.message }
    }
  }

  const signInWithTwitter = async () => {
    try {
      console.log("Starting Twitter sign in...")

      if (!auth) {
        throw new Error("Firebase auth not initialized")
      }

      const result = await signInWithPopup(auth, twitterProvider)
      console.log("Twitter sign in successful:", result.user.uid)

      await createUserDocument(result.user)

      return { user: result.user }
    } catch (error: any) {
      console.error("Twitter sign in error:", error)
      return { error: error.code || error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      console.log("User signed out successfully")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error: any) {
      console.error("Password reset error:", error)
      return { error: error.code || error.message }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithTwitter,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
