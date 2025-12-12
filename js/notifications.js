/**
 * Custom Notification System
 * Replaces default alert() and confirm() with styled notifications
 */

// Toast container initialization
function initToastContainer() {
    if (!document.getElementById('toastContainer')) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
function showToast(message, type = 'info', duration = 4000) {
    initToastContainer();
    
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon mapping
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    // Title mapping
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
            <div class="toast-title">${titles[type] || titles.info}</div>
            <div class="toast-message">${message}</div>
        </div>
        <span class="toast-close" onclick="closeToast(this)">×</span>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }
}

/**
 * Close a specific toast
 */
function closeToast(closeButton) {
    const toast = closeButton.closest('.toast');
    removeToast(toast);
}

/**
 * Remove toast with animation
 */
function removeToast(toast) {
    toast.classList.add('hiding');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

/**
 * Show a confirm dialog
 * @param {string} message - The confirmation message
 * @param {string} title - Dialog title (default: 'Confirm')
 * @param {function} onConfirm - Callback function when confirmed
 * @param {function} onCancel - Callback function when cancelled (optional)
 */
function showConfirm(message, title = 'Confirm', onConfirm, onCancel = null) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-dialog-overlay';
    
    overlay.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-dialog-header">
                <span class="confirm-dialog-icon">❓</span>
                <h3 class="confirm-dialog-title">${title}</h3>
            </div>
            <div class="confirm-dialog-body">
                <p class="confirm-dialog-message">${message}</p>
            </div>
            <div class="confirm-dialog-footer">
                <button class="btn-secondary" onclick="closeConfirmDialog(false)">Cancel</button>
                <button class="btn-primary" onclick="closeConfirmDialog(true)">Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Store callbacks
    window._currentConfirmCallbacks = {
        onConfirm: onConfirm,
        onCancel: onCancel
    };
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeConfirmDialog(false);
        }
    });
}

/**
 * Close confirm dialog
 */
window.closeConfirmDialog = function(confirmed) {
    const overlay = document.querySelector('.confirm-dialog-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
            overlay.remove();
            
            // Execute callbacks
            if (window._currentConfirmCallbacks) {
                if (confirmed && window._currentConfirmCallbacks.onConfirm) {
                    window._currentConfirmCallbacks.onConfirm();
                } else if (!confirmed && window._currentConfirmCallbacks.onCancel) {
                    window._currentConfirmCallbacks.onCancel();
                }
                window._currentConfirmCallbacks = null;
            }
        }, 200);
    }
};

/**
 * Custom alert replacement
 * @param {string} message - The message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
function customAlert(message, type = 'info') {
    showToast(message, type, 5000);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToastContainer);
} else {
    initToastContainer();
}
