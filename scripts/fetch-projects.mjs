#!/usr/bin/env node
/**
 * scripts/fetch-projects.mjs
 *
 * Build-time self-discovery script.
 * Fetches repositories for the el-j GitHub user, merges them with
 * local overrides, and writes:
 *  - src/data/projects-generated.json  – flat list of all projects
 *  - src/data/project-groups-generated.json – grouped project bundles
 *
 * Usage:
 *   node scripts/fetch-projects.mjs          # skips fetch if data already exists
 *   node scripts/fetch-projects.mjs --force  # always fetches from the API
 *
 * In a CI environment (CI=true) the script always fetches fresh data
 * regardless of whether a cached file already exists, so the deployed
 * site is never built from a stale snapshot.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { buildScreenshotUrl } from '../src/utils/screenshot'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OVERRIDES_PATH = join(ROOT, 'src/data/project-overrides.json')
const OUTPUT_PATH = join(ROOT, 'src/data/projects-generated.json')
const GROUPS_OUTPUT_PATH = join(ROOT, 'src/data/project-groups-generated.json')
const GITHUB_USER = 'el-j'
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`
const GITHUB_REPO_API = `https://api.github.com/repos/${GITHUB_USER}`
const FORCE = process.argv.includes('--force') || !!process.env.CI

// Map GitHub topics to a human-readable category label
const TOPIC_CATEGORY_MAP = {
  portfolio: 'Portfolio',
  website: 'Website',
  web: 'Website',
  webapp: 'Web App',
  'web-app': 'Web App',
  cli: 'CLI',
  library: 'Library',
  lib: 'Library',
  plugin: 'Plugin',
  tool: 'Tool',
  api: 'API',
  mobile: 'Mobile',
  game: 'Game',
  bot: 'Bot',
}

function inferCategory(topics = []) {
  for (const topic of topics) {
    if (TOPIC_CATEGORY_MAP[topic]) return TOPIC_CATEGORY_MAP[topic]
  }
  return null
}

function resolveScreenshot(override, homepage, url) {
  return override.customImage || override.screenshot || buildScreenshotUrl(homepage || url)
}

async function main() {
  // Skip if data already exists and --force flag is not set
  if (!FORCE && existsSync(OUTPUT_PATH) && existsSync(GROUPS_OUTPUT_PATH)) {
    try {
      const existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
      if (Array.isArray(existing) && existing.length > 0) {
        console.log('[fetch-projects] Data already exists, skipping fetch. Use --force to refresh.')
        return
      }
    } catch {
      // File exists but is invalid JSON – proceed to fetch
    }
  }

  // Read local overrides
  let overrides = {}
  try {
    overrides = JSON.parse(readFileSync(OVERRIDES_PATH, 'utf-8'))
  } catch {
    console.warn('[fetch-projects] Could not read project-overrides.json, using empty overrides.')
  }

  // Fetch repositories from GitHub API
  console.log(`[fetch-projects] Fetching repos for user: ${GITHUB_USER}`)
  let repos = []
  try {
    const headers = {
      'User-Agent': 'el-j-build-script/1.0',
      Accept: 'application/vnd.github.v3+json',
    }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }
    const res = await fetch(GITHUB_API, { headers })
    if (!res.ok) {
      throw new Error(`GitHub API responded with ${res.status}: ${res.statusText}`)
    }
    repos = await res.json()
    console.log(`[fetch-projects] Fetched ${repos.length} repositories.`)
  } catch (err) {
    console.error('[fetch-projects] Failed to fetch repositories:', err.message)
    console.warn('[fetch-projects] Using empty repo list. Build will proceed without live project data.')
  }

  // Build set of GitHub repo names for de-duplication
  const repoNames = new Set(repos.map((r) => r.name))

  // Process GitHub repositories
  const projects = repos
    .filter((repo) => {
      // Exclude forks – only show repos owned by the user
      if (repo.fork) return false
      // Apply visibility override from project-overrides.json
      const override = overrides[repo.name]
      if (override && override.visible === false) return false
      return true
    })
    .map((repo) => {
      const override = overrides[repo.name] || {}
      const homepage = override.homepage ?? repo.homepage ?? null
      const url = override.url || repo.homepage || (repo.has_pages ? `https://${GITHUB_USER}.github.io/${repo.name}` : `https://github.com/${GITHUB_USER}/${repo.name}`)
      const screenshot = resolveScreenshot(override, homepage, url)
      return {
        id: repo.id,
        name: override.overrideName || repo.name,
        url,
        homepage,
        description: override.description || repo.description || null,
        topics: override.topics || repo.topics || [],
        language: override.language || repo.language || null,
        category: override.category || inferCategory(override.topics || repo.topics || []),
        updatedAt: repo.pushed_at || null,
        i18nKey: override.i18nKey || null,
        featured: override.featured || false,
        isExternal: false,
        customImage: override.customImage || null,
        screenshot,
        stars: override.stars ?? repo.stargazers_count ?? null,
        forks: override.forks ?? repo.forks_count ?? null,
        openIssues: override.openIssues ?? repo.open_issues_count ?? null,
        // Prefer readable license names and fall back to SPDX identifiers when names are unavailable.
        license: override.license || repo.license?.name || repo.license?.spdx_id || null,
        defaultBranch: override.defaultBranch || repo.default_branch || null,
        archived: override.archived ?? repo.archived ?? false,
      }
    })

  // Append purely external projects (those only defined in overrides, not from GitHub)
  for (const [key, override] of Object.entries(overrides)) {
    // Skip internal/meta keys
    if (key.startsWith('__')) continue
    if (repoNames.has(key)) continue // already processed above
    if (override.visible === false) continue
    if (!override.isExternal) continue

    const homepage = override.homepage || override.url || null

    // Best-effort: try to fetch additional metadata from a matching private GitHub repo.
    // This enriches external projects that may correspond to a private repository.
    let privateRepoData = null
    if (process.env.GITHUB_TOKEN) {
      try {
        const repoSlug = key.replace(/\./g, '-').replace(/[^a-zA-Z0-9-_]/g, '')
        const repoRes = await fetch(`${GITHUB_REPO_API}/${repoSlug}`, {
          headers: {
            'User-Agent': 'el-j-build-script/1.0',
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        })
        if (repoRes.ok) {
          privateRepoData = await repoRes.json()
          console.log(`[fetch-projects] Enriched external project "${key}" from private repo "${repoSlug}".`)
        }
      } catch {
        // Silently ignore – private repo lookup is best-effort
      }
    }

    const screenshot = resolveScreenshot(override, homepage, `https://${key}`)

    projects.push({
      id: `external-${key}`,
      name: override.overrideName || key,
      url: override.url || `https://${key}`,
      homepage,
      description: override.description || privateRepoData?.description || null,
      topics: override.topics || privateRepoData?.topics || [],
      language: override.language || privateRepoData?.language || null,
      category: override.category || inferCategory(override.topics || privateRepoData?.topics || []),
      updatedAt: privateRepoData?.pushed_at || null,
      i18nKey: override.i18nKey || null,
      featured: override.featured || false,
      isExternal: true,
      customImage: override.customImage || null,
      screenshot,
      stars: override.stars ?? privateRepoData?.stargazers_count ?? null,
      forks: override.forks ?? privateRepoData?.forks_count ?? null,
      openIssues: override.openIssues ?? privateRepoData?.open_issues_count ?? null,
      license: override.license || privateRepoData?.license?.name || privateRepoData?.license?.spdx_id || null,
      defaultBranch: override.defaultBranch || privateRepoData?.default_branch || null,
      archived: override.archived || privateRepoData?.archived || false,
    })
  }

  // Sort: featured first, then by updatedAt descending
  projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    if (a.updatedAt && b.updatedAt) return new Date(b.updatedAt) - new Date(a.updatedAt)
    return 0
  })

  writeFileSync(OUTPUT_PATH, JSON.stringify(projects, null, 2) + '\n', 'utf-8')
  console.log(`[fetch-projects] Wrote ${projects.length} projects to ${OUTPUT_PATH}`)

  // ── Build project groups ────────────────────────────────────────────────────
  const groupDefs = overrides.__groups || {}
  const byName = new Map(projects.map((p) => [p.name, p]))

  // Auto-detect groups from repo names sharing a common hyphenated prefix
  // (only used as fallback when __groups does not define a group for that prefix)
  const prefixMap = new Map()
  for (const project of projects) {
    // Use the original repo key name for prefix detection
    const parts = project.name.split('-')
    if (parts.length >= 2) {
      const prefix = parts[0].toLowerCase()
      if (!prefixMap.has(prefix)) prefixMap.set(prefix, [])
      prefixMap.get(prefix).push(project)
    }
  }

  const groups = []
  const groupedProjectNames = new Set()

  // Process explicit group definitions first
  for (const [slug, def] of Object.entries(groupDefs)) {
    const resolvedRepos = (def.repos || [])
      .map((repoName) => byName.get(repoName) ?? null)
      .filter(Boolean)

    if (resolvedRepos.length < 2) continue

    resolvedRepos.forEach((p) => groupedProjectNames.add(p.name))

    const screenshot =
      def.screenshot ??
      resolvedRepos.find((p) => p.screenshot)?.screenshot ??
      resolvedRepos.find((p) => p.customImage)?.customImage ??
      null

    const updatedAt =
      resolvedRepos
        .map((p) => p.updatedAt)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0] ?? null

    groups.push({
      slug,
      title: def.title || slug,
      description: def.description || null,
      repos: resolvedRepos,
      screenshot,
      featured: def.featured || false,
      category: def.category || resolvedRepos.find((p) => p.category)?.category || null,
      updatedAt,
    })
  }

  // Auto-detect groups from common name prefixes (only for unassigned projects)
  for (const [prefix, prefixRepos] of prefixMap.entries()) {
    // Skip if a group already exists with this slug
    if (groups.some((g) => g.slug === prefix)) continue

    const ungrouped = prefixRepos.filter((p) => !groupedProjectNames.has(p.name))
    if (ungrouped.length < 2) continue

    ungrouped.forEach((p) => groupedProjectNames.add(p.name))

    const screenshot =
      ungrouped.find((p) => p.screenshot)?.screenshot ??
      ungrouped.find((p) => p.customImage)?.customImage ??
      null

    const updatedAt =
      ungrouped
        .map((p) => p.updatedAt)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0] ?? null

    groups.push({
      slug: prefix,
      title: prefix.charAt(0).toUpperCase() + prefix.slice(1),
      description: null,
      repos: ungrouped,
      screenshot,
      featured: false,
      category: ungrouped.find((p) => p.category)?.category || null,
      updatedAt,
    })
  }

  writeFileSync(GROUPS_OUTPUT_PATH, JSON.stringify(groups, null, 2) + '\n', 'utf-8')
  console.log(`[fetch-projects] Wrote ${groups.length} groups to ${GROUPS_OUTPUT_PATH}`)
}

main().catch((err) => {
  console.error('[fetch-projects] Unexpected error:', err)
  process.exit(1)
})
