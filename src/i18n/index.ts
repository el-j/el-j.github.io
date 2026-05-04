import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import de from '../locales/de.json'

export const SUPPORTED_LOCALES = ['en', 'de'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_STORAGE_KEY = 'i18n-locale'

export function detectLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) return stored as SupportedLocale
  } catch { /* SecurityError in sandboxed contexts – ignore */ }
  try {
    const lang = (navigator.language || '').slice(0, 2).toLowerCase()
    if ((SUPPORTED_LOCALES as readonly string[]).includes(lang)) return lang as SupportedLocale
  } catch { /* ignore */ }
  return 'en'
}

export default createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, de },
})
