import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectDetailPage from '@/views/ProjectDetailPage.vue'

export function scrollBehavior(to: RouteLocationNormalized) {
  if (to.hash) {
    return { el: to.hash, behavior: 'smooth' as const }
  }
  return { top: 0 }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: ProjectDetailPage,
      props: true,
    },
  ],
  scrollBehavior,
})

export default router
