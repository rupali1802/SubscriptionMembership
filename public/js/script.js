// ── Auth helpers ──────────────────────────────────────────
function requireAuth() {
  if (!localStorage.getItem('token')) window.location.href = '/';
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = '/';
}

// Fetch wrapper that attaches JWT
async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    }
  });
}

// ── Toast notifications ───────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✓', error: '✕', warn: '⚠' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
