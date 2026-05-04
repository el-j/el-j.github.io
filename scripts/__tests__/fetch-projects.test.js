/**
 * scripts/__tests__/fetch-projects.test.js
 *
 * Unit tests for the project-fetching and merging logic.
 * No network calls — all API responses are mocked inline.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { buildScreenshotUrl } from '../../src/utils/screenshot.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')

// ---------------------------------------------------------------------------
// Helpers – replicate the pure logic from fetch-projects.js without I/O
// ---------------------------------------------------------------------------

/**
 * Applies the same filter+map pipeline used in fetch-projects.js.
 * Keeping it here (rather than importing) so the test stays self-contained
 * and does not need to mock fs / fetch.
 */
function resolveScreenshot(override, homepage, url) {
  return override.customImage || override.screenshot || buildScreenshotUrl(homepage || url)
}

function processRepos(repos, overrides) {
  const repoNames = new Set(repos.map((r) => r.name))

  const projects = repos
    .filter((repo) => {
      const override = overrides[repo.name]
      return !(override && override.visible === false)
    })
    .map((repo) => {
      const override = overrides[repo.name] || {}
      const homepage = override.homepage ?? repo.homepage ?? null
      const url = override.url || repo.homepage || (repo.has_pages ? `https://el-j.github.io/${repo.name}` : `https://github.com/el-j/${repo.name}`)
      const screenshot = resolveScreenshot(override, homepage, url)
      return {
        id: repo.id,
        name: override.overrideName || repo.name,
        url,
        homepage,
        description: override.description || repo.description || null,
        topics: override.topics || repo.topics || [],
        language: override.language || repo.language || null,
        updatedAt: repo.pushed_at || null,
        i18nKey: override.i18nKey || null,
        featured: override.featured || false,
        isExternal: false,
        customImage: override.customImage || null,
        screenshot,
        stars: override.stars ?? repo.stargazers_count ?? null,
        forks: override.forks ?? repo.forks_count ?? null,
        openIssues: override.openIssues ?? repo.open_issues_count ?? null,
        license: override.license || repo.license?.name || repo.license?.spdx_id || null,
        defaultBranch: override.defaultBranch || repo.default_branch || null,
        archived: override.archived ?? repo.archived ?? false,
      }
    })

  for (const [key, override] of Object.entries(overrides)) {
    if (repoNames.has(key)) continue
    if (override.visible === false) continue
    if (!override.isExternal) continue

    const homepage = override.homepage || override.url || null
    const screenshot = resolveScreenshot(override, homepage, `https://${key}`)

    projects.push({
      id: `external-${key}`,
      name: override.overrideName || key,
      url: override.url || `https://${key}`,
      homepage,
      description: override.description || null,
      topics: override.topics || [],
      language: override.language || null,
      updatedAt: null,
      i18nKey: override.i18nKey || null,
      featured: override.featured || false,
      isExternal: true,
      customImage: override.customImage || null,
      screenshot,
      stars: override.stars ?? null,
      forks: override.forks ?? null,
      openIssues: override.openIssues ?? null,
      license: override.license || null,
      defaultBranch: override.defaultBranch || null,
      archived: override.archived || false,
    })
  }

  projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    if (a.updatedAt && b.updatedAt) return new Date(b.updatedAt) - new Date(a.updatedAt)
    return 0
  })

  return projects
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const REPO_WITH_PAGES = {
  id: 1,
  name: 'my-project',
  has_pages: true,
  description: 'A project with pages',
  topics: ['vue', 'typescript'],
  language: 'TypeScript',
  pushed_at: '2024-01-15T10:00:00Z',
  homepage: 'https://example.com/my-project',
  stargazers_count: 5,
  forks_count: 2,
  open_issues_count: 1,
  license: { spdx_id: 'MIT', name: 'MIT License' },
  default_branch: 'main',
  archived: false,
}

const REPO_WITHOUT_PAGES = {
  id: 2,
  name: 'no-pages-project',
  has_pages: false,
  description: 'No pages',
  topics: [],
  language: 'JavaScript',
  pushed_at: '2024-01-10T10:00:00Z',
}

