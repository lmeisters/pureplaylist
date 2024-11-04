function sanitizeCookieName(name: string): string {
  // Only allow alphanumeric characters and underscores
  return name.replace(/[^a-zA-Z0-9_]/g, '');
}

export const COOKIE_NAMES = {
  SIDEBAR_STATE: sanitizeCookieName('sidebar_state')
} as const;

export const COOKIE_CONFIG = {
  MAX_AGE: 60 * 60 * 24 * 7, // 7 days
  PATH: '/',
  SECURE: process.env.NODE_ENV === 'production',
  SAME_SITE: 'lax' as const
}; 