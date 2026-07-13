export const AUTH_STORAGE_KEY = "employee_auth";

/**
 * @returns {string[]} Permission names for the given auth payload.
 */
export function getUserPermissions(auth) {
  return auth?.user?.permissions || [];
}

/**
 * @param {string|undefined|null} permission
 * @param {Object|null|undefined} auth
 * @returns {boolean}
 */
export function hasPermission(permission, auth) {
  if (!permission) {
    return true;
  }

  const permissions = getUserPermissions(auth);

  if (permissions.includes(permission)) {
    return true;
  }

  if (permission.endsWith(".view")) {
    return permissions.includes(permission.replace(/\.view$/, ".read"));
  }

  if (permission.endsWith(".read")) {
    return permissions.includes(permission.replace(/\.read$/, ".view"));
  }

  return false;
}

/**
 * Read the persisted authentication payload from localStorage.
 *
 * @returns {Object|null}
 */
export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Persist the authentication payload returned by the API.
 *
 * @param {Object} auth
 */
export function setStoredAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

/**
 * Remove the persisted authentication payload.
 */
export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
