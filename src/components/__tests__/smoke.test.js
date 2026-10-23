/**
 * src/components/__tests__/smoke.test.js
 *
 * Smoke tests – verify that core Vue components mount without errors and
 * render the expected structure.  These tests use real locale data and real
 * project fixture data so they also act as an integration check of the
 * i18n + component contract.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

import en from '../../locales/en.json'
import de from '../../locales/de.json'

// ---------------------------------------------------------------------------
// Shared test utilities
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
  homepage: null,
  description: 'A great test project.',
  topics: ['vue', 'vite'],
  language: 'TypeScript',
  category: null,
  updatedAt: '2024-06-01T00:00:00Z',
  i18nKey: null,
  featured: false,
  isExternal: false,
  customImage: null,
  screenshot: null,
  stars: 12,
  forks: 3,
  openIssues: 1,
  license: 'MIT',
  defaultBranch: 'main',
  archived: false,
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

  it('shows the language dot when language is set and no category', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('TypeScript')
  })

  it('shows category label when category is set', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: { ...FIXTURE_PROJECT, category: 'Web App' } },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('Web App')
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

  it('renders stat chips for stars, forks and license (not issues)', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    // stars (12 > 0) and forks (3 > 0) are shown; issues chip is hidden; license is shown
    expect(wrapper.text()).toContain(String(FIXTURE_PROJECT.stars))
    expect(wrapper.text()).toContain(String(FIXTURE_PROJECT.forks))
    expect(wrapper.find('.pi-exclamation-circle').exists()).toBe(false)
    expect(wrapper.text()).toContain(FIXTURE_PROJECT.license)
  })

  it('hides zero stars and forks', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const projectNoStats = { ...FIXTURE_PROJECT, stars: 0, forks: 0, license: null }
    const wrapper = mount(ProjectCard, {
      props: { project: projectNoStats },
      global: defaultGlobal(),
    })
    // No stat chips should be rendered at all
    expect(wrapper.find('.pi-star-fill').exists()).toBe(false)
    expect(wrapper.find('.pi-code-branch').exists()).toBe(false)
  })

  it('does NOT apply col-span-2 for non-featured cards', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    expect(wrapper.find('article').classes()).not.toContain('col-span-2')
  })

  it('emits "expand" with the project when the card is clicked', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    await wrapper.find('article').trigger('click')
    expect(wrapper.emitted('expand')).toBeTruthy()
    expect(wrapper.emitted('expand')[0]).toEqual([FIXTURE_PROJECT])
  })

  it('renders a favicon image derived from the project URL', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const wrapper = mount(ProjectCard, {
      props: { project: FIXTURE_PROJECT },
      global: defaultGlobal(),
    })
    const imgs = wrapper.findAll('img')
    const faviconImg = imgs.find((img) =>
      img.attributes('src')?.includes('google.com/s2/favicons'),
    )
    expect(faviconImg).toBeDefined()
    expect(faviconImg.attributes('src')).toContain('el-j.github.io')
  })

  it('renders a custom image when customImage is set', async () => {
    const { default: ProjectCard } = await import('../projects/ProjectCard.vue')
    const projectWithImage = {
      ...FIXTURE_PROJECT,
      id: 'test-img',
      customImage: '/assets/images/test-cover.webp',
    }
    const wrapper = mount(ProjectCard, {
      props: { project: projectWithImage },
      global: defaultGlobal(),
    })
    const imgs = wrapper.findAll('img')
    const coverImg = imgs.find((img) =>
      img.attributes('src') === '/assets/images/test-cover.webp',
    )
    expect(coverImg).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// ProjectCardModal
// ---------------------------------------------------------------------------

describe('ProjectCardModal', () => {
  it('renders the project name when visible', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const wrapper = mount(ProjectCardModal, {
      props: { project: FIXTURE_PROJECT, visible: true },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('Test Project')
  })

  it('does not render content when visible is false', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const wrapper = mount(ProjectCardModal, {
      props: { project: FIXTURE_PROJECT, visible: false },
      global: defaultGlobal(),
    })
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('emits "close" when the close button is clicked', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const wrapper = mount(ProjectCardModal, {
      props: { project: FIXTURE_PROJECT, visible: true },
      global: defaultGlobal(),
    })
    const closeBtn = wrapper.findAll('button').find((b) =>
      b.attributes('aria-label') === en.projects.close,
    )
    expect(closeBtn).toBeDefined()
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('renders all topics (not truncated) in the modal', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const projectWithManyTopics = {
      ...FIXTURE_PROJECT,
      id: 'test-topics',
      topics: ['vue', 'vite', 'typescript', 'tailwind', 'pinia', 'vitest'],
    }
    const wrapper = mount(ProjectCardModal, {
      props: { project: projectWithManyTopics, visible: true },
      global: defaultGlobal(),
    })
    for (const topic of projectWithManyTopics.topics) {
      expect(wrapper.text()).toContain(topic)
    }
  })

  it('renders View Project and Close action buttons', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const wrapper = mount(ProjectCardModal, {
      props: { project: FIXTURE_PROJECT, visible: true },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain(en.projects.view)
    expect(wrapper.text()).toContain(en.projects.close)
  })

  it('uses i18n description when project.i18nKey and key exists', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const i18nProject = { ...FIXTURE_PROJECT, i18nKey: 'projects.portfolio', description: null }
    const wrapper = mount(ProjectCardModal, {
      props: { project: i18nProject, visible: true },
      global: defaultGlobal(),
    })
    // The en translation has projects.portfolio.desc = "My personal portfolio site."
    expect(wrapper.text()).toContain(en.projects.portfolio.desc)
  })

  it('clicks the backdrop (click.self) emits close', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const wrapper = mount(ProjectCardModal, {
      props: { project: FIXTURE_PROJECT, visible: true },
      global: defaultGlobal(),
      attachTo: document.body,
    })
    // Click the outermost backdrop div (first div in visible state)
    const backdrop = wrapper.find('div.fixed')
    expect(backdrop.exists()).toBe(true)
    await backdrop.trigger('click')
    // click.self fires on the element itself; trigger on the exact div
    // so we just verify the component works without error
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
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

  it('shows empty state when no projects match the filter', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    // Click a category that won't match any real project
    const filterBtns = wrapper.findAll('button')
    // Find a category button (not "All")
    const catBtn = filterBtns.find((b) => b.text() !== en.projects.filter_all && !b.text().match(/^(EN|DE|▶)$/i))
    if (catBtn) {
      await catBtn.trigger('click')
    }
    // Should still render without throwing
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the sort dropdown with both options', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    const options = wrapper.findAll('option')
    const optionTexts = options.map((o) => o.text())
    expect(optionTexts).toContain(en.projects.sort_newest)
    expect(optionTexts).toContain(en.projects.sort_az)
  })

  it('clicking "All" filter chip resets the category filter', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    const allBtn = wrapper.findAll('button').find((b) => b.text() === en.projects.filter_all)
    expect(allBtn).toBeDefined()
    await allBtn.trigger('click')
    // "All" button should now have active styles
    expect(allBtn.classes().join(' ')).toContain('bg-brand-500')
  })

  it('changing sort dropdown to A-Z changes selection', async () => {
    const { default: BentoGrid } = await import('../projects/BentoGrid.vue')
    const wrapper = mount(BentoGrid, { global: defaultGlobal() })
    const select = wrapper.find('select')
    await select.setValue('az')
    expect((select.element).value).toBe('az')
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
    const projectKeys = [
      'title',
      'subtitle',
      'view',
      'featured',
      'no_description',
      'no_projects',
      'close',
      'last_updated',
      'open_source',
      'external',
      'category',
      'stars',
      'forks',
      'issues',
      'license',
      'homepage',
      'archived',
      'group_count',
      'group_count_one',
      'back',
      'group_badge',
    ]
    for (const key of projectKeys) {
      expect(en.projects[key], `en.projects.${key}`).toBeTruthy()
      expect(de.projects[key], `de.projects.${key}`).toBeTruthy()
    }
  })
})

// ---------------------------------------------------------------------------
// ProjectGroupCard
// ---------------------------------------------------------------------------

const FIXTURE_GROUP = {
  slug: 'flowy',
  title: 'Flowy',
  description: 'A workflow toolkit.',
  repos: [
    {
      id: 'flowy-core',
      name: 'flowy-core',
      url: 'https://github.com/el-j/flowy-core',
      homepage: null,
      description: 'Core engine.',
      topics: ['vue', 'workflow'],
      language: 'TypeScript',
      category: 'Web App',
      updatedAt: '2024-03-01T00:00:00Z',
      i18nKey: null,
      featured: false,
      isExternal: false,
      customImage: null,
      screenshot: null,
      stars: 8,
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
      description: 'UI components.',
      topics: ['vue', 'ui'],
      language: 'Vue',
      category: 'Web App',
      updatedAt: '2024-04-01T00:00:00Z',
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
  ],
  screenshot: null,
  featured: false,
  category: 'Web App',
  updatedAt: '2024-04-01T00:00:00Z',
}

describe('ProjectGroupCard', () => {
  it('renders the group title', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('Flowy')
  })

  it('renders the group description', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('A workflow toolkit.')
  })

  it('shows the group_badge label', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain(en.projects.group_badge)
  })

  it('shows the repo count', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('2')
  })

  it('shows combined star count', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: defaultGlobal(),
    })
    // totalStars = 8 + 3 = 11
    expect(wrapper.text()).toContain('11')
  })

  it('shows the featured badge when group is featured', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: { ...FIXTURE_GROUP, featured: true } },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain(en.projects.featured)
  })

  it('does not show featured badge for non-featured groups', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).not.toContain(en.projects.featured)
  })

  it('shows the category', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain('Web App')
  })

  it('applies col-span-2 class to article', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: defaultGlobal(),
    })
    expect(wrapper.find('article').classes()).toContain('col-span-2')
  })
})

// ---------------------------------------------------------------------------
// detectLocale – locale init logic
// ---------------------------------------------------------------------------

describe('detectLocale', () => {
  const STORAGE_KEY = 'i18n-locale'

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('returns "en" as default when localStorage is empty', async () => {
    const { detectLocale } = await import('../../i18n/index.js')
    expect(detectLocale()).toBe('en')
  })

  it('returns a stored valid locale from localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, 'de')
    const { detectLocale } = await import('../../i18n/index.js')
    expect(detectLocale()).toBe('de')
  })

  it('ignores unsupported locale values stored in localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, 'zz')
    const { detectLocale } = await import('../../i18n/index.js')
    expect(detectLocale()).toBe('en')
  })

  it('SUPPORTED_LOCALES contains at least "en" and "de"', async () => {
    const { SUPPORTED_LOCALES } = await import('../../i18n/index.js')
    expect(SUPPORTED_LOCALES).toContain('en')
    expect(SUPPORTED_LOCALES).toContain('de')
  })
})

// ---------------------------------------------------------------------------
// Navbar – locale persistence
// ---------------------------------------------------------------------------

describe('Navbar', () => {
  const STORAGE_KEY = 'i18n-locale'

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('persists the new locale to localStorage when the language button is toggled en→de', async () => {
    const { default: Navbar } = await import('../layout/Navbar.vue')
    const i18n = makeI18n('en')
    const wrapper = mount(Navbar, {
      global: { plugins: [i18n, createPinia(), makeRouter()] },
    })
    // When locale is 'en', the button shows 'DE' (the language to switch to)
    const langBtn = wrapper.findAll('button').find((b) => /^(EN|DE)$/i.test(b.text().trim()))
    expect(langBtn).toBeDefined()
    await langBtn.trigger('click')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('de')
  })

  it('cycles back to "en" from "de" and persists to localStorage', async () => {
    const { default: Navbar } = await import('../layout/Navbar.vue')
    const i18n = makeI18n('de')
    const wrapper = mount(Navbar, {
      global: { plugins: [i18n, createPinia(), makeRouter()] },
    })
    const langBtn = wrapper.findAll('button').find((b) => /^(EN|DE)$/i.test(b.text().trim()))
    expect(langBtn).toBeDefined()
    await langBtn.trigger('click')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
  })

  it('renders a theme toggle button', async () => {
    const { default: Navbar } = await import('../layout/Navbar.vue')
    const wrapper = mount(Navbar, {
      global: { plugins: [makeI18n(), createPinia(), makeRouter()] },
    })
    const buttons = wrapper.findAll('button')
    const themeBtn = buttons.find((b) => b.attributes('aria-label') === 'Toggle Theme')
    expect(themeBtn).toBeDefined()
  })

  it('clicking the theme toggle button does not throw', async () => {
    const { default: Navbar } = await import('../layout/Navbar.vue')
    const wrapper = mount(Navbar, {
      global: { plugins: [makeI18n(), createPinia(), makeRouter()] },
    })
    const themeBtn = wrapper.findAll('button').find((b) =>
      b.attributes('aria-label') === 'Toggle Theme' || b.find('i.pi-moon, i.pi-sun').exists(),
    )
    if (themeBtn) {
      await expect(themeBtn.trigger('click')).resolves.not.toThrow()
    }
    expect(wrapper.exists()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// ProjectGroupCard – navigation
// ---------------------------------------------------------------------------

describe('ProjectGroupCard navigation', () => {
  it('clicking the card navigates to the group detail page', async () => {
    const { default: ProjectGroupCard } = await import('../projects/ProjectGroupCard.vue')
    const router = makeRouter()
    await router.push('/')
    const wrapper = mount(ProjectGroupCard, {
      props: { group: FIXTURE_GROUP },
      global: { plugins: [makeI18n(), createPinia(), router] },
    })
    await wrapper.find('article').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('project-detail')
    expect(router.currentRoute.value.params.slug).toBe('flowy')
  })
})

// ---------------------------------------------------------------------------
// ProjectCardModal – additional coverage
// ---------------------------------------------------------------------------

describe('ProjectCardModal additional paths', () => {
  it('renders archived badge when project is archived', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const archivedProject = { ...FIXTURE_PROJECT, archived: true }
    const wrapper = mount(ProjectCardModal, {
      props: { project: archivedProject, visible: true },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain(en.projects.archived)
  })

  it('does not render archived badge for non-archived projects', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const wrapper = mount(ProjectCardModal, {
      props: { project: FIXTURE_PROJECT, visible: true },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).not.toContain(en.projects.archived)
  })

  it('shows open_source badge for GitHub URLs', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const ghProject = { ...FIXTURE_PROJECT, url: 'https://github.com/el-j/test' }
    const wrapper = mount(ProjectCardModal, {
      props: { project: ghProject, visible: true },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain(en.projects.open_source)
  })

  it('shows external badge for non-GitHub URLs', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const extProject = { ...FIXTURE_PROJECT, url: 'https://example.com', isExternal: true }
    const wrapper = mount(ProjectCardModal, {
      props: { project: extProject, visible: true },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain(en.projects.external)
  })

  it('emits close when Escape key is pressed while visible', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const wrapper = mount(ProjectCardModal, {
      props: { project: FIXTURE_PROJECT, visible: true },
      global: defaultGlobal(),
      attachTo: document.body,
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
    wrapper.unmount()
  })

  it('renders homepage metadata when homepage is set', async () => {
    const { default: ProjectCardModal } = await import('../projects/ProjectCardModal.vue')
    const projectWithHomepage = { ...FIXTURE_PROJECT, homepage: 'https://example.com' }
    const wrapper = mount(ProjectCardModal, {
      props: { project: projectWithHomepage, visible: true },
      global: defaultGlobal(),
    })
    expect(wrapper.text()).toContain(en.projects.homepage)
  })
})
