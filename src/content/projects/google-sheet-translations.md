---
title: "Google Sheet Translations (@el-j/google-sheet-translations)"
description: "Open Source i18n synchronization engine and GitHub Action linking Google Sheets directly with static site codebases."
category: "Software"
featured: true
role: "Creator & Maintainer"
period: "03/2024 - Present"
year: "2024"
clientOrContext: "Open Source / NPM Package"
stack: ["TypeScript", "Node.js", "Google Sheets API", "GitHub Actions", "NPM", "Vite", "JSON Schema"]
uxHighlight: "Zero-friction workflow empowering non-technical translators to edit spreadsheet rows with live automated validation."
architectureHighlight: "Bidirectional sync pipeline generating typed JSON/TypeScript locale dictionaries with automated missing key detection."
schematic: "[Google Sheet API] <-> [@el-j/google-sheet-translations] <-> [Git Commits & Local SSG Locales]"
githubUrl: "https://github.com/el-j"
demoUrl: "https://fabianalthaus.de/en/google-sheet-translations/"
metrics:
  "NPM Package": "@el-j/google-sheet-translations"
  "CI Pipeline": "Automated Sync"
  "Sync Time": "< 2.5s"
---

### Problem & Motivation
Managing multi-language translations across static site generation (SSG) projects regularly causes friction between non-technical copywriters and developers. Traditional i18n SaaS platforms are expensive and introduce vendor lock-in.

### The Solution
`@el-j/google-sheet-translations` bridges the gap by linking collaborative Google Sheets directly to Git repositories. During build time or via GitHub Actions triggers, changes in the spreadsheet are validated, normalized, and written directly into type-safe locale files.
