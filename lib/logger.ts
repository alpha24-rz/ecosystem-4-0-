type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, metadata } = entry
    const metaStr = metadata ? ` | ${JSON.stringify(metadata)}` : ""
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    }

    const formattedLog = this.formatLog(entry)

    // Console logging
    switch (level) {
      case "error":
        console.error(formattedLog)
        break
      case "warn":
        console.warn(formattedLog)
        break
      case "debug":
        if (this.isDevelopment) console.debug(formattedLog)
        break
      default:
        console.log(formattedLog)
    }

    // In production, you might want to send logs to external service
    if (!this.isDevelopment && level === "error") {
      // Send to external logging service (e.g., Sentry, LogRocket)
      this.sendToExternalService(entry)
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    // Implement external logging service integration
    // Example: Sentry, LogRocket, or custom logging endpoint
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log("info", message, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log("warn", message, metadata)
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log("error", message, metadata)
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log("debug", message, metadata)
  }
}

export const logger = new Logger()
