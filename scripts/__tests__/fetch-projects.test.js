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
function processRepos(repos, overrides) {
  const repoNames = new Set(repos.map((r) => r.name))

  const projects = repos
    .filter((repo) => {
      if (!repo.has_pages) return false
      const override = overrides[repo.name]
      return !(override && override.visible === false)
    })
    .map((repo) => {
      const override = overrides[repo.name] || {}
      return {
        id: repo.id,
        name: override.overrideName || repo.name,
        url: override.url || `https://el-j.github.io/${repo.name}`,
        description: repo.description || null,
        topics: repo.topics || [],
        language: repo.language || null,
        updatedAt: repo.pushed_at || null,
        i18nKey: override.i18nKey || null,
        featured: override.featured || false,
        isExternal: false,
        customImage: override.customImage || null,
      }
    })

  for (const [key, override] of Object.entries(overrides)) {
    if (repoNames.has(key)) continue
    if (override.visible === false) continue
    if (!override.isExternal) continue

    projects.push({
      id: `external-${key}`,
      name: override.overrideName || key,
      url: override.url || `https://${key}`,
      description: null,
      topics: override.topics || [],
      language: override.language || null,
      updatedAt: null,
      i18nKey: override.i18nKey || null,
      featured: override.featured || false,
      isExternal: true,
      customImage: override.customImage || null,
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
  it('includes repos that have GitHub Pages enabled', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('my-project')
  })

  it('excludes repos where has_pages is false', () => {
    const result = processRepos([REPO_WITHOUT_PAGES], {})
    expect(result).toHaveLength(0)
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

  it('uses override URL when provided', () => {
    const result = processRepos([REPO_WITH_PAGES], {
      'my-project': { url: 'https://custom.example.com' },
    })
    expect(result[0].url).toBe('https://custom.example.com')
  })

  it('constructs default GitHub Pages URL from repo name', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result[0].url).toBe('https://el-j.github.io/my-project')
  })

  it('maps topics, language, and updatedAt from the repo object', () => {
    const result = processRepos([REPO_WITH_PAGES], {})
    expect(result[0].topics).toEqual(['vue', 'typescript'])
    expect(result[0].language).toBe('TypeScript')
    expect(result[0].updatedAt).toBe('2024-01-15T10:00:00Z')
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
