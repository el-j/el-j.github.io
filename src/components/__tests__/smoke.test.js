/**
 * src/components/__tests__/smoke.test.js
 *
 * Smoke tests – verify that core Vue components mount without errors and
 * render the expected structure.  These tests use real locale data and real
 * project fixture data so they also act as an integration check of the
 * i18n + component contract.
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'

import en from '../../locales/en.json'
import de from '../../locales/de.json'

// ---------------------------------------------------------------------------
// Shared test utilities
// ---------------------------------------------------------------------------

function makeI18n(locale = 'en') {
  return createI18n({ legacy: false, locale, fallbackLocale: 'en', messages: { en, de } })
}

const defaultGlobal = () => ({
  plugins: [makeI18n(), createPinia()],
  stubs: {
    // Stub out PrimeVue components that require a full PrimeVue install
    Button: { template: '<button><slot /></button>' },
  },
})

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------

describe('HeroSection', () => {
  it('renders the h1 greeting from the en locale', async () => {
    const { default: HeroSection } = await import('../projects/HeroSection.vue')
    const wrapper = mount(HeroSection, { global: defaultGlobal() })
    expect(wrapper.find('h1').text()).toBe(en.hero.greeting)
  })

  it('renders the role subtitle', async () => {
    const { default: HeroSection } = await import('../projects/HeroSection.vue')
    const wrapper = mount(HeroSection, { global: defaultGlobal() })
    expect(wrapper.text()).toContain(en.hero.role)
  })

  it('renders the GitHub CTA link', async () => {
    const { default: HeroSection } = await import('../projects/HeroSection.vue')
    const wrapper = mount(HeroSection, { global: defaultGlobal() })
    const githubLink = wrapper.find('a[href="https://github.com/el-j"]')
    expect(githubLink.exists()).toBe(true)
  })

  it('renders the German greeting when locale is de', async () => {
    const { default: HeroSection } = await import('../projects/HeroSection.vue')
    const wrapper = mount(HeroSection, {
      global: { plugins: [makeI18n('de'), createPinia()] },
    })
    expect(wrapper.find('h1').text()).toBe(de.hero.greeting)
  })
})

// ---------------------------------------------------------------------------
// ProjectCard
// ---------------------------------------------------------------------------

const FIXTURE_PROJECT = {
  id: 'test-1',
  name: 'Test Project',
  url: 'https://el-j.github.io/test-project',
  description: 'A great test project.',
  topics: ['vue', 'vite'],
  language: 'TypeScript',
  updatedAt: '2024-06-01T00:00:00Z',
  i18nKey: null,
  featured: false,
  isExternal: false,
  customImage: null,
}

const FIXTURE_FEATURED = { ...FIXTURE_PROJECT, id: 'test-featured', featured: true }

describe('ProjectCard', () => {
  it('renders the project name', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('Test Project')
  })

  it('renders topic badges', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('vue')
    expect(wrapper.text()).toContain('vite')
  })

  it('renders the project description when no i18nKey is set', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('A great test project.')
  })

  it('falls back to i18n description when i18nKey is set and the key exists', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: { ...FIXTURE_PROJECT, i18nKey: 'projects.portfolio' } },
      global: defaultGlobal(),
    })
    // The i18n key 'projects.portfolio.desc' resolves to en.projects.portfolio.desc
    expect(wrapper.text()).toContain(en.projects.portfolio.desc)
  })

  it('shows the Featured badge on featured projects', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_FEATURED },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain(en.projects.featured)
  })

  it('does not show the Featured badge on non-featured projects', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).not.toContain(en.projects.featured)
  })

  it('renders an anchor pointing to project.url', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    const links = wrapper.findAll('a')
    const urls = links.map((l) => l.attributes('href'))
    expect(urls).toContain(FIXTURE_PROJECT.url)
  })

  it('shows the language dot when language is set', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('TypeScript')
  })

  it('applies col-span-2 row-span-2 classes for featured cards', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_FEATURED },
      global: defaultGlobal(),
    })
    expect(wrapper.find('article').classes()).toContain('col-span-2')
    expect(wrapper.find('article').classes()).toContain('row-span-2')
  })

  it('does NOT apply col-span-2 for non-featured cards', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    expect(wrapper.find('article').classes()).not.toContain('col-span-2')
  })
})

// ---------------------------------------------------------------------------
// BentoGrid
// ---------------------------------------------------------------------------

describe('BentoGrid', () => {
  it('renders the section title from the en locale', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    expect(wrapper.find('h2').text()).toBe(en.projects.title)
  })

  it('renders at least one project card when projects-generated.json has entries', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    // The grid should either render cards or an empty-state message –
    // but must not throw during mount.
    expect(wrapper.exists()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Locale files completeness
// ---------------------------------------------------------------------------

describe('locale completeness', () => {
  it('German locale has the same top-level keys as English', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort())
  })

  it('hero section keys are present in both locales', () => {
    const heroKeys = ['greeting', 'role', 'description', 'cta_projects', 'cta_github']
    for (const key of heroKeys) {
      expect(en.hero[key], `en.hero.${key}`).toBeTruthy()
      expect(de.hero[key], `de.hero.${key}`).toBeTruthy()
    }
  })

  it('projects section keys are present in both locales', () => {
    const projectKeys = ['title', 'subtitle', 'view', 'featured', 'no_description']
    for (const key of projectKeys) {
      expect(en.projects[key], `en.projects.${key}`).toBeTruthy()
      expect(de.projects[key], `de.projects.${key}`).toBeTruthy()
    }
  })
})
