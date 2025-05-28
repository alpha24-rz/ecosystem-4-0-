import { authenticator } from "otplib"
import QRCode from "qrcode"

export class TwoFactorAuth {
  static generateSecret(email: string): string {
    return authenticator.generateSecret()
  }

  static async generateQRCode(email: string, secret: string): Promise<string> {
    const service = "Ecosystem 4.0"
    const otpauth = authenticator.keyuri(email, service, secret)
    return await QRCode.toDataURL(otpauth)
  }

  static verifyToken(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret })
    } catch (error) {
      return false
    }
  }

  static generateBackupCodes(): string[] {
    const codes = []
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
    }
    return codes
  }
}
