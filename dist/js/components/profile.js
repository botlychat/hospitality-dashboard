/**
 * Profile Component
 * ====================
 * Manages profile menu toggle, user info display, and logout
 * Unified across all pages (dashboard, units, aiagent, contacts, website, index)
 * 
 * Usage:
 *   <div class="profile" id="profileBtn" tabindex="0">
 *     <div style="text-align:right;margin-right:8px;font-size:13px">
 *       <div style="font-weight:700" data-i18n="admin">Admin</div>
 *       <div style="font-size:12px;color:var(--muted)" id="userEmail">user@example.com</div>
 *     </div>
 *     <div class="avatar" id="userAvatar">A</div>
 *     <div class="profile-menu" id="profileMenu">
 *       <button data-action="settings"><i class="fa-solid fa-gear"></i><span data-i18n="settings">Settings</span></button>
 *       <button data-action="profile"><i class="fa-solid fa-user"></i><span data-i18n="profile">Profile</span></button>
 *       <div class="divider"></div>
 *       <button data-action="logout"><i class="fa-solid fa-sign-out-alt"></i><span data-i18n="logout">Logout</span></button>
 *     </div>
 *   </div>
 */

class ProfileComponent {
  constructor(config = {}) {
    this.profileBtn = document.getElementById('profileBtn');
    this.profileMenu = document.getElementById('profileMenu');
    this.userAvatar = document.getElementById('userAvatar');
    this.userEmail = document.getElementById('userEmail');
    
    this.config = {
      settingsPage: config.settingsPage || 'settings.html',
      profilePage: config.profilePage || 'profile.html',
      loginPage: config.loginPage || 'login.html',
      ...config
    };

    this.isOpen = false;
    this.init();
  }

  /**
   * Initialize component
   */
  init() {
    // Validate elements exist
    if (!this.profileBtn || !this.profileMenu) {
      console.warn('Profile component: Missing required elements (profileBtn or profileMenu)');
      return false;
    }

    // Setup event listeners
    this.setupEventListeners();
    
    // Load user data
    this.loadUserData();
    
    // Apply translations
    this.applyTranslations();

    console.log('✓ Profile component initialized');
    return true;
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Toggle menu on button click
    this.profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.profileBtn.contains(e.target) && !this.profileMenu.contains(e.target)) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Setup menu action buttons
    this.setupMenuActions();
  }

  /**
   * Setup menu action button handlers
   */
  setupMenuActions() {
    const buttons = this.profileMenu.querySelectorAll('button[data-action]');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleAction(btn.getAttribute('data-action'));
      });
    });
  }

  /**
   * Handle menu actions
   */
  handleAction(action) {
    this.close();
    
    switch (action) {
      case 'logout':
        this.logout();
        break;
      case 'settings':
        this.navigateToSettings();
        break;
      case 'profile':
        this.navigateToProfile();
        break;
      default:
        console.warn(`Unknown profile action: ${action}`);
    }
  }

  /**
   * Toggle menu open/close
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open menu
   */
  open() {
    this.profileMenu.classList.add('show');
    this.isOpen = true;
    this.profileBtn.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close menu
   */
  close() {
    this.profileMenu.classList.remove('show');
    this.isOpen = false;
    this.profileBtn.setAttribute('aria-expanded', 'false');
  }

  /**
   * Load user data from storage/session
   */
  loadUserData() {
    try {
      const user = getStorageItem('user');
      
      if (user) {
        // Update avatar with user initials
        const initials = this.getInitials(user.name || user.email);
        if (this.userAvatar) {
          this.userAvatar.textContent = initials;
        }

        // Update email display
        if (this.userEmail && user.email) {
          this.userEmail.textContent = user.email;
        }

        // Set user data in component
        this.userData = user;
      } else {
        console.warn('No user data found in storage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  /**
   * Extract initials from name or email
   */
  getInitials(nameOrEmail) {
    if (!nameOrEmail) return '?';
    
    // If it's an email, use first letter of name part
    if (nameOrEmail.includes('@')) {
      return nameOrEmail.charAt(0).toUpperCase();
    }

    // If it's a name, use first letters of first and last name
    const parts = nameOrEmail.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }

    return nameOrEmail.charAt(0).toUpperCase();
  }

  /**
   * Apply translations to menu items
   */
  applyTranslations() {
    const language = getStorageItem('language', 'en');
    const buttons = this.profileMenu.querySelectorAll('button');
    
    buttons.forEach(btn => {
      const i18nKey = btn.querySelector('[data-i18n]')?.getAttribute('data-i18n');
      if (i18nKey && window.t) {
        btn.querySelector('[data-i18n]').textContent = window.t(i18nKey, language);
      }
    });
  }

  /**
   * Logout user
   */
  logout() {
    const confirmMessage = window.t ? window.t('confirm_logout', getStorageItem('language', 'en')) : 'Are you sure you want to logout?';
    
    if (confirm(confirmMessage)) {
      try {
        // Clear stored data
        removeStorageItem('user');
        removeStorageItem('token');
        removeStorageItem('organization');
        removeStorageItem('unitGroup');

        // Show success message
        if (window.showConfirmation) {
          showConfirmation('Logged out successfully', 2000);
        }

        // Redirect to login
        setTimeout(() => {
          const loginPage = this.config.loginPage;
          window.location.href = getPagePath(loginPage);
        }, 500);
      } catch (error) {
        console.error('Logout error:', error);
        if (window.showError) {
          showError('Error logging out. Please try again.');
        }
      }
    }
  }

  /**
   * Navigate to settings page
   */
  navigateToSettings() {
    const settingsPage = this.config.settingsPage;
    navigateToPage(settingsPage);
  }

  /**
   * Navigate to profile page
   */
  navigateToProfile() {
    const profilePage = this.config.profilePage;
    navigateToPage(profilePage);
  }

  /**
   * Update profile display with new user data
   */
  updateUserData(userData) {
    this.userData = userData;
    this.loadUserData();
  }

  /**
   * Update user avatar
   */
  setAvatar(text) {
    if (this.userAvatar) {
      this.userAvatar.textContent = text;
    }
  }

  /**
   * Update user email display
   */
  setEmail(email) {
    if (this.userEmail) {
      this.userEmail.textContent = email;
    }
  }

  /**
   * Check if menu is open
   */
  isMenuOpen() {
    return this.isOpen;
  }
}

/**
 * Auto-initialize profile component on DOM ready
 */
function initializeProfileComponent() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.profileComponent = new ProfileComponent();
    });
  } else {
    window.profileComponent = new ProfileComponent();
  }
}

// Initialize when DOM is ready
initializeProfileComponent();

// Export for modular use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfileComponent;
}
