/**
 * PJAX Page Loader - Dynamic Page Loading Without Full Reload
 * Loads only the content section of pages, keeping sidebar and shared assets in place
 * 
 * Usage:
 *   PageLoader.loadPage('dashboard.html')
 *   PageLoader.loadPage('calendar.html')
 */

const PageLoader = {
  // Configuration
  contentSelector: '.content', // Selector for content area to replace
  mainSelector: 'main.main',   // Main content container
  isLoading: false,
  currentPage: window.location.pathname.split('/').pop() || 'dashboard.html',

  /**
   * Initialize page loader and set up navigation
   */
  init() {
    console.log('[PageLoader] Initializing...');
    
    // Setup navigation handlers
    this.setupNavigation();
    
    // Setup back/forward button support
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.loadPage(e.state.page, false);
      }
    });

    console.log('[PageLoader] ✓ Initialized');
  },

  /**
   * Setup click handlers for all navigation items
   */
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-link]');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const page = item.dataset.link;
        if (page) {
          this.loadPage(page);
        }
      });
    });

    console.log(`[PageLoader] ✓ Setup ${navItems.length} navigation handlers`);
  },

  /**
   * Load a page dynamically without full page reload
   * @param {string} page - Page filename (e.g., 'dashboard.html')
   * @param {boolean} pushState - Whether to push to browser history (default: true)
   */
  async loadPage(page, pushState = true) {
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      
      // Update active nav item
      this.updateActiveNav(page);
      
      console.log(`[PageLoader] Loading ${page}...`);
      
      // Fetch the page
      const response = await fetch(page);
      if (!response.ok) {
        throw new Error(`Failed to load ${page}: ${response.status}`);
      }

      const html = await response.text();
      
      // Parse the HTML to extract content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Get the new content
      const newContent = doc.querySelector(this.contentSelector);
      const newHeader = doc.querySelector('.header');
      
      if (!newContent) {
        throw new Error(`No content found in ${page}`);
      }

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Small delay for smooth visual transition
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Replace header and content
      const currentHeader = document.querySelector('.header');
      const currentContent = document.querySelector(this.contentSelector);
      
      if (currentHeader && newHeader) {
        currentHeader.innerHTML = newHeader.innerHTML;
      }
      
      if (currentContent) {
        currentContent.innerHTML = newContent.innerHTML;
      }

      // Re-initialize page-specific functionality
      this.reinitializePageScripts(html, page);
      
      // Update page reference
      this.currentPage = page;
      
      // Push to browser history
      if (pushState) {
        window.history.pushState(
          { page: page },
          document.title,
          this.getPagePath(page)
        );
      }

      // Update page title
      const newTitle = doc.title;
      document.title = newTitle;
      
      console.log(`[PageLoader] ✓ Loaded ${page}`);
      
    } catch (error) {
      console.error('[PageLoader] Error loading page:', error);
      alert(`Failed to load page: ${error.message}`);
    } finally {
      this.isLoading = false;
    }
  },

  /**
   * Update active navigation item
   */
  updateActiveNav(page) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to current page nav item
    const activeItem = document.querySelector(`[data-link="${page}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  },

  /**
   * Get proper file path (works on GitHub Pages and local)
   */
  getPagePath(filename) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/hospitality-dashboard/')) {
      return '/hospitality-dashboard/' + filename;
    }
    return filename;
  },

  /**
   * Re-initialize page-specific scripts after content load
   * This is crucial for making new content interactive
   */
  reinitializePageScripts(html, page) {
    try {
      // Extract and re-run inline scripts from the loaded page
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Get all script tags
      const scripts = doc.querySelectorAll('script');
      let scriptCount = 0;

      scripts.forEach(script => {
        // Skip external scripts (already loaded)
        if (script.src) return;
        
        // Execute inline scripts
        try {
          const code = script.textContent;
          if (code && code.trim()) {
            // Create new script element and execute
            const newScript = document.createElement('script');
            newScript.textContent = code;
            document.body.appendChild(newScript);
            document.body.removeChild(newScript);
            scriptCount++;
          }
        } catch (e) {
          console.warn('[PageLoader] Error executing inline script:', e);
        }
      });

      console.log(`[PageLoader] ✓ Re-initialized ${scriptCount} inline scripts`);

    } catch (error) {
      console.warn('[PageLoader] Error re-initializing scripts:', error);
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    PageLoader.init();
  });
} else {
  PageLoader.init();
}
