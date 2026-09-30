const TOKEN_KEY = "tanu_admin_access_token";

export function getAdminToken() {
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.sessionStorage.removeItem(TOKEN_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}
