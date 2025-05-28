"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { AuthSecurity, type LoginAttempt, type AdminSession } from "@/lib/auth-security"
import { TwoFactorAuth } from "@/lib/two-factor-auth"

interface EnhancedAuthContextType {
  user: User | null
  userData: any
  loading: boolean
  loginAttempts: LoginAttempt[]
  currentSession: AdminSession | null

  // Authentication methods
  adminSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>

  // 2FA methods
  setup2FA: () => Promise<{ secret: string; qrCode: string; backupCodes: string[] }>
  verify2FA: (code: string) => Promise<boolean>
  disable2FA: () => Promise<boolean>

  // Security methods
  getLoginHistory: () => Promise<LoginAttempt[]>
  invalidateAllSessions: () => Promise<void>

  // Utility methods
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
  hasPermission: (permission: string) => boolean
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined)

export function useEnhancedAuth() {
  const context = useContext(EnhancedAuthContext)
  if (context === undefined) {
    throw new Error("useEnhancedAuth must be used within an EnhancedAuthProvider")
  }
  return context
}

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([])
  const [currentSession, setCurrentSession] = useState<AdminSession | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await loadUserData(user.uid)
        await loadLoginHistory(user.uid)
        await createOrUpdateSession(user.uid)
      } else {
        setUserData(null)
        setCurrentSession(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loadUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const loadLoginHistory = async (uid: string) => {
    try {
      const attemptsQuery = query(
        collection(db, "loginAttempts"),
        where("userId", "==", uid),
        orderBy("timestamp", "desc"),
        limit(50),
      )
      const snapshot = await getDocs(attemptsQuery)
      const attempts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as LoginAttempt[]
      setLoginAttempts(attempts)
    } catch (error) {
      console.error("Error loading login history:", error)
    }
  }

  const createOrUpdateSession = async (uid: string) => {
    try {
      const sessionId = AuthSecurity.generateSessionId()
      const session: AdminSession = {
        userId: uid,
        sessionId,
        createdAt: new Date(),
        lastActivity: new Date(),
        ip: "unknown", // Would be set by middleware in production
        userAgent: navigator.userAgent,
        isActive: true,
      }

      await setDoc(doc(db, "adminSessions", sessionId), session)
      setCurrentSession(session)
    } catch (error) {
      console.error("Error creating session:", error)
    }
  }

  const adminSignIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      // Check if user is admin
      const userDoc = await getDoc(doc(db, "users", result.user.uid))
      if (!userDoc.exists() || !["admin", "super_admin"].includes(userDoc.data().role)) {
        await signOut(auth)
        await recordLoginAttempt(result.user.uid, "unknown", false)
        return { success: false, error: "Access denied. Admin privileges required." }
      }

      await recordLoginAttempt(result.user.uid, "unknown", true)
      return { success: true }
    } catch (error: any) {
      await recordLoginAttempt("unknown", "unknown", false)
      return { success: false, error: error.message }
    }
  }

  const recordLoginAttempt = async (userId: string, ip: string, success: boolean) => {
    try {
      const attempt: LoginAttempt = {
        ip,
        timestamp: new Date(),
        success,
        userAgent: navigator.userAgent,
      }

      await addDoc(collection(db, "loginAttempts"), {
        ...attempt,
        userId,
      })
    } catch (error) {
      console.error("Error recording login attempt:", error)
    }
  }

  const setup2FA = async () => {
    if (!user || !userData) throw new Error("User not authenticated")

    const secret = TwoFactorAuth.generateSecret(user.email!)
    const qrCode = await TwoFactorAuth.generateQRCode(user.email!, secret)
    const backupCodes = TwoFactorAuth.generateBackupCodes()

    // Save to user document (but don't enable yet)
    await updateDoc(doc(db, "users", user.uid), {
      twoFactorSecret: secret,
      twoFactorBackupCodes: backupCodes,
      twoFactorEnabled: false, // Will be enabled after verification
    })

    return { secret, qrCode, backupCodes }
  }

  const verify2FA = async (code: string) => {
    if (!user || !userData) return false

    const isValid = TwoFactorAuth.verifyToken(code, userData.twoFactorSecret)

    if (isValid) {
      await updateDoc(doc(db, "users", user.uid), {
        twoFactorEnabled: true,
      })
      await loadUserData(user.uid) // Refresh user data
    }

    return isValid
  }

  const disable2FA = async () => {
    if (!user) return false

    await updateDoc(doc(db, "users", user.uid), {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    })

    await loadUserData(user.uid)
    return true
  }

  const getLoginHistory = async () => {
    return loginAttempts
  }

  const invalidateAllSessions = async () => {
    if (!user) return

    // In production, you'd invalidate all sessions for this user
    // For now, just clear current session
    setCurrentSession(null)
  }

  const logout = async () => {
    if (currentSession) {
      await updateDoc(doc(db, "adminSessions", currentSession.sessionId), {
        isActive: false,
        endedAt: new Date(),
      })
    }
    await signOut(auth)
  }

  const isAdmin = () => {
    return userData?.role === "admin" || userData?.role === "super_admin"
  }

  const isSuperAdmin = () => {
    return userData?.role === "super_admin"
  }

  const hasPermission = (permission: string) => {
    return userData?.permissions?.includes(permission) || isSuperAdmin()
  }

  const value = {
    user,
    userData,
    loading,
    loginAttempts,
    currentSession,
    adminSignIn,
    logout,
    setup2FA,
    verify2FA,
    disable2FA,
    getLoginHistory,
    invalidateAllSessions,
    isAdmin,
    isSuperAdmin,
    hasPermission,
  }

  return <EnhancedAuthContext.Provider value={value}>{children}</EnhancedAuthContext.Provider>
}
