/**
 * Validation Framework
 * Centralized validation logic for all forms across the application
 * Phase 2 - Task 1: Consolidates ~300 lines of duplicate validation code
 */

const Validator = {
  /**
   * Validates email format
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid email format
   */
  isEmail: function(email) {
    if (!email || typeof email !== 'string') return false;
    // RFC 5322 compliant email regex (simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Validates phone number format
   * @param {string} phone - Phone number to validate
   * @param {string} countryCode - Country code (default: +966 for Saudi Arabia)
   * @returns {boolean} True if valid phone format
   */
  isPhone: function(phone, countryCode = '+966') {
    if (!phone || typeof phone !== 'string') return false;
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Valid phone: 9-15 digits
    return cleaned.length >= 9 && cleaned.length <= 15;
  },

  /**
   * Validates required field (not empty)
   * @param {*} value - Value to validate
   * @returns {boolean} True if value exists and is not empty
   */
  isRequired: function(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value);
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  /**
   * Validates date range (end date must be after start date)
   * @param {string|Date} start - Start date
   * @param {string|Date} end - End date
   * @returns {boolean} True if end date is after start date
   */
  isDateRange: function(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }
    
    return endDate > startDate;
  },

  /**
   * Validates hex color format
   * @param {string} color - Hex color string (e.g., #FF5733)
   * @returns {boolean} True if valid hex color
   */
  isHexColor: function(color) {
    if (!color || typeof color !== 'string') return false;
    const hexRegex = /^#[0-9A-F]{6}$/i;
    return hexRegex.test(color);
  },

  /**
   * Validates number is within range
   * @param {number} value - Number to validate
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {boolean} True if value is within range
   */
  isInRange: function(value, min, max) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
  },

  /**
   * Validates positive number
   * @param {number} value - Number to validate
   * @returns {boolean} True if value is positive number
   */
  isPositiveNumber: function(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  },

  /**
   * Validates multiple required fields at once
   * @param {Object} fields - Object with field names as keys and values to validate
   * @returns {Object} { valid: boolean, missing: string[] }
   */
  validateRequiredFields: function(fields) {
    const missing = [];
    
    for (const [fieldName, value] of Object.entries(fields)) {
      if (!this.isRequired(value)) {
        missing.push(fieldName);
      }
    }
    
    return {
      valid: missing.length === 0,
      missing: missing
    };
  },

  /**
   * Validates booking form data
   * @param {Object} bookingData - Booking data to validate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateBooking: function(bookingData) {
    const errors = [];
    
    // Required fields
    const requiredFields = {
      'Name': bookingData.name,
      'Phone': bookingData.phone,
      'Unit': bookingData.unit,
      'Start Date': bookingData.start,
      'End Date': bookingData.end,
      'Rate': bookingData.rate
    };
    
    const requiredCheck = this.validateRequiredFields(requiredFields);
    if (!requiredCheck.valid) {
      errors.push(`Please fill in all required fields: ${requiredCheck.missing.join(', ')}`);
    }
    
    // Email validation (if provided)
    if (bookingData.email && !this.isEmail(bookingData.email)) {
      errors.push('Invalid email format');
    }
    
    // Phone validation
    if (bookingData.phone && !this.isPhone(bookingData.phone)) {
      errors.push('Invalid phone number format');
    }
    
    // Date range validation
    if (bookingData.start && bookingData.end && !this.isDateRange(bookingData.start, bookingData.end)) {
      errors.push('End date must be after start date');
    }
    
    // Rate validation
    if (bookingData.rate && !this.isPositiveNumber(bookingData.rate)) {
      errors.push('Rate must be a positive number');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Validates unit form data
   * @param {Object} unitData - Unit data to validate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateUnit: function(unitData) {
    const errors = [];
    
    // Required fields
    const requiredFields = {
      'Name': unitData.name,
      'Type': unitData.type,
      'Max Guests': unitData.maxGuests,
      'Nightly Rate': unitData.nightlyRate
    };
    
    const requiredCheck = this.validateRequiredFields(requiredFields);
    if (!requiredCheck.valid) {
      errors.push(`Please fill in all required fields: ${requiredCheck.missing.join(', ')}`);
    }
    
    // Validate max guests
    if (unitData.maxGuests && !this.isPositiveNumber(unitData.maxGuests)) {
      errors.push('Max guests must be a positive number');
    }
    
    // Validate nightly rate
    if (unitData.nightlyRate && !this.isPositiveNumber(unitData.nightlyRate)) {
      errors.push('Nightly rate must be a positive number');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Validates contact form data
   * @param {Object} contactData - Contact data to validate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateContact: function(contactData) {
    const errors = [];
    
    // Required fields
    if (!this.isRequired(contactData.name)) {
      errors.push('Name is required');
    }
    
    // Email validation
    if (contactData.email && !this.isEmail(contactData.email)) {
      errors.push('Invalid email format');
    }
    
    // Phone validation
    if (contactData.phone && !this.isPhone(contactData.phone)) {
      errors.push('Invalid phone number format');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
};

// Export to window object for global access
window.Validator = Validator;
