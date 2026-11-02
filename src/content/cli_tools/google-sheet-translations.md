---
name: "google-sheet-translations"
command: "npx @el-j/google-sheet-translations sync"
summary: "Automated bidirectional localization sync using Google Spreadsheets as source with formula-driven translation and Next.js / Astro build integration."
installCmd: "npm install @el-j/google-sheet-translations"
language: "TypeScript / Node"
tags: ["i18n", "Localization", "Google Sheets", "CLI", "Automation"]
githubUrl: "https://github.com/el-j/google-sheet-translations"
npmUrl: "https://www.npmjs.com/package/@el-j/google-sheet-translations"
releaseVersion: "v3.0.0-beta.15"
releasesCount: 30
---

### Why it exists
Eliminates tedious manual copy-pasting of translation files across multilingual codebases. Connects directly to Google Sheets via Workload Identity Federation (WIF) or service account credentials, auto-generates missing translation formulas (`=GOOGLETRANSLATE`), applies smart locale filtering, and writes typed JSON dictionary files directly into the build pipeline.

