"use client"

import { useState, useEffect } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db, googleProvider, twitterProvider } from "@/lib/firebase"

interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  createdAt?: string
  lastLoginAt?: string
  role?: "user" | "admin" | "super_admin"
  permissions?: string[]
  isActive?: boolean
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData)
        }
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const createUserDocument = async (user: User, additionalData: any = {}) => {
    if (!user) return

    const userRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      const { displayName, email, photoURL, emailVerified } = user
      const createdAt = new Date().toISOString()

      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName,
          email,
          photoURL,
          emailVerified,
          createdAt,
          lastLoginAt: createdAt,
          role: "user", // Default role
          permissions: ["read_projects", "participate_projects"],
          isActive: true,
          ...additionalData,
        })
      } catch (error) {
        console.error("Error creating user document:", error)
        throw error
      }
    } else {
      // Update last login time
      await setDoc(
        userRef,
        {
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true },
      )
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      // Update the user's display name
      await updateProfile(user, { displayName })

      // Create user document in Firestore
      await createUserDocument(user, { displayName })

      return { user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      await createUserDocument(user)
      return { user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const adminSignIn = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)

      // Check if user has admin role
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        if (userData.role === "admin" || userData.role === "super_admin") {
          await setDoc(
            doc(db, "users", user.uid),
            {
              lastLoginAt: new Date().toISOString(),
            },
            { merge: true },
          )
          return { user, userData, error: null }
        } else {
          await signOut(auth)
          return { user: null, userData: null, error: "Access denied. Admin privileges required." }
        }
      } else {
        await signOut(auth)
        return { user: null, userData: null, error: "User data not found." }
      }
    } catch (error: any) {
      return { user: null, userData: null, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      await createUserDocument(user)
      return { user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const signInWithTwitter = async () => {
    try {
      const { user } = await signInWithPopup(auth, twitterProvider)
      await createUserDocument(user)
      return { user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const isAdmin = () => {
    return userData?.role === "admin" || userData?.role === "super_admin"
  }

  const isSuperAdmin = () => {
    return userData?.role === "super_admin"
  }

  const hasPermission = (permission: string) => {
    return userData?.permissions?.includes(permission) || false
  }

  return {
    user,
    userData,
    loading,
    signUp,
    signIn,
    adminSignIn,
    signInWithGoogle,
    signInWithTwitter,
    logout,
    resetPassword,
    isAdmin,
    isSuperAdmin,
    hasPermission,
  }
}
