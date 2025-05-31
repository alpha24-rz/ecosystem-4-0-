export interface User {
  _id?: string
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  role: "user" | "admin" | "super_admin"
  permissions: string[]
  isActive: boolean
  createdAt: string
  lastLoginAt: string
  updatedAt?: Date
}
