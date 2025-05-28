import { createHash, randomBytes } from "crypto"
import { addMinutes, isAfter } from "date-fns"

export interface LoginAttempt {
  ip: string
  timestamp: Date
  success: boolean
  userAgent: string
}

export interface AdminSession {
  userId: string
  sessionId: string
  createdAt: Date
  lastActivity: Date
  ip: string
  userAgent: string
  isActive: boolean
}

export class AuthSecurity {
  private static readonly MAX_LOGIN_ATTEMPTS = 3
  private static readonly LOCKOUT_DURATION = 15 // minutes
  private static readonly SESSION_TIMEOUT = 30 // minutes
  private static readonly OTP_EXPIRY = 10 // minutes

  static generateSessionId(): string {
    return randomBytes(32).toString("hex")
  }

  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  static hashPassword(password: string, salt: string): string {
    return createHash("sha256")
      .update(password + salt)
      .digest("hex")
  }

  static generateSalt(): string {
    return randomBytes(16).toString("hex")
  }

  static isSessionValid(session: AdminSession): boolean {
    const now = new Date()
    const sessionExpiry = addMinutes(session.lastActivity, this.SESSION_TIMEOUT)
    return session.isActive && isAfter(sessionExpiry, now)
  }

  static shouldShowCaptcha(attempts: LoginAttempt[], ip: string): boolean {
    const recentAttempts = attempts.filter(
      (attempt) =>
        attempt.ip === ip &&
        !attempt.success &&
        isAfter(addMinutes(attempt.timestamp, this.LOCKOUT_DURATION), new Date()),
    )
    return recentAttempts.length >= this.MAX_LOGIN_ATTEMPTS
  }

  static isAccountLocked(attempts: LoginAttempt[], ip: string): boolean {
    const recentFailedAttempts = attempts.filter(
      (attempt) =>
        attempt.ip === ip &&
        !attempt.success &&
        isAfter(addMinutes(attempt.timestamp, this.LOCKOUT_DURATION), new Date()),
    )
    return recentFailedAttempts.length >= this.MAX_LOGIN_ATTEMPTS
  }
}
