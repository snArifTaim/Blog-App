/**
 * Error Logging Service
 * Handles error tracking and logging throughout the app
 */

class ErrorLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 50;
    this.isDev = __DEV__; // Expo provides this global
  }

  log(error, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      context,
      type: error?.name || 'Error',
    };

    // Add to logs array (keep last 50)
    this.logs.push(errorLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log to console in development
    if (this.isDev) {
      console.error('📛 Error Log:', errorLog.message);
      if (error?.stack) {
        console.error(error.stack);
      }
      if (Object.keys(context).length > 0) {
        console.error('Context:', context);
      }
    }

    return errorLog;
  }

  warn(message, context = {}) {
    const warnLog = {
      timestamp: new Date().toISOString(),
      message,
      context,
      type: 'Warning',
    };

    this.logs.push(warnLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (this.isDev) {
      console.warn('⚠️  Warning:', message, context);
    }

    return warnLog;
  }

  info(message, context = {}) {
    const infoLog = {
      timestamp: new Date().toISOString(),
      message,
      context,
      type: 'Info',
    };

    this.logs.push(infoLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (this.isDev) {
      console.info('ℹ️  Info:', message, context);
    }

    return infoLog;
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export default new ErrorLogger();
