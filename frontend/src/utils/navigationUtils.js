// Navigation utilities for role-based redirection

/**
 * Get the appropriate dashboard route based on user role
 * @param {string} role - User role ('citizen', 'admin', 'official')
 * @returns {string} - Route path
 */
export const getDashboardRoute = (role) => {
  if (role === 'admin' || role === 'official') {
    return '/admin';
  }
  return '/citizen-dashboard';
};

/**
 * Navigate to the appropriate dashboard based on user role
 * @param {function} navigate - React Router navigate function
 * @param {Object} user - User object with role property
 */
export const navigateToDashboard = (navigate, user) => {
  const role = user?.role || 'citizen';
  const route = getDashboardRoute(role);
  navigate(route);
};

/**
 * Check if user has admin privileges
 * @param {Object} user - User object with role property
 * @returns {boolean} - True if user is admin or official
 */
export const isAdmin = (user) => {
  const role = user?.role;
  return role === 'admin' || role === 'official';
};

/**
 * Check if user is a regular citizen
 * @param {Object} user - User object with role property
 * @returns {boolean} - True if user is a citizen
 */
export const isCitizen = (user) => {
  const role = user?.role || 'citizen';
  return role === 'citizen';
};