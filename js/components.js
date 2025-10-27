/**
 * Shared UI Components - Modals, Sheets, Forms
 * Reusable component handlers used across all pages
 */

// ============================================
// MODAL HANDLERS
// ============================================

/**
 * Get or create modal backdrop
 * @returns {HTMLElement} Modal backdrop element
 */
function getModalBackdrop() {
  let backdrop = document.getElementById('modalBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'modalBackdrop';
    backdrop.className = 'modal-backdrop';
    document.body.appendChild(backdrop);
  }
  return backdrop;
}

/**
 * Open modal with content
 * @param {string|HTMLElement} content - Modal content (HTML string or element)
 * @param {Object} options - Configuration options
 */
function openModal(content, options = {}) {
  const backdrop = getModalBackdrop();
  const modalContent = document.getElementById('modalContent');
  
  if (typeof content === 'string') {
    if (modalContent) modalContent.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    if (modalContent) modalContent.innerHTML = '';
    if (modalContent) modalContent.appendChild(content);
  }
  
  backdrop.classList.add('show');
  
  // Close on backdrop click if enabled
  if (options.closeOnBackdropClick !== false) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
}

/**
 * Close modal
 */
function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
  }
}

/**
 * Confirm dialog
 * @param {string} message - Confirmation message
 * @param {function} onConfirm - Callback when confirmed
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 */
function confirmDialog(message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel') {
  const html = `
    <h3 style="margin-top: 0">${message}</h3>
    <div class="modal-actions">
      <button class="btn ghost" onclick="closeModal()">${cancelText}</button>
      <button class="btn primary" id="confirmDialogBtn">${confirmText}</button>
    </div>
  `;
  
  openModal(html);
  
  const confirmBtn = document.getElementById('confirmDialogBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      closeModal();
    });
  }
}

// ============================================
// SHEET/OFF-CANVAS HANDLERS
// ============================================

/**
 * Get or create sheet backdrop
 * @returns {HTMLElement} Sheet backdrop element
 */
function getSheetBackdrop() {
  let backdrop = document.getElementById('sheetBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sheetBackdrop';
    backdrop.className = 'sheet-backdrop';
    document.body.appendChild(backdrop);
  }
  return backdrop;
}

/**
 * Open sheet (off-canvas form)
 * @param {string} title - Sheet title
 * @param {string|HTMLElement} content - Sheet content
 * @param {Object} options - Configuration options
 */
function openSheet(title, content, options = {}) {
  const backdrop = getSheetBackdrop();
  let sheet = backdrop.querySelector('.sheet');
  
  if (!sheet) {
    sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    backdrop.appendChild(sheet);
  }
  
  sheet.innerHTML = `
    <div class="sheet-header">
      <div>
        <h3 class="sheet-title">${title}</h3>
        ${options.subtitle ? `<div style="font-size:12px;color:var(--muted)">${options.subtitle}</div>` : ''}
      </div>
      <button class="close-btn" id="closeSheet" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;
  
  const contentDiv = document.createElement('div');
  if (typeof content === 'string') {
    contentDiv.innerHTML = content;
  } else {
    contentDiv.appendChild(content);
  }
  sheet.appendChild(contentDiv);
  
  backdrop.classList.add('show');
  
  // Close button handler
  const closeBtn = document.getElementById('closeSheet');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSheet);
  }
  
  // Close on backdrop click if enabled
  if (options.closeOnBackdropClick !== false) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeSheet();
    });
  }
}

/**
 * Close sheet
 */
function closeSheet() {
  const backdrop = document.getElementById('sheetBackdrop');
  if (backdrop) {
    backdrop.classList.remove('show');
  }
}

// ============================================
// FORM HELPERS
// ============================================

/**
 * Get form data as object
 * @param {string|HTMLElement} formSelector - Form selector or element
 * @returns {Object} Form data object
 */
function getFormData(formSelector) {
  const form = typeof formSelector === 'string' 
    ? document.querySelector(formSelector) 
    : formSelector;
  
  if (!form) return {};
  
  const formData = new FormData(form);
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }
  
  return data;
}

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {boolean} Whether all required fields are present
 */
function validateRequired(data, requiredFields) {
  return requiredFields.every(field => data[field] && data[field].toString().trim());
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (basic)
 * @param {string} phone - Phone to validate
 * @returns {boolean} Whether phone is valid
 */
function validatePhone(phone) {
  const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
}

/**
 * Set form data from object
 * @param {Object} data - Data object
 * @param {string|HTMLElement} formSelector - Form selector or element
 */
function setFormData(data, formSelector) {
  const form = typeof formSelector === 'string' 
    ? document.querySelector(formSelector) 
    : formSelector;
  
  if (!form) return;
  
  for (let [key, value] of Object.entries(data)) {
    const field = form.elements[key];
    if (!field) continue;
    
    if (field.type === 'checkbox') {
      field.checked = !!value;
    } else if (field.type === 'radio') {
      const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
      if (radio) radio.checked = true;
    } else {
      field.value = value;
    }
  }
}

/**
 * Reset form
 * @param {string|HTMLElement} formSelector - Form selector or element
 */
function resetForm(formSelector) {
  const form = typeof formSelector === 'string' 
    ? document.querySelector(formSelector) 
    : formSelector;
  
  if (form && form.reset) {
    form.reset();
  }
}

// ============================================
// PROFILE MENU HANDLER
// ============================================

/**
 * Setup profile menu
 */
function setupProfileMenu() {
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');
  
  if (!profileBtn || !profileMenu) return;
  
  // Toggle menu on button click
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('show');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile')) {
      profileMenu.classList.remove('show');
    }
  });
  
  // Setup logout
  const logoutBtn = profileMenu.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
    });
  }
}

/**
 * Logout user
 */
function logout() {
  // Clear user session
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentOrganization');
  // Redirect to login
  window.location.href = getPagePath('login.html');
}

// ============================================
// NAVIGATION HANDLER
// ============================================

/**
 * Setup navigation links
 */
function setupNavigation() {
  document.querySelectorAll('.nav-item[data-link]').forEach((navItem) => {
    navItem.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const link = navItem.dataset.link;
      if (link) {
        const fullPath = getPagePath(link);
        window.location.href = fullPath;
      }
    });
  });
}

/**
 * Setup data-section navigation (for index.html)
 */
function setupSectionNavigation() {
  document.querySelectorAll('.nav-item[data-section]').forEach((navItem) => {
    navItem.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const section = navItem.dataset.section;
      if (section) {
        switchSection(section);
      }
    });
  });
}

/**
 * Switch between sections in a page
 * @param {string} sectionName - Section name to show
 */
function switchSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.tab-section').forEach((section) => {
    section.classList.remove('active');
  });
  
  // Remove active class from nav items
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.remove('active');
  });
  
  // Show selected section
  const selectedSection = document.getElementById(sectionName + 'Tab') 
    || document.getElementById(sectionName);
  if (selectedSection) {
    selectedSection.classList.add('active');
  }
  
  // Mark nav item as active
  const activeNav = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
  if (activeNav) {
    activeNav.classList.add('active');
  }
  
  // Update header title
  const headerTitle = document.getElementById('headerTitle');
  if (headerTitle) {
    const titleKey = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    headerTitle.dataset.i18n = titleKey.toLowerCase();
    headerTitle.textContent = t(titleKey.toLowerCase());
  }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize shared components
 */
function initializeSharedComponents() {
  setupProfileMenu();
  setupNavigation();
  setupSectionNavigation();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSharedComponents);
} else {
  initializeSharedComponents();
}
