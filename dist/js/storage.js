/**
 * Safe Storage Helper Module
 * Provides wrapper functions around localStorage with comprehensive error handling
 * Prevents app crashes from corrupted data, quota issues, and private browsing mode
 */

const Storage = {
  /**
   * Check if localStorage is available and accessible
   * @returns {boolean} True if localStorage is available
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('[Storage] localStorage not available:', error.message);
      return false;
    }
  },

  /**
   * Get JSON data from localStorage safely
   * @param {string} key - Storage key
   * @param {*} fallback - Fallback value if key doesn't exist or error occurs (default: {})
   * @returns {*} Parsed JSON value or fallback
   */
  getJSON(key, fallback = {}) {
    try {
      if (!key) {
        console.warn('[Storage] getJSON: key is required');
        return fallback;
      }

      const item = localStorage.getItem(key);
      if (item === null) {
        return fallback;
      }

      // Try to parse JSON
      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn(`[Storage] Invalid JSON for key "${key}":`, error.message);
        // Try to recover by removing corrupted data
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('[Storage] Could not remove corrupted data:', e.message);
        }
      } else {
        console.warn(`[Storage] Error reading key "${key}":`, error.message);
      }
      return fallback;
    }
  },

  /**
   * Set JSON data in localStorage safely
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @returns {boolean} True if successful, false otherwise
   */
  setJSON(key, value) {
    try {
      if (!key) {
        console.warn('[Storage] setJSON: key is required');
        return false;
      }

      const jsonString = JSON.stringify(value);
      localStorage.setItem(key, jsonString);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error(`[Storage] Quota exceeded: Cannot store "${key}" - storage is full`);
        console.error('[Storage] Try clearing old data or removing unnecessary items');
      } else if (error.name === 'SecurityError') {
        console.error('[Storage] Security error: localStorage may be disabled (private browsing?)');
      } else {
        console.error(`[Storage] Error writing key "${key}":`, error.message);
      }
      return false;
    }
  },

  /**
   * Get string data from localStorage safely
   * @param {string} key - Storage key
   * @param {string} fallback - Fallback value if key doesn't exist (default: '')
   * @returns {string} String value or fallback
   */
  get(key, fallback = '') {
    try {
      if (!key) {
        console.warn('[Storage] getString: key is required');
        return fallback;
      }

      const item = localStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch (error) {
      console.warn(`[Storage] Error reading key "${key}":`, error.message);
      return fallback;
    }
  },

  /**
   * Set string data in localStorage safely
   * @param {string} key - Storage key
   * @param {string} value - String value to store
   * @returns {boolean} True if successful, false otherwise
   */
  set(key, value) {
    try {
      if (!key) {
        console.warn('[Storage] setString: key is required');
        return false;
      }

      // Convert to string if not already
      const stringValue = typeof value === 'string' ? value : String(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error(`[Storage] Quota exceeded: Cannot store "${key}" - storage is full`);
      } else if (error.name === 'SecurityError') {
        console.error('[Storage] Security error: localStorage may be disabled');
      } else {
        console.error(`[Storage] Error writing key "${key}":`, error.message);
      }
      return false;
    }
  },

  /**
   * Get number data from localStorage safely
   * @param {string} key - Storage key
   * @param {number} fallback - Fallback value if key doesn't exist (default: 0)
   * @returns {number} Parsed number or fallback
   */
  getNumber(key, fallback = 0) {
    try {
      if (!key) {
        console.warn('[Storage] getNumber: key is required');
        return fallback;
      }

      const item = localStorage.getItem(key);
      if (item === null) {
        return fallback;
      }

      const parsed = parseFloat(item);
      return isNaN(parsed) ? fallback : parsed;
    } catch (error) {
      console.warn(`[Storage] Error reading number key "${key}":`, error.message);
      return fallback;
    }
  },

  /**
   * Set number data in localStorage safely
   * @param {string} key - Storage key
   * @param {number} value - Number value to store
   * @returns {boolean} True if successful, false otherwise
   */
  setNumber(key, value) {
    try {
      if (!key) {
        console.warn('[Storage] setNumber: key is required');
        return false;
      }

      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        console.warn(`[Storage] Invalid number value for key "${key}":`, value);
        return false;
      }

      localStorage.setItem(key, String(numValue));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error(`[Storage] Quota exceeded: Cannot store "${key}"`);
      } else {
        console.error(`[Storage] Error writing key "${key}":`, error.message);
      }
      return false;
    }
  },

  /**
   * Check if a key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean} True if key exists
   */
  hasKey(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.warn(`[Storage] Error checking key "${key}":`, error.message);
      return false;
    }
  },

  /**
   * Remove a key from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} True if successful or key didn't exist
   */
  remove(key) {
    try {
      if (!key) {
        console.warn('[Storage] remove: key is required');
        return false;
      }

      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[Storage] Error removing key "${key}":`, error.message);
      return false;
    }
  },

  /**
   * Remove multiple keys from localStorage
   * @param {string[]} keys - Array of storage keys
   * @returns {boolean} True if all were removed successfully
   */
  removeMultiple(keys) {
    try {
      if (!Array.isArray(keys)) {
        console.warn('[Storage] removeMultiple: keys must be an array');
        return false;
      }

      let allSuccessful = true;
      keys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`[Storage] Could not remove key "${key}":`, error.message);
          allSuccessful = false;
        }
      });

      return allSuccessful;
    } catch (error) {
      console.error('[Storage] Error removing multiple keys:', error.message);
      return false;
    }
  },

  /**
   * Clear all data from localStorage
   * @returns {boolean} True if successful
   */
  clear() {
    try {
      localStorage.clear();
      console.log('[Storage] All data cleared');
      return true;
    } catch (error) {
      console.error('[Storage] Error clearing all data:', error.message);
      return false;
    }
  },

  /**
   * Get all keys from localStorage
   * @returns {string[]} Array of all storage keys
   */
  getAllKeys() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      return keys;
    } catch (error) {
      console.warn('[Storage] Error retrieving all keys:', error.message);
      return [];
    }
  },

  /**
   * Get storage size info (approximate)
   * @returns {object} Object with approximateSize (in bytes) and itemCount
   */
  getSizeInfo() {
    try {
      let totalSize = 0;
      const keys = this.getAllKeys();
      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += key.length + item.length;
        }
      });
      return {
        approximateSize: totalSize,
        approximateSizeKB: (totalSize / 1024).toFixed(2),
        itemCount: keys.length,
        keys: keys
      };
    } catch (error) {
      console.warn('[Storage] Error calculating size:', error.message);
      return { approximateSize: 0, approximateSizeKB: '0', itemCount: 0, keys: [] };
    }
  },

  /**
   * Export all storage data as JSON (useful for debugging/backup)
   * @returns {object} Object containing all stored data
   */
  exportAll() {
    try {
      const data = {};
      const keys = this.getAllKeys();
      keys.forEach(key => {
        data[key] = this.getJSON(key, localStorage.getItem(key));
      });
      return data;
    } catch (error) {
      console.error('[Storage] Error exporting all data:', error.message);
      return {};
    }
  },

  /**
   * Import data into localStorage (useful for restoring backups)
   * @param {object} data - Object with key-value pairs to import
   * @param {boolean} merge - If true, merge with existing data; if false, clear first
   * @returns {boolean} True if all imports were successful
   */
  importData(data, merge = true) {
    try {
      if (!data || typeof data !== 'object') {
        console.warn('[Storage] importData: data must be an object');
        return false;
      }

      if (!merge) {
        this.clear();
      }

      let allSuccessful = true;
      Object.entries(data).forEach(([key, value]) => {
        try {
          if (typeof value === 'object') {
            this.setJSON(key, value);
          } else {
            this.setString(key, value);
          }
        } catch (error) {
          console.warn(`[Storage] Could not import key "${key}":`, error.message);
          allSuccessful = false;
        }
      });

      return allSuccessful;
    } catch (error) {
      console.error('[Storage] Error importing data:', error.message);
      return false;
    }
  },

  /**
   * Get value and automatically update it with a TTL (time-to-live)
   * @param {string} key - Storage key
   * @param {number} ttlSeconds - Time to live in seconds
   * @param {*} fallback - Fallback value
   * @returns {*} Stored value or fallback if expired
   */
  getWithTTL(key, ttlSeconds = 3600, fallback = null) {
    try {
      const wrapper = this.getJSON(`${key}__ttl`, null);
      if (!wrapper) {
        return fallback;
      }

      const now = Date.now();
      const elapsed = (now - wrapper.timestamp) / 1000;

      if (elapsed > ttlSeconds) {
        this.remove(key);
        this.remove(`${key}__ttl`);
        return fallback;
      }

      return wrapper.value;
    } catch (error) {
      console.warn(`[Storage] Error getting TTL value for "${key}":`, error.message);
      return fallback;
    }
  },

  /**
   * Set value with TTL (time-to-live)
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {number} ttlSeconds - Time to live in seconds
   * @returns {boolean} True if successful
   */
  setWithTTL(key, value, ttlSeconds = 3600) {
    try {
      const wrapper = {
        value: value,
        timestamp: Date.now()
      };
      return this.setJSON(`${key}__ttl`, wrapper);
    } catch (error) {
      console.error(`[Storage] Error setting TTL value for "${key}":`, error.message);
      return false;
    }
  }
};

// Make Storage available globally if in browser environment
if (typeof window !== 'undefined') {
  window.Storage = Storage;
}
