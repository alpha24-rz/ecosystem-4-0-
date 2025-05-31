import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  role: "admin" | "super_admin"
  permissions: string[]
  createdAt: string
  createdBy: string
  isActive: boolean
}

// Default admin permissions
export const ADMIN_PERMISSIONS = [
  "read_users",
  "manage_users",
  "read_projects",
  "manage_projects",
  "read_nfts",
  "manage_nfts",
  "read_analytics",
  "manage_settings",
]

export const SUPER_ADMIN_PERMISSIONS = [
  ...ADMIN_PERMISSIONS,
  "manage_admins",
  "system_settings",
  "delete_data",
  "export_data",
]

// Function to create admin user (to be called manually or via admin panel)
export const createAdminUser = async (
  uid: string,
  email: string,
  displayName: string,
  role: "admin" | "super_admin" = "admin",
  createdBy: string,
) => {
  try {
    const adminData: AdminUser = {
      uid,
      email,
      displayName,
      role,
      permissions: role === "super_admin" ? SUPER_ADMIN_PERMISSIONS : ADMIN_PERMISSIONS,
      createdAt: new Date().toISOString(),
      createdBy,
      isActive: true,
    }

    // Update user document with admin role
    await setDoc(
      doc(db, "users", uid),
      {
        role,
        permissions: adminData.permissions,
        isActive: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    // Create admin-specific document
    await setDoc(doc(db, "admins", uid), adminData)

    return { success: true, data: adminData }
  } catch (error) {
    console.error("Error creating admin user:", error)
    return { success: false, error: error }
  }
}

// Function to check if user is admin
export const checkAdminStatus = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        isAdmin: userData.role === "admin" || userData.role === "super_admin",
        isSuperAdmin: userData.role === "super_admin",
        permissions: userData.permissions || [],
        isActive: userData.isActive || false,
      }
    }
    return { isAdmin: false, isSuperAdmin: false, permissions: [], isActive: false }
  } catch (error) {
    console.error("Error checking admin status:", error)
    return { isAdmin: false, isSuperAdmin: false, permissions: [], isActive: false }
  }
}
