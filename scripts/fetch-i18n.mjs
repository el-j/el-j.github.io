#!/usr/bin/env node
/**
 * scripts/fetch-i18n.js
 *
 * Build-time i18n fetch script.
 * Uses @el-j/google-sheet-translations to pull translations from a Google
 * Spreadsheet and write per-locale JSON files to src/locales/.
 *
 * Required environment variables:
 *   GOOGLE_CLIENT_EMAIL    - Google service-account email address
 *   GOOGLE_PRIVATE_KEY     - Service-account PEM private key
 *   GOOGLE_SPREADSHEET_ID  - Google Spreadsheet ID (from the sheet URL)
 *
 * For local development, set these in a .env file (never commit it).
 * The script exits cleanly when credentials are absent so the build
 * continues using the fallback locale files already in the repository.
 *
 * Usage:
 *   node scripts/fetch-i18n.js        # fetches (or skips gracefully)
 *   node scripts/fetch-i18n.js --dry  # validate credentials only, no write
 */

import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

/** Output paths consumed by the rest of the project. */
const TRANSLATIONS_DIR = join(ROOT, 'src/locales')
const LOCALES_TS_PATH = join(ROOT, 'src/i18n/locales.ts')
const DATA_JSON_PATH = join(ROOT, 'src/lib/languageData.json')

/**
 * Sheet tab names to fetch from the spreadsheet.
 * Must match the actual tab titles; 'i18n' is always appended by the package.
 */
const SHEET_TITLES = ['i18n']

const DRY_RUN = process.argv.includes('--dry')

// ---------------------------------------------------------------------------
// GOOGLE_PRIVATE_KEY normalization
// GitHub Actions passes secrets as single-line strings with literal '\n'.
// The Google auth library requires real newlines inside the PEM block.
// ---------------------------------------------------------------------------
if (process.env.GOOGLE_PRIVATE_KEY) {
  process.env.GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
}

async function main() {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID } = process.env

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID) {
    console.warn(
      '[fetch-i18n] Google Sheets credentials not found in environment.\n' +
        '[fetch-i18n] Skipping i18n fetch — existing locale files in src/locales/ will be used.\n' +
        '[fetch-i18n] Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SPREADSHEET_ID to enable.',
    )
    return
  }

  if (DRY_RUN) {
    console.log('[fetch-i18n] --dry: credentials present. Skipping actual fetch.')
    return
  }

  const { getSpreadSheetData } = await import('@el-j/google-sheet-translations')

  console.log('[fetch-i18n] Fetching translations from Google Sheets…')
  try {
    await getSpreadSheetData(SHEET_TITLES, {
      translationsOutputDir: TRANSLATIONS_DIR,
      localesOutputPath: LOCALES_TS_PATH,
      dataJsonPath: DATA_JSON_PATH,
      // Do not push local changes back to the spreadsheet in CI.
      syncLocalChanges: !process.env.CI,
      autoCreate: false,
      // Generate =GOOGLETRANSLATE() formulas in the spreadsheet for any
      // missing translations whenever new keys are synced back.
      // This only has an effect when syncLocalChanges is true (i.e. local dev).
      autoTranslate: true,
    })
    console.log(`[fetch-i18n] Translations written to ${TRANSLATIONS_DIR}`)
  } catch (err) {
    console.error('[fetch-i18n] Failed to fetch translations:', err.message)
    if (process.env.CI) {
      // Credentials were present but the API call failed — fail the build.
      process.exit(1)
    }
    console.warn('[fetch-i18n] Continuing with existing locale files.')
  }
}

main().catch((err) => {
  console.error('[fetch-i18n] Unexpected error:', err)
  process.exit(1)
})
