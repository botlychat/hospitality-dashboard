/**
 * Error Handler & Storage Manager
 * Phase 2 - Task 2: Crash prevention through safe storage operations
 * Wraps localStorage operations to prevent crashes from quota exceeded, disabled storage, etc.
 */

const ErrorHandler = {
  /**
   * Storage wrapper with error handling
   */
  Storage: {
    /**
     * Safely sets an item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
     * @returns {boolean} True if successful, false otherwise
     */
    set: function(key, value) {
      try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
        return true;
      } catch (e) {
        console.error('Storage set error:', e);
        
        if (e.name === 'QuotaExceededError') {
          // Storage quota exceeded
          if (window.showConfirmation) {
            showConfirmation('Storage is full. Please clear old data or free up space.');
          } else {
            alert('Storage is full. Please clear old data.');
          }
        } else if (e.name === 'SecurityError') {
          // Storage disabled (privacy mode)
          if (window.showConfirmation) {
            showConfirmation('Storage is disabled. Please enable cookies/storage in your browser.');
          } else {
            alert('Storage is disabled. Please enable storage in browser settings.');
          }
        } else {
          // Other errors
          if (window.showConfirmation) {
            showConfirmation('Unable to save data. Please try again.');
          }
        }
        
        return false;
      }
    },

    /**
     * Safely gets an item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist or error occurs
     * @returns {*} Retrieved value or default value
     */
    get: function(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        
        // Try to parse as JSON, if fails return as string
        try {
          return JSON.parse(item);
        } catch (parseError) {
          // Not JSON, return as string
          return item;
        }
      } catch (e) {
        console.error('Storage get error:', e);
        return defaultValue;
      }
    },

    /**
     * Safely removes an item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if successful
     */
    remove: function(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('Storage remove error:', e);
        return false;
      }
    },

    /**
     * Safely clears all localStorage
     * @returns {boolean} True if successful
     */
    clear: function() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.error('Storage clear error:', e);
        return false;
      }
    },

    /**
     * Checks if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    isAvailable: function() {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Gets storage usage information
     * @returns {Object} { used: number, available: number, percentage: number }
     */
    getUsage: function() {
      if (!this.isAvailable()) {
        return { used: 0, available: 0, percentage: 0 };
      }

      try {
        let used = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            used += localStorage[key].length + key.length;
          }
        }

        // Most browsers have 5-10MB limit, we'll assume 5MB
        const available = 5 * 1024 * 1024; // 5MB in bytes
        const percentage = (used / available) * 100;

        return {
          used: used,
          available: available,
          percentage: Math.min(percentage, 100)
        };
      } catch (e) {
        console.error('Storage usage error:', e);
        return { used: 0, available: 0, percentage: 0 };
      }
    }
  },

  /**
   * DOM operation error handler
   * @param {Function} operation - DOM operation to execute
   * @param {string} errorMessage - Custom error message
   * @returns {*} Result of operation or null on error
   */
  safeDOMOperation: function(operation, errorMessage = 'DOM operation failed') {
    try {
      return operation();
    } catch (e) {
      console.error(errorMessage, e);
      return null;
    }
  },

  /**
   * Async operation error handler (for fetch, promises, etc.)
   * @param {Promise} promise - Promise to handle
   * @param {string} errorMessage - Custom error message
   * @returns {Promise} Promise that resolves to [error, result]
   */
  async safeAsync(promise, errorMessage = 'Async operation failed') {
    try {
      const result = await promise;
      return [null, result];
    } catch (error) {
      console.error(errorMessage, error);
      
      // Show user-friendly error
      if (window.showConfirmation) {
        if (error.message && error.message.includes('fetch')) {
          showConfirmation('Network error. Please check your connection and try again.');
        } else {
          showConfirmation('An error occurred. Please try again.');
        }
      }
      
      return [error, null];
    }
  },

  /**
   * JSON parse with error handling
   * @param {string} jsonString - JSON string to parse
   * @param {*} defaultValue - Default value on error
   * @returns {*} Parsed object or default value
   */
  safeJSONParse: function(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('JSON parse error:', e);
      return defaultValue;
    }
  },

  /**
   * JSON stringify with error handling
   * @param {*} object - Object to stringify
   * @param {string} defaultValue - Default value on error
   * @returns {string} JSON string or default value
   */
  safeJSONStringify: function(object, defaultValue = '{}') {
    try {
      return JSON.stringify(object);
    } catch (e) {
      console.error('JSON stringify error:', e);
      return defaultValue;
    }
  }
};

// Export to window object for global access
window.ErrorHandler = ErrorHandler;
window.Storage = ErrorHandler.Storage;