const REPO_HIDDEN_BY_OVERRIDE = {
  id: 3,
  name: 'old-project',
  has_pages: true,
  description: 'Hidden',
  topics: [],
  language: null,
  pushed_at: '2023-06-01T00:00:00Z',
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('fetch-projects: filtering', () => {
  it('includes repos regardless of has_pages', () => {
    const result = processRepos([REPO_WITH_PAGES, REPO_WITHOUT_PAGES], {})
    expect(result).toHaveLength(2)
  })

  it('includes repos without GitHub Pages (links to github.com instead)', () => {
    const result = processRepos([REPO_WITHOUT_PAGES], {})
    expect(result).toHaveLength(1)
    expect(result[0].url).toBe('https://github.com/el-j/no-pages-project')
  })

  it('excludes repos marked visible: false in overrides', () => {
    const result = processRepos([REPO_HIDDEN_BY_OVERRIDE], {
      'old-project': { visible: false },
    })
    expect(result).toHaveLength(0)
  })

  it('includes repos not mentioned in overrides', () => {
    const result = processRepos([REPO_WITH_PAGES], { unrelated: { visible: false } })
    expect(result).toHaveLength(1)
  })
})

describe('fetch-projects: mapping', () => {
  it('uses overrideName when provided', () => {
    const result = processRepos([REPO_WITH_PAGES], {
      'my-project': { overrideName: 'Awesome App' },
    })
    expect(result[0].name).toBe('Awesome App')
  })

  it('falls back to repo.name when no overrideName', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result[0].name).toBe('my-project')
  })

  it('maps homepage and builds screenshot URL', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result[0].homepage).toBe('https://example.com/my-project')
    expect(result[0].screenshot).toContain('https://s0.wp.com/mshots/v1/')
  })

  it('uses override URL when provided', () => {
    const result = processRepos([REPO_WITH_PAGES], {
      'my-project': { url: 'https://custom.example.com' },
    })
    expect(result[0].url).toBe('https://custom.example.com')
  })

  it('uses github.com URL when has_pages is false and no homepage', () => {
    const result = processRepos([REPO_WITHOUT_PAGES], {})
    expect(result[0].url).toBe('https://github.com/el-j/no-pages-project')
  })

  it('maps topics, language, and updatedAt from the repo object', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result[0].topics).toEqual(['vue', 'typescript'])
    expect(result[0].language).toBe('TypeScript')
    expect(result[0].updatedAt).toBe('2024-01-15T10:00:00Z')
  })

  it('creates a screenshot URL based on homepage/url when none provided', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result[0].screenshot).toBe(buildScreenshotUrl(REPO_WITH_PAGES.homepage))
  })

  it('prefers customImage override as screenshot source', () => {
    const result = processRepos([REPO_WITH_PAGES], {
      'my-project': { customImage: '/cover.webp' },
    })
    expect(result[0].screenshot).toBe('/cover.webp')
  })

  it('marks project as featured when override sets featured: true', () => {
    const result = processRepos([REPO_WITH_PAGES], {
      'my-project': { featured: true },
    })
    expect(result[0].featured).toBe(true)
  })

  it('sets isExternal: false for GitHub repos', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result[0].isExternal).toBe(false)
  })

  it('maps repository stats and metadata', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result[0].stars).toBe(5)
    expect(result[0].forks).toBe(2)
    expect(result[0].openIssues).toBe(1)
    expect(result[0].license).toBe('MIT License')
    expect(result[0].defaultBranch).toBe('main')
    expect(result[0].archived).toBe(false)
  })
})

describe('fetch-projects: external projects', () => {
  it('appends external projects from overrides not in the GitHub API response', () => {
    const result = processRepos([], {
      'fabianalthaus.de': {
        isExternal: true,
        url: 'https://fabianalthaus.de',
        overrideName: 'Personal Portfolio',
        i18nKey: 'projects.portfolio',
        featured: true,
      },
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('external-fabianalthaus.de')
    expect(result[0].name).toBe('Personal Portfolio')
    expect(result[0].isExternal).toBe(true)
    expect(result[0].featured).toBe(true)
  })

  it('does NOT append external project when visible: false', () => {
    const result = processRepos([], {
      'hidden-external': { isExternal: true, visible: false },
    })
    expect(result).toHaveLength(0)
  })

  it('does NOT append override entries that are not isExternal', () => {
    // An entry without isExternal: true should only be used to override a
    // matching GitHub repo, not to synthesise a new project.
    const result = processRepos([], {
      'some-override': { overrideName: 'Override Only', visible: true },
    })
    expect(result).toHaveLength(0)
  })

  it('does not duplicate a repo that is both in the API response and overrides', () => {
    const result = processRepos([REPO_WITH_PAGES], {
      'my-project': { overrideName: 'Renamed', isExternal: true },
    })
    // Should appear once (from the repo list), not again as external
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Renamed')
  })
})

describe('fetch-projects: sorting', () => {
  it('puts featured projects first', () => {
    const repos = [
      { ...REPO_WITH_PAGES, id: 10, name: 'normal', pushed_at: '2024-02-01T00:00:00Z' },
      { ...REPO_WITH_PAGES, id: 11, name: 'star-project', pushed_at: '2024-01-01T00:00:00Z' },
    ]
    const result = processRepos(repos, { 'star-project': { featured: true } })
    expect(result[0].name).toBe('star-project')
  })

  it('sorts non-featured projects by updatedAt descending', () => {
    const repos = [
      { ...REPO_WITH_PAGES, id: 20, name: 'older', pushed_at: '2023-01-01T00:00:00Z' },
      { ...REPO_WITH_PAGES, id: 21, name: 'newer', pushed_at: '2024-06-01T00:00:00Z' },
    ]
    const result = processRepos(repos, {})
    expect(result[0].name).toBe('newer')
    expect(result[1].name).toBe('older')
  })
})

describe('project-overrides.json schema', () => {
  const overrides = JSON.parse(
    readFileSync(join(ROOT, 'src/data/project-overrides.json'), 'utf-8'),
  )

  it('is a valid JSON object', () => {
    expect(typeof overrides).toBe('object')
    expect(overrides).not.toBeNull()
  })

  it('every entry has a boolean visible flag if visible is set', () => {
    for (const [key, entry] of Object.entries(overrides)) {
      if ('visible' in entry) {
        expect(typeof entry.visible, `${key}.visible`).toBe('boolean')
      }
    }
  })

  it('external entries have a url defined', () => {
    for (const [key, entry] of Object.entries(overrides)) {
      if (entry.isExternal) {
        expect(entry.url, `${key}.url`).toBeTruthy()
      }
    }
  })
})
