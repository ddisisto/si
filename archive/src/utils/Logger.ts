/**
 * Logger - Enhanced logging utility with configuration and persistence
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogConfig {
  level?: LogLevel;
  enableTimestamps?: boolean;
  enablePerformance?: boolean;
  persistLogs?: boolean;
  maxLogSize?: number;
  enableStackTrace?: boolean;
}

interface LogEntry {
  level: LogLevel;
  timestamp: number;
  message: string;
  args: any[];
  stack?: string;
  performance?: number;
}

class Logger {
  private static instance: Logger;
  private level: LogLevel = LogLevel.INFO;
  private config: LogConfig = {
    enableTimestamps: true,
    enablePerformance: false,
    persistLogs: false,
    maxLogSize: 1000,
    enableStackTrace: false
  };
  private logs: LogEntry[] = [];
  private performanceMarks: Map<string, number> = new Map();
  
  private constructor() {
    // Private constructor for singleton
    this.loadConfig();
    this.loadLogs();
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
    this.config.level = level;
    this.saveConfig();
  }
  
  /**
   * Configure the logger
   */
  public configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.level !== undefined) {
      this.level = config.level;
    }
    this.saveConfig();
  }
  
  /**
   * Load configuration from localStorage
   */
  private loadConfig(): void {
    try {
      const savedConfig = localStorage.getItem('loggerConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig) as LogConfig;
        this.configure(config);
      }
    } catch (error) {
      // Ignore errors loading config
    }
  }
  
  /**
   * Save configuration to localStorage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem('loggerConfig', JSON.stringify(this.config));
    } catch (error) {
      // Ignore errors saving config
    }
  }
  
  /**
   * Private method to handle the actual logging
   */
  private log(level: LogLevel, message: string, args: any[]): void {
    if (this.level <= level) {
      const timestamp = Date.now();
      const levelName = LogLevel[level];
      let output = '';
      
      if (this.config.enableTimestamps) {
        const date = new Date(timestamp);
        output += `[${date.toISOString()}] `;
      }
      
      output += `[${levelName}] ${message}`;
      
      // Create log entry
      const entry: LogEntry = {
        level,
        timestamp,
        message,
        args,
        performance: this.config.enablePerformance ? performance.now() : undefined,
        stack: this.config.enableStackTrace ? new Error().stack : undefined
      };
      
      // Store log if persistence is enabled
      if (this.config.persistLogs) {
        this.logs.push(entry);
        if (this.logs.length > (this.config.maxLogSize || 1000)) {
          this.logs.shift();
        }
        this.saveLogs();
      }
      
      // Output to console
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(output, ...args);
          break;
        case LogLevel.INFO:
          console.info(output, ...args);
          break;
        case LogLevel.WARN:
          console.warn(output, ...args);
          break;
        case LogLevel.ERROR:
          console.error(output, ...args);
          break;
      }
    }
  }
  
  /**
   * Log a debug message
   */
  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, args);
  }
  
  /**
   * Log an info message
   */
  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, args);
  }
  
  /**
   * Log a warning message
   */
  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, args);
  }
  
  /**
   * Log an error message
   */
  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, args);
  }
  
  /**
   * Start a performance timing
   */
  public startTiming(label: string): void {
    if (this.config.enablePerformance) {
      this.performanceMarks.set(label, performance.now());
    }
  }
  
  /**
   * End a performance timing and log the result
   */
  public endTiming(label: string, message?: string): void {
    if (this.config.enablePerformance) {
      const start = this.performanceMarks.get(label);
      if (start !== undefined) {
        const duration = performance.now() - start;
        this.performanceMarks.delete(label);
        this.info(`${message || label}: ${duration.toFixed(2)}ms`);
      }
    }
  }
  
  /**
   * Get stored logs
   */
  public getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }
  
  /**
   * Clear stored logs
   */
  public clearLogs(): void {
    this.logs = [];
    this.clearPersistedLogs();
  }
  
  /**
   * Save logs to localStorage
   */
  private saveLogs(): void {
    if (this.config.persistLogs) {
      try {
        const logsToSave = this.logs.slice(-100); // Only save last 100 for localStorage limits
        localStorage.setItem('loggerLogs', JSON.stringify(logsToSave));
      } catch (error) {
        // Ignore errors saving logs
      }
    }
  }
  
  /**
   * Clear persisted logs
   */
  private clearPersistedLogs(): void {
    try {
      localStorage.removeItem('loggerLogs');
    } catch (error) {
      // Ignore errors clearing logs
    }
  }
  
  /**
   * Load logs from localStorage
   */
  private loadLogs(): void {
    if (this.config.persistLogs) {
      try {
        const savedLogs = localStorage.getItem('loggerLogs');
        if (savedLogs) {
          this.logs = JSON.parse(savedLogs) as LogEntry[];
        }
      } catch (error) {
        // Ignore errors loading logs
      }
    }
  }
}

export default Logger.getInstance();
export { LogConfig, LogEntry };