/**
 * Shared Utilities - Navigation, Path Helpers, Storage
 * Used across all pages
 */

// ============================================
// PATH & ROUTING HELPERS
// ============================================

/**
 * Get the proper file path (works on GitHub Pages and local)
 * @param {string} filename - The filename to navigate to
 * @returns {string} The full path to the file
 */
function getPagePath(filename) {
  const currentPath = window.location.pathname;
  // Check if we're on GitHub Pages (path contains /chaletdashboard/)
  if (currentPath.includes('/chaletdashboard/')) {
    return '/chaletdashboard/' + filename;
  }
  // Otherwise use relative path (local development)
  return filename;
}

/**
 * Navigate to a page
 * @param {string} page - The page filename to navigate to
 */
function navigateToPage(page) {
  const fullPath = getPagePath(page);
  window.location.href = fullPath;
}

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Get value from localStorage with JSON parsing
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Parsed value from localStorage
 */
function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set value in localStorage with JSON stringification
 * @param {string} key - The localStorage key
 * @param {*} value - The value to store
 */
function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing value for key "${key}":`, error);
  }
}

/**
 * Remove a value from localStorage
 * @param {string} key - The localStorage key to remove
 */
function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all localStorage (use with caution)
 */
function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// ============================================
// TRANSLATION HELPERS
// ============================================

/**
 * Load translation dictionary
 * @returns {object} Translation dictionary object
 */
function loadTranslations() {
  return {
    en: {
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      units: 'Units',
      website: 'Website Settings',
      aiagent: 'AI Agent',
      contacts: 'Contacts',
      completeProfile: 'Complete Profile',
      changePassword: 'Change Password',
      changeEmail: 'Change Email',
      logout: 'Logout',
      admin: 'Admin',
      refresh: 'Refresh',
      newManualBooking: 'New Manual Booking',
      overview: 'Overview',
      summaryToday: 'Summary for today',
      occupancyRate: 'Occupancy Rate',
      currentOccupancy: 'Current occupancy (units)',
      monthlyRevenue: 'Monthly Revenue',
      estimatedMonth: 'Estimated this month',
      recentBookings: 'Recent Bookings',
      client: 'Client',
      unit: 'Unit',
      dates: 'Dates',
      status: 'Status',
      todayUnitStatus: 'Today\'s Unit Status',
      weeklyOccupancyRate: 'Weekly Occupancy Rate',
      daysBooked: 'Days Booked',
      weeklyIncome: 'Weekly Income',
      income: 'Income',
      bookings: 'Bookings',
      quickActions: 'Quick Actions',
      openCalendar: 'Open Calendar',
      websiteSettings: 'Website Settings',
      manageUnits: 'Manage Units',
      search: 'Search',
      searchPlaceholder: 'Search bookings, units, clients...'
    },
    ar: {
      dashboard: 'لوحة التحكم',
      calendar: 'التقويم',
      units: 'الوحدات',
      website: 'إعدادات الموقع',
      aiagent: 'وكيل الذكاء الاصطناعي',
      contacts: 'جهات الاتصال',
      completeProfile: 'إكمال الملف الشخصي',
      changePassword: 'تغيير كلمة المرور',
      changeEmail: 'تغيير عنوان البريد الإلكتروني',
      logout: 'تسجيل الخروج',
      admin: 'مسؤول',
      refresh: 'تحديث',
      newManualBooking: 'حجز يدوي جديد',
      overview: 'نظرة عامة',
      summaryToday: 'ملخص اليوم',
      occupancyRate: 'معدل الإشغال',
      currentOccupancy: 'الإشغال الحالي (الوحدات)',
      monthlyRevenue: 'الإيرادات الشهرية',
      estimatedMonth: 'المتوقع هذا الشهر',
      recentBookings: 'الحجوزات الأخيرة',
      client: 'العميل',
      unit: 'الوحدة',
      dates: 'التواريخ',
      status: 'الحالة',
      todayUnitStatus: 'حالة الوحدات اليوم',
      weeklyOccupancyRate: 'معدل الإشغال الأسبوعي',
      daysBooked: 'الأيام المحجوزة',
      weeklyIncome: 'الدخل الأسبوعي',
      income: 'الدخل',
      bookings: 'الحجوزات',
      quickActions: 'إجراءات سريعة',
      openCalendar: 'فتح التقويم',
      websiteSettings: 'إعدادات الموقع',
      manageUnits: 'إدارة الوحدات',
      search: 'بحث',
      searchPlaceholder: 'ابحث عن الحجوزات والوحدات والعملاء...'
    }
  };
}

/**
 * Get translated string
 * @param {string} key - Translation key
 * @param {string} language - Language code (en/ar)
 * @returns {string} Translated string
 */
function t(key, language = 'en') {
  const translations = loadTranslations();
  const translated = translations[language]?.[key] || translations.en[key];
  if (translated) return translated;
  // Fallback: convert camelCase to title case
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase()).trim();
}

/**
 * Apply translations to DOM
 * @param {string} language - Language code (en/ar)
 */
function applyTranslations(language = 'en') {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const text = t(key, language);
    if (el.tagName === 'INPUT' && el.type === 'placeholder') {
      el.placeholder = text;
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = text;
    } else {
      el.textContent = text;
    }
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder, language);
  });
}

/**
 * Set language and apply to page
 * @param {string} language - Language code (en/ar)
 */
function setLanguage(language) {
  localStorage.setItem('language', language);
  window.currentLanguage = language; // Update global variable
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  applyTranslations(language);
  updateLanguageButtons(language);
  
  // Update the toggle button text if it exists
  const langText = document.getElementById('langText');
  if (langText) {
    langText.textContent = language === 'en' ? 'العربية' : 'English';
  }
}

/**
 * Update language button styles
 * @param {string} currentLanguage - Current language code
 */
function updateLanguageButtons(currentLanguage) {
  const enBtn = document.getElementById('langEnglish');
  const arBtn = document.getElementById('langArabic');
  if (!enBtn || !arBtn) return;
  
  if (currentLanguage === 'en') {
    enBtn.style.color = '#f97316';
    enBtn.style.fontWeight = '600';
    arBtn.style.color = '#64748b';
    arBtn.style.fontWeight = 'normal';
  } else {
    arBtn.style.color = '#f97316';
    arBtn.style.fontWeight = '600';
    enBtn.style.color = '#64748b';
    enBtn.style.fontWeight = 'normal';
  }
}

// ============================================
// CURRENCY HELPERS
// ============================================

/**
 * Get current currency
 * @returns {string} Currency code (USD/SAR/EUR)
 */
function getCurrentCurrency() {
  return localStorage.getItem('currency') || 'SAR';
}

/**
 * Set currency
 * @param {string} currency - Currency code (USD/SAR/EUR)
 */
function setCurrency(currency) {
  localStorage.setItem('currency', currency);
  updateCurrencyButtons(currency);
}

/**
 * Update currency button styles
 * @param {string} currentCurrency - Current currency code
 */
function updateCurrencyButtons(currentCurrency) {
  const usdBtn = document.getElementById('currencyUSD');
  const sarBtn = document.getElementById('currencySAR');
  const eurBtn = document.getElementById('currencyEUR');
  
  [usdBtn, sarBtn, eurBtn].forEach((btn) => {
    if (!btn) return;
    btn.style.color = '#64748b';
    btn.style.fontWeight = 'normal';
  });
  
  if (currentCurrency === 'USD' && usdBtn) {
    usdBtn.style.color = '#f97316';
    usdBtn.style.fontWeight = '600';
  } else if (currentCurrency === 'SAR' && sarBtn) {
    sarBtn.style.color = '#f97316';
    sarBtn.style.fontWeight = '600';
  } else if (currentCurrency === 'EUR' && eurBtn) {
    eurBtn.style.color = '#f97316';
    eurBtn.style.fontWeight = '600';
  }
}

// ============================================
// DOM MANIPULATION HELPERS
// ============================================

/**
 * Show/hide element
 * @param {string|HTMLElement} selector - Element or selector
 * @param {boolean} show - Whether to show element
 */
function toggleElement(selector, show) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) el.style.display = show ? '' : 'none';
}

/**
 * Add/remove class from element
 * @param {string|HTMLElement} selector - Element or selector
 * @param {string} className - Class name
 * @param {boolean} add - Whether to add or remove
 */
function toggleClass(selector, className, add) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    if (add) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  }
}

/**
 * Show confirmation message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default 3000)
 */
function showConfirmation(message, duration = 3000) {
  const confirmation = document.createElement('div');
  confirmation.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, rgba(22, 163, 74, 0.9), rgba(34, 197, 94, 0.9));
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-weight: 600;
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  confirmation.textContent = message;
  document.body.appendChild(confirmation);
  
  setTimeout(() => {
    confirmation.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => confirmation.remove(), 300);
  }, duration);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 * @param {number} duration - Duration in ms (default 3000)
 */
function showError(message, duration = 3000) {
  const error = document.createElement('div');
  error.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-weight: 600;
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  error.textContent = message;
  document.body.appendChild(error);
  
  setTimeout(() => {
    error.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => error.remove(), 300);
  }, duration);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize shared utilities on page load
 */
function initializeSharedUtilities() {
  // Set initial language
  const currentLanguage = localStorage.getItem('language') || 'en';
  window.currentLanguage = currentLanguage; // Set global variable
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  applyTranslations(currentLanguage);
  updateLanguageButtons(currentLanguage);
  
  // Set initial currency
  const currentCurrency = localStorage.getItem('currency') || 'SAR';
  updateCurrencyButtons(currentCurrency);
  
  // Setup language switchers
  const langEnBtn = document.getElementById('langEnglish');
  const langArBtn = document.getElementById('langArabic');
  if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
  if (langArBtn) langArBtn.addEventListener('click', () => setLanguage('ar'));
  
  // Setup universal language toggle button (single button that switches between languages)
  const langToggle = document.getElementById('langToggle');
  const langText = document.getElementById('langText');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = currentLanguage === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
      // Update the toggle button text
      if (langText) {
        langText.textContent = newLang === 'en' ? 'العربية' : 'English';
      }
    });
    // Set initial button text based on current language
    if (langText) {
      langText.textContent = currentLanguage === 'en' ? 'العربية' : 'English';
    }
  }
  
  // Setup currency switchers
  const currencyUSD = document.getElementById('currencyUSD');
  const currencySAR = document.getElementById('currencySAR');
  const currencyEUR = document.getElementById('currencyEUR');
  if (currencyUSD) currencyUSD.addEventListener('click', () => setCurrency('USD'));
  if (currencySAR) currencySAR.addEventListener('click', () => setCurrency('SAR'));
  if (currencyEUR) currencyEUR.addEventListener('click', () => setCurrency('EUR'));
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSharedUtilities);
} else {
  initializeSharedUtilities();
}
