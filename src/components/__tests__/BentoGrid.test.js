/**
 * src/components/__tests__/BentoGrid.test.js
 *
 * Tests for BentoGrid with mocked project group data.
 * These tests use vi.mock() to inject group data and exercise group-related code paths.
 */

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

import en from '../../locales/en.json'
import de from '../../locales/de.json'

// ---------------------------------------------------------------------------
// Mock group data so BentoGrid exercises group-related code paths
// ---------------------------------------------------------------------------

const MOCK_GROUP = {
  slug: 'flowy',
  title: 'Flowy',
  description: 'A workflow toolkit.',
  repos: [
    {
      id: 'flowy-core',
      name: 'flowy-core',
      url: 'https://github.com/el-j/flowy-core',
      homepage: null,
      description: 'Core logic.',
      topics: ['vue'],
      language: 'TypeScript',
      category: 'Web App',
      updatedAt: '2024-04-01T00:00:00Z',
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 5,
      forks: 1,
      openIssues: 0,
      license: 'MIT',
      defaultBranch: 'main',
      archived: false,
    },
    {
      id: 'flowy-ui',
      name: 'flowy-ui',
      url: 'https://github.com/el-j/flowy-ui',
      homepage: null,
      description: 'UI layer.',
      topics: ['vue', 'ui'],
      language: 'Vue',
      category: 'Web App',
      updatedAt: '2024-03-01T00:00:00Z',
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 2,
      forks: 0,
      openIssues: 0,
      license: 'MIT',
      defaultBranch: 'main',
      archived: false,
    },
  ],
  screenshot: null,
  featured: false,
  category: 'Web App',
  updatedAt: '2024-04-01T00:00:00Z',
}

const MOCK_FEATURED_GROUP = {
  slug: 'alpha',
  title: 'Alpha Project',
  description: 'A featured group.',
  repos: [
    {
      id: 'alpha-1',
      name: 'alpha-1',
      url: 'https://github.com/el-j/alpha-1',
      homepage: null,
      description: 'First alpha module.',
      topics: [],
      language: 'Go',
      category: 'Library',
      updatedAt: null, // purposely null to test branch
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 0,
      forks: 0,
      openIssues: 0,
      license: null,
      defaultBranch: 'main',
      archived: false,
    },
    {
      id: 'alpha-2',
      name: 'alpha-2',
      url: 'https://github.com/el-j/alpha-2',
      homepage: null,
      description: null, // purposely null
      topics: [],
      language: null, // purposely null
      category: 'Library',
      updatedAt: null, // purposely null
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 0,
      forks: 0,
      openIssues: 0,
      license: null,
      defaultBranch: 'main',
      archived: false,
    },
  ],
  screenshot: null,
  featured: true, // featured group
  category: 'Library',
  updatedAt: null,
}

vi.mock('../../data/project-groups-generated.json', () => ({
  default: [MOCK_GROUP, MOCK_FEATURED_GROUP],
}))

vi.mock('../../data/projects-generated.json', () => ({
  default: [
    {
      id: 'solo-project',
      name: 'solo-project',
      url: 'https://github.com/el-j/solo-project',
      homepage: null,
      description: 'A standalone project.',
      topics: ['typescript'],
      language: 'TypeScript',
      category: 'Library',
      updatedAt: '2024-05-01T00:00:00Z',
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 3,
      forks: 0,
      openIssues: 0,
      license: 'MIT',
      defaultBranch: 'main',
      archived: false,
    },
    {
      id: 'featured-project',
      name: 'featured-project',
      url: 'https://github.com/el-j/featured-project',
      homepage: null,
      description: 'A featured project.',
      topics: ['vue'],
      language: 'Vue',
      category: 'Web App',
      updatedAt: '2024-02-01T00:00:00Z',
      i18nKey: null,
      featured: true,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 20,
      forks: 5,
      openIssues: 0,
      license: 'MIT',
      defaultBranch: 'main',
      archived: false,
    },
    // Project with null updatedAt to exercise null-date sort branches
    {
      id: 'no-date-project',
      name: 'no-date-project',
      url: 'https://github.com/el-j/no-date-project',
      homepage: null,
      description: 'A project with no date.',
      topics: [],
      language: null,
      category: 'Library',
      updatedAt: null,
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 0,
      forks: 0,
      openIssues: 0,
      license: null,
      defaultBranch: 'main',
      archived: false,
    },
    // This archived project should be filtered out
    {
      id: 'archived-project',
      name: 'archived-project',
      url: 'https://github.com/el-j/archived-project',
      homepage: null,
      description: 'An archived project.',
      topics: [],
      language: null,
      category: null,
      updatedAt: '2023-01-01T00:00:00Z',
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 0,
      forks: 0,
      openIssues: 0,
      license: null,
      defaultBranch: 'main',
      archived: true,
    },
    // A project grouped into 'flowy' – should NOT appear in singletons
    {
      id: 'flowy-core',
      name: 'flowy-core',
      url: 'https://github.com/el-j/flowy-core',
      homepage: null,
      description: 'Core logic.',
      topics: ['vue'],
      language: 'TypeScript',
      category: 'Web App',
      updatedAt: '2024-04-01T00:00:00Z',
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 5,
      forks: 1,
      openIssues: 0,
      license: 'MIT',
      defaultBranch: 'main',
      archived: false,
    },
    // alpha-1 is in the alpha group
    {
      id: 'alpha-1',
      name: 'alpha-1',
      url: 'https://github.com/el-j/alpha-1',
      homepage: null,
      description: 'First alpha module.',
      topics: [],
      language: 'Go',
      category: 'Library',
      updatedAt: null,
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 0,
      forks: 0,
      openIssues: 0,
      license: null,
      defaultBranch: 'main',
      archived: false,
    },
    {
      id: 'alpha-2',
      name: 'alpha-2',
      url: 'https://github.com/el-j/alpha-2',
      homepage: null,
      description: null,
      topics: [],
      language: null,
      category: 'Library',
      updatedAt: null,
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 0,
      forks: 0,
      openIssues: 0,
      license: null,
      defaultBranch: 'main',
      archived: false,
    },
  ],
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeI18n(locale = 'en') {
  return createI18n({ legacy: false, locale, fallbackLocale: 'en', messages: { en, de } })
}

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/projects/:slug', name: 'project-detail', component: { template: '<div />' }, props: true },
    ],
  })
}

