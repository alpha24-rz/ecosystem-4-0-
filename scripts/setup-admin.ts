// Script to setup admin account
// Run this once to create the admin account

import { createSpecificAdminAccount } from "@/lib/create-admin"

async function setupAdmin() {
  console.log("🚀 Setting up admin account...")

  try {
    const result = await createSpecificAdminAccount()

    if (result.success) {
      console.log("✅ Admin setup completed successfully!")
      console.log("🌐 You can now login at: /auth")
      console.log("📧 Email: alfakiddrock7@gmail.com")
      console.log("🔑 Password: kampasrem")
      console.log("🛡️ Role: Admin")
    } else {
      console.error("❌ Admin setup failed:", result.error)
    }
  } catch (error) {
    console.error("❌ Setup error:", error)
  }
}

// Run the setup
setupAdmin()
