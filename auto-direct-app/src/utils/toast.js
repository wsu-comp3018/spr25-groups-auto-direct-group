// Toast utility functions for beautiful notifications
let toastContainer = null;

// Create toast container if it doesn't exist
function createToastContainer() {
  if (toastContainer) return toastContainer;
  
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'fixed top-20 right-4 z-50 w-96 max-w-full space-y-3';
  document.body.appendChild(toastContainer);
  
  return toastContainer;
}

// Generate unique IDs for toasts
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Create individual toast element
function createToastElement(message, type, duration) {
  const toast = document.createElement('div');
  const toastId = generateId();
  
  // Base classes
  const baseClasses = 'flex items-center justify-between p-4 rounded-lg shadow-lg border transform transition-all duration-300 ease-in-out';
  
  // Type-specific styles
  const typeStyles = {
    success: 'bg-white border-black text-black shadow-lg',
    error: 'bg-black border-gray-800 text-white shadow-lg',
    warning: 'bg-gray-100 border-gray-400 text-gray-800 shadow-lg',
    info: 'bg-blue-50 border-blue-700 text-blue-800 shadow-lg'
  };
  
  // Icons
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.className = `${baseClasses} ${typeStyles[type]} animate-slide-in`;
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <span class="text-lg">${icons[type]}</span>
      <span class="text-sm font-medium">${message}</span>
    </div>
    <button class="ml-4 hover:opacity-70 transition-opacity text-lg font-bold" onclick="removeToast('${toastId}')">
      ×
    </button>
  `;
  
  toast.id = toastId;
  
  // Auto-remove after duration
  setTimeout(() => {
    removeToast(toastId);
  }, duration);
  
  return toast;
}

// Remove toast
function removeToast(toastId) {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
}

// Make removeToast globally available
window.removeToast = removeToast;

// Main toast function
function showToast(message, type = 'info', duration = 5000) {
  const container = createToastContainer();
  const toast = createToastElement(message, type, duration);
  
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 10);
}

// Convenience methods
export const toast = {
  success: (message, duration = 5000) => showToast(message, 'success', duration),
  error: (message, duration = 6000) => showToast(message, 'error', duration),
  warning: (message, duration = 5000) => showToast(message, 'warning', duration),
  info: (message, duration = 4000) => showToast(message, 'info', duration)
};

// Make toast globally available
window.toast = toast;

export default toast;