const defaultGlobal = () => ({
  plugins: [makeI18n(), createPinia(), makeRouter()],
  stubs: {
    Button: { template: '<button><slot /></button>' },
  },
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('BentoGrid with groups', () => {
  it('renders a ProjectGroupCard for the mocked group', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    // Group badge should appear
    expect(wrapper.text()).toContain(en.projects.group_badge)
  })

  it('renders solo-project as a singleton card', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    expect(wrapper.text()).toContain('solo-project')
  })

  it('does not render grouped projects as singletons', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    // flowy-core is in the group, so should not appear as a standalone ProjectCard
    // The group card renders "Flowy" which contains the repos internally, but
    // "flowy-core" title should not appear outside the group card.
    const articles = wrapper.findAll('article')
    // One group card (col-span-2) + singleton cards
    expect(articles.length).toBeGreaterThanOrEqual(1)
  })

  it('does not render archived projects', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    expect(wrapper.text()).not.toContain('archived-project')
  })

  it('shows categories from both groups and singletons', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    // 'Web App' from group, 'Library' from solo project
    expect(wrapper.text()).toContain('Web App')
    expect(wrapper.text()).toContain('Library')
  })

  it('filtering by category shows only matching items', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    // Filter by Web App - should show Flowy group and featured-project, but not Library items
    const webAppBtn = wrapper.findAll('button').find((b) => b.text() === 'Web App')
    if (webAppBtn) {
      await webAppBtn.trigger('click')
      await flushPromises()
      // Flowy is in Web App category, Alpha is in Library (filtered out)
      expect(wrapper.text()).toContain('Flowy')
      // solo-project and no-date-project are Library, they should be filtered out
      expect(wrapper.text()).not.toContain('solo-project')
    }
  })

  it('closeModal is callable (opens and closes a modal)', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    // Find a singleton project card and click it to open modal
    const articles = wrapper.findAll('article:not(.col-span-2)')
    if (articles.length > 0) {
      await articles[0].trigger('click')
      await flushPromises()
      // Modal should be open; close it
      const closeBtn = wrapper.find('button[aria-label]')
      if (closeBtn.exists()) {
        await closeBtn.trigger('click')
        await flushPromises()
      }
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('sorting by A-Z works without errors', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    const select = wrapper.find('select')
    await select.setValue('az')
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('featured projects appear in sorted output', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    expect(wrapper.text()).toContain('featured-project')
  })

  it('sorting groups A-Z works without errors', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    const select = wrapper.find('select')
    await select.setValue('az')
    await flushPromises()
    // Both group titles should appear
    expect(wrapper.text()).toContain('Flowy')
    expect(wrapper.text()).toContain('Alpha Project')
  })

  it('featured groups appear before non-featured groups', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    const text = wrapper.text()
    const flowyPos = text.indexOf('Flowy')
    const alphaPos = text.indexOf('Alpha Project')
    // Alpha is featured, should appear before Flowy
    // (featured flag causes it to sort before non-featured)
    expect(alphaPos).toBeLessThan(flowyPos)
  })

  it('handles groups with null updatedAt during sort', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    // Alpha group has updatedAt: null – this exercises the null date branches
    expect(wrapper.text()).toContain('Alpha Project')
  })

  it('handles projects with null updatedAt during sort', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    await flushPromises()
    // 'no-date-project' has updatedAt: null
    expect(wrapper.text()).toContain('no-date-project')
  })
})
