/**
 * Logger - Simple logging utility
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private static instance: Logger;
  private level: LogLevel = LogLevel.INFO;
  
  private constructor() {
    // Private constructor for singleton
  }
  
  /**
   * Get the logger instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  /**
   * Set the logging level
   */
  public setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  /**
   * Log a debug message
   */
  public debug(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
  
  /**
   * Log an info message
   */
  public info(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  /**
   * Log a warning message
   */
  public warn(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  /**
   * Log an error message
   */
  public error(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

export default Logger.getInstance();
export { LogLevel };