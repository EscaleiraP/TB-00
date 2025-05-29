/**
 * Simple logger utility for the application
 * Provides different log levels and can optionally write to files
 */

// Log levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Default configuration
const defaultConfig = {
  level: LOG_LEVELS.INFO,
  useColors: true,
  logToConsole: true,
  logToFile: false,
  logDir: './logs',
  filePrefix: 'app-log'
};

// Current configuration
let config = { ...defaultConfig };

/**
 * Configures the logger
 * @param {Object} newConfig - Logger configuration
 */
export const configureLogger = (newConfig = {}) => {
  config = { ...config, ...newConfig };
};

/**
 * Gets the current timestamp formatted for logs
 * @returns {string} - Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Writes a log message to a file
 * @param {string} level - Log level name
 * @param {string} message - Log message
 */
const writeToFile = (level, message) => {
  if (!config.logToFile) return;
  
  // In a browser environment, we can't directly write to files
  // We could send the logs to the server or use local storage
  // For this example, we'll just simulate file logging
  
  const logData = {
    timestamp: getTimestamp(),
    level,
    message
  };
  
  // Store logs in local storage as an alternative to file logging
  try {
    const logKey = `${config.filePrefix}-${new Date().toISOString().split('T')[0]}`;
    const existingLogs = JSON.parse(localStorage.getItem(logKey) || '[]');
    existingLogs.push(logData);
    localStorage.setItem(logKey, JSON.stringify(existingLogs));
  } catch (error) {
    console.error('Failed to write to local storage:', error);
  }
};

/**
 * Gets color for a log level (for console logs)
 * @param {string} level - Log level
 * @returns {string} - Color code
 */
const getLevelColor = (level) => {
  if (!config.useColors) return '';
  
  switch (level) {
    case 'DEBUG': return '\x1b[36m'; // Cyan
    case 'INFO': return '\x1b[32m';  // Green
    case 'WARN': return '\x1b[33m';  // Yellow
    case 'ERROR': return '\x1b[31m'; // Red
    default: return '';
  }
};

/**
 * Logs a message at the specified level
 * @param {number} level - Log level
 * @param {string} levelName - Name of the log level
 * @param {string} message - Log message
 * @param {any[]} args - Additional arguments
 */
const log = (level, levelName, message, ...args) => {
  // Skip if the log level is below the configured level
  if (level < config.level) return;
  
  // Format the message
  const timestamp = getTimestamp();
  const formattedMessage = `[${timestamp}] [${levelName}] ${message}`;
  
  // Log to console if enabled
  if (config.logToConsole) {
    const color = getLevelColor(levelName);
    const resetColor = config.useColors ? '\x1b[0m' : '';
    
    switch (levelName) {
      case 'ERROR':
        console.error(color + formattedMessage, ...args, resetColor);
        break;
      case 'WARN':
        console.warn(color + formattedMessage, ...args, resetColor);
        break;
      case 'INFO':
        console.info(color + formattedMessage, ...args, resetColor);
        break;
      default:
        console.log(color + formattedMessage, ...args, resetColor);
    }
  }
  
  // Write to file if enabled
  if (config.logToFile) {
    writeToFile(levelName, `${message} ${args.length ? JSON.stringify(args) : ''}`);
  }
};

// Public logger methods
export const logger = {
  debug: (message, ...args) => log(LOG_LEVELS.DEBUG, 'DEBUG', message, ...args),
  info: (message, ...args) => log(LOG_LEVELS.INFO, 'INFO', message, ...args),
  warn: (message, ...args) => log(LOG_LEVELS.WARN, 'WARN', message, ...args),
  error: (message, ...args) => log(LOG_LEVELS.ERROR, 'ERROR', message, ...args),
  
  /**
   * Set the current log level
   * @param {number} level - New log level
   */
  setLevel: (level) => {
    if (Object.values(LOG_LEVELS).includes(level)) {
      config.level = level;
    }
  },
  
  /**
   * Get the current log level
   * @returns {number} - Current log level
   */
  getLevel: () => config.level,
  
  /**
   * Enable or disable file logging
   * @param {boolean} enable - Whether to enable file logging
   */
  enableFileLogging: (enable = true) => {
    config.logToFile = enable;
  }
};

export default logger; 