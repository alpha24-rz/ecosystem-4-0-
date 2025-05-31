import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

// Function to create the specific admin account
export const createSpecificAdminAccount = async () => {
  try {
    // Admin credentials
    const adminEmail = "alfakiddrock7@gmail.com"
    const adminPassword = "kampasrem"
    const adminName = "Admin Ecosystem 4.0"

    // Create Firebase Auth account
    const { user } = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)

    // Update display name
    await updateProfile(user, { displayName: adminName })

    // Create admin user document in Firestore
    const adminData = {
      uid: user.uid,
      email: adminEmail,
      displayName: adminName,
      photoURL: null,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      role: "admin",
      permissions: [
        "read_users",
        "manage_users",
        "read_projects",
        "manage_projects",
        "read_nfts",
        "manage_nfts",
        "read_analytics",
        "manage_settings",
      ],
      isActive: true,
      createdBy: "system",
    }

    // Save to users collection
    await setDoc(doc(db, "users", user.uid), adminData)

    // Save to admins collection
    await setDoc(doc(db, "admins", user.uid), {
      ...adminData,
      adminLevel: "admin",
      department: "Environmental Management",
      accessLevel: "full",
    })

    console.log("✅ Admin account created successfully!")
    console.log("📧 Email:", adminEmail)
    console.log("🔑 Password:", adminPassword)
    console.log("👤 Role: Admin")

    return { success: true, user, adminData }
  } catch (error: any) {
    console.error("❌ Error creating admin account:", error)

    // Handle specific errors
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Admin account already exists, updating role...")

      // If account exists, just update the role
      try {
        const { signInWithEmailAndPassword } = await import("firebase/auth")
        const { user } = await signInWithEmailAndPassword(auth, adminEmail, adminPassword)

        // Update user role to admin
        await setDoc(
          doc(db, "users", user.uid),
          {
            role: "admin",
            permissions: [
              "read_users",
              "manage_users",
              "read_projects",
              "manage_projects",
              "read_nfts",
              "manage_nfts",
              "read_analytics",
              "manage_settings",
            ],
            isActive: true,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        )

        console.log("✅ Existing account upgraded to admin!")
        return { success: true, user, message: "Account upgraded to admin" }
      } catch (upgradeError) {
        console.error("❌ Error upgrading existing account:", upgradeError)
        return { success: false, error: upgradeError }
      }
    }

    return { success: false, error }
  }
}

// Auto-run function to create admin account
// Uncomment the line below to automatically create the admin account
// createSpecificAdminAccount()
