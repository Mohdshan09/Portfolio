// Marks a browser as the site owner's, so its visits never show up in analytics.
// Set automatically whenever you're logged in to /admin; toggle on the analytics page.
const KEY = 'analytics:owner';

export function isOwnerBrowser(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false; // storage blocked — can't tell, so count the visit
  }
}

export function setOwnerBrowser(owner: boolean) {
  try {
    if (owner) localStorage.setItem(KEY, '1');
    else localStorage.removeItem(KEY);
  } catch {
    // storage blocked — the server-side token check still skips logged-in visits
  }
}
