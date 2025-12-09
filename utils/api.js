export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('minisocial_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) { localStorage.setItem('minisocial_user', JSON.stringify(user)); }

export function logout() { localStorage.removeItem('minisocial_user'); }
