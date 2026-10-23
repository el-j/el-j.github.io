/**
 * src/views/__tests__/ProjectDetailPage.test.js
 *
 * Unit tests for the ProjectDetailPage view component.
 */

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

import en from '../../locales/en.json'
import de from '../../locales/de.json'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeI18n(locale = 'en') {
  return createI18n({ legacy: false, locale, fallbackLocale: 'en', messages: { en, de } })
}

function makeRouter(initialPath = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/projects/:slug', name: 'project-detail', component: { template: '<div />' }, props: true },
    ],
  })
  return router
}

const FIXTURE_GROUP = {
  slug: 'flowy',
  title: 'Flowy Suite',
  description: 'A collection of workflow repositories.',
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
      updatedAt: '2024-03-01T00:00:00Z',
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: 'https://example.com/cover.jpg',
      stars: 10,
      forks: 2,
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
      updatedAt: '2024-04-01T00:00:00Z',
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 4,
      forks: 1,
      openIssues: 0,
      license: 'MIT',
      defaultBranch: 'main',
      archived: false,
    },
    // Repo with no description/language/stars/license to test false branches
    {
      id: 'flowy-bare',
      name: 'flowy-bare',
      url: 'https://github.com/el-j/flowy-bare',
      homepage: null,
      description: null,
      topics: [],
      language: null,
      category: null,
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
  screenshot: null,
  featured: false,
  category: 'Web App',
  updatedAt: '2024-04-01T00:00:00Z',
}

// Mock the generated groups JSON with our fixture
vi.mock('../../data/project-groups-generated.json', () => ({
  default: [FIXTURE_GROUP],
}))

async function mountDetailPage(slug) {
  const { default: ProjectDetailPage } = await import('../ProjectDetailPage.vue')
  return mount(ProjectDetailPage, {
    props: { slug },
    global: {
      plugins: [makeI18n(), createPinia(), makeRouter()],
    },
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProjectDetailPage', () => {
  it('renders the group title when slug matches', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain('Flowy Suite')
  })

  it('renders the group description', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain('A collection of workflow repositories.')
  })

  it('renders the group badge label', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain(en.projects.group_badge)
  })

  it('renders constituent repo names', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain('flowy-core')
    expect(wrapper.text()).toContain('flowy-ui')
  })

  it('renders repo links pointing to the correct URL', async () => {
    const wrapper = await mountDetailPage('flowy')
    const links = wrapper.findAll('a')
    const hrefs = links.map((a) => a.attributes('href'))
    expect(hrefs).toContain('https://github.com/el-j/flowy-core')
    expect(hrefs).toContain('https://github.com/el-j/flowy-ui')
  })

  it('shows total stars rollup (10 + 4 = 14)', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain('14')
  })

  it('shows total forks rollup (2 + 1 = 3)', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain('3')
  })

  it('renders the back button with the back label', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain(en.projects.back)
  })

  it('shows the no-projects fallback for an unknown slug', async () => {
    const wrapper = await mountDetailPage('unknown-slug')
    expect(wrapper.text()).toContain(en.projects.no_projects)
  })

  it('does not render the group title for unknown slug', async () => {
    const wrapper = await mountDetailPage('unknown-slug')
    expect(wrapper.find('h1').exists()).toBe(false)
  })

  it('renders the category label', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain('Web App')
  })

  it('renders the repo count label', async () => {
    const wrapper = await mountDetailPage('flowy')
    expect(wrapper.text()).toContain('2')
  })

  it('goBack button navigates to "/" when clicked', async () => {
    const router = makeRouter()
    await router.push('/projects/flowy')
    const { default: ProjectDetailPage } = await import('../ProjectDetailPage.vue')
    const wrapper = mount(ProjectDetailPage, {
      props: { slug: 'flowy' },
      global: { plugins: [makeI18n(), createPinia(), router] },
    })
    const backBtn = wrapper.findAll('button').find((b) => b.text().includes(en.projects.back))
    expect(backBtn).toBeDefined()
    await backBtn.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
  })
})
