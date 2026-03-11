import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import de from '../locales/de.json'

/** Supported UI locales – single source of truth consumed by Navbar and the init logic. */
export const SUPPORTED_LOCALES = /** @type {const} */ (['en', 'de'])

/** localStorage key used to persist the user's language preference across reloads. */
export const LOCALE_STORAGE_KEY = 'i18n-locale'

/**
 * Detects the initial locale in the following priority order:
 *  1. Persisted user preference stored in localStorage
 *  2. Browser language (first two characters of navigator.language)
 *  3. Hard-coded default: 'en'
 *
 * All localStorage / navigator accesses are wrapped in try/catch so the
 * function is safe in sandboxed iframes and SSR-like test environments.
 *
 * @returns {string}
 */
export function detectLocale() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored
  } catch { /* SecurityError in sandboxed contexts – ignore */ }
  try {
    const lang = (navigator.language || '').slice(0, 2).toLowerCase()
    if (SUPPORTED_LOCALES.includes(lang)) return lang
  } catch { /* ignore */ }
  return 'en'
}

export default createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, de },
})
