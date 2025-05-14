/**
 * Authentication Service
 * Handles JWT token management and auth-related functionality
 */

// Get the stored token
export const getToken = () => localStorage.getItem('authToken');

// Get the current logged in user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  return getToken() !== null;
};

// Log out - clear stored auth data
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Get auth header for API requests
export const authHeader = () => {
  const token = getToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Make authenticated API requests
export const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    ...options.headers || {},
    ...authHeader(),
    'Content-Type': 'application/json'
  };

  const config = {
    ...options,
    headers
  };

  return fetch(url, config);
};