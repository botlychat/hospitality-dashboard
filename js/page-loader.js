/**
 * PJAX Page Loader - DISABLED
 * Service Worker caching is sufficient for performance
 * Using native browser navigation instead
 */

const PageLoader = {
  init() {
    console.log('[PageLoader] ✓ Initialized (PJAX disabled - using browser navigation)');
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

