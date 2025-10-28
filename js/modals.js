/**
 * Modal Management Module
 * Consolidated modal functions used across dashboard, calendar, and AI agent pages
 * Handles modal opening/closing, confirmations, and event management
 */

// Track active modal event handlers
let activeModalCloseHandler = null;

/**
 * Opens a modal with the provided content
 * @param {HTMLElement|DocumentFragment} content - The content to display in the modal
 */
function openModal(content) {
  const backdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  
  if (!backdrop || !modalContent) {
    console.error('Modal elements not found');
    return;
  }
  
  // Remove previous modal event handler if still present
  if (activeModalCloseHandler) {
    document.removeEventListener('click', activeModalCloseHandler);
    activeModalCloseHandler = null;
  }
  
  // Clear old content
  modalContent.innerHTML = '';
  
  // Append new content
  if (content instanceof DocumentFragment || content instanceof HTMLElement) {
    modalContent.appendChild(content);
  } else {
    modalContent.innerHTML = content;
  }
  
  // Show modal
  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Apply translations if available (for dashboard multilingual support)
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
  
  // Attach cancel booking action if present (dashboard specific)
  const cancelBtn = document.getElementById('cancelBookingBtn');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      if (confirm('Cancel this booking?')) {
        showConfirmation('Booking cancelled (simulated)');
        closeModal();
      }
    };
  }
  
  // Attach backdrop click handler to close modal
  activeModalCloseHandler = (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  };
  document.addEventListener('click', activeModalCloseHandler);
}

/**
 * Closes the currently open modal
 */
function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  
  if (!backdrop || !modalContent) return;
  
  // Remove active event listeners
  if (activeModalCloseHandler) {
    document.removeEventListener('click', activeModalCloseHandler);
    activeModalCloseHandler = null;
  }
  
  // Clear content and hide modal
  modalContent.innerHTML = '';
  backdrop.classList.remove('show');
  document.body.style.overflow = '';
}

/**
 * Shows a confirmation/notification message
 * Creates a temporary modal-style notification that auto-dismisses
 * @param {string} message - The message to display
 */
function showConfirmation(message) {
  // Create backdrop
  const confBackdrop = document.createElement('div');
  confBackdrop.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.36);display:flex;align-items:center;justify-content:center;padding:20px;z-index:3000';
  
  // Create modal container
  const confModal = document.createElement('div');
  confModal.style.cssText = 'background:#fff;border-radius:16px;max-width:440px;width:100%;padding:30px;box-shadow:0 24px 48px rgba(15,23,41,0.18);text-align:center;animation:slideUp 0.3s ease';
  
  // Create message div
  const msgDiv = document.createElement('div');
  msgDiv.style.cssText = 'white-space:pre-wrap;color:#1f2937;font-size:14px;line-height:1.6;margin-bottom:20px';
  msgDiv.textContent = message;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'padding:10px 20px;border-radius:10px;border:none;background:var(--accent);color:#fff;cursor:pointer;font-weight:600;transition:filter 0.2s';
  closeBtn.textContent = 'OK';
  closeBtn.onmouseover = () => closeBtn.style.filter = 'brightness(0.92)';
  closeBtn.onmouseout = () => closeBtn.style.filter = 'brightness(1)';
  
  // Assemble and append
  confModal.appendChild(msgDiv);
  confModal.appendChild(closeBtn);
  confBackdrop.appendChild(confModal);
  document.body.appendChild(confBackdrop);
  
  // Close handlers
  const removeConfirmation = () => confBackdrop.remove();
  closeBtn.addEventListener('click', removeConfirmation);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') removeConfirmation();
  }, { once: true });
}

/**
 * Shows a slide-in notification (used in aiagent.html)
 * Alternative notification style that appears from the side
 * @param {string} message - The message to display
 */
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #0f172a;
    font-weight: 500;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `;
  
  notification.innerHTML = `
    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; flex-shrink: 0;"></div>
    <div style="flex: 1;">${message}</div>
    <i class="fa-solid fa-check" style="color: #10b981; font-size: 16px; flex-shrink: 0;"></i>
  `;
  
  // Add animation keyframes if not already added
  if (!document.getElementById('notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Export functions for use in HTML files
if (typeof window !== 'undefined') {
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.showConfirmation = showConfirmation;
  window.showNotification = showNotification;
}
