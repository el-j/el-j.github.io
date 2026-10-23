/**
 * src/router/__tests__/router.test.ts
 *
 * Unit tests for the Vue Router configuration.
 */

import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'

import router, { scrollBehavior } from '../index'

describe('Router configuration', () => {
  it('has a route for the home path "/"', () => {
    const routes = router.getRoutes()
    const home = routes.find((r) => r.path === '/')
    expect(home).toBeDefined()
    expect(home?.name).toBe('home')
  })

  it('has a route for "/projects/:slug"', () => {
    const routes = router.getRoutes()
    const detail = routes.find((r) => r.path === '/projects/:slug')
    expect(detail).toBeDefined()
    expect(detail?.name).toBe('project-detail')
  })

  it('project-detail route has props: true', () => {
    const routes = router.getRoutes()
    const detail = routes.find((r) => r.name === 'project-detail')
    expect(detail?.props).toBeTruthy()
  })

  it('resolves "/" to the home route', async () => {
    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes: router.getRoutes(),
    })
    await testRouter.push('/')
    expect(testRouter.currentRoute.value.name).toBe('home')
  })

  it('resolves "/projects/flowy" to the project-detail route', async () => {
    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes: router.getRoutes(),
    })
    await testRouter.push('/projects/flowy')
    expect(testRouter.currentRoute.value.name).toBe('project-detail')
    expect(testRouter.currentRoute.value.params.slug).toBe('flowy')
  })
})

// ---------------------------------------------------------------------------
// scrollBehavior – direct unit tests
// ---------------------------------------------------------------------------

describe('scrollBehavior', () => {
  it('returns { el, behavior: smooth } when route has a hash', () => {
    const to = { hash: '#projects' } as any
    const result = scrollBehavior(to)
    expect(result).toEqual({ el: '#projects', behavior: 'smooth' })
  })

  it('returns { top: 0 } when route has no hash', () => {
    const to = { hash: '' } as any
    const result = scrollBehavior(to)
    expect(result).toEqual({ top: 0 })
  })

  it('returns { top: 0 } when route hash is undefined', () => {
    const to = {} as any
    const result = scrollBehavior(to)
    expect(result).toEqual({ top: 0 })
  })
})

