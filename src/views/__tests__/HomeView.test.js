/**
 * src/views/__tests__/HomeView.test.js
 *
 * Smoke test for the HomeView.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

import en from '../../locales/en.json'
import de from '../../locales/de.json'

function makeI18n() {
  return createI18n({ legacy: false, locale: 'en', fallbackLocale: 'en', messages: { en, de } })
}

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/projects/:slug', component: { template: '<div />' }, props: true },
    ],
  })
}

describe('HomeView', () => {
  it('mounts without errors', async () => {
    const { default: HomeView } = await import('../HomeView.vue')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [makeI18n(), createPinia(), makeRouter()],
        stubs: {
          Button: { template: '<button><slot /></button>' },
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the HeroSection h1 greeting', async () => {
    const { default: HomeView } = await import('../HomeView.vue')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [makeI18n(), createPinia(), makeRouter()],
        stubs: {
          Button: { template: '<button><slot /></button>' },
        },
      },
    })
    expect(wrapper.find('h1').text()).toBe(en.hero.greeting)
  })

  it('renders the BentoGrid section title', async () => {
    const { default: HomeView } = await import('../HomeView.vue')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [makeI18n(), createPinia(), makeRouter()],
        stubs: {
          Button: { template: '<button><slot /></button>' },
        },
      },
    })
    expect(wrapper.find('h2').text()).toBe(en.projects.title)
  })
})
