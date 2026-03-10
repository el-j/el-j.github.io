<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard from './ProjectCard.vue'
import projectsData from '@/data/projects-generated.json'

const { t } = useI18n()

const projects = ref(projectsData)
const visible = ref(false)

onMounted(() => {
  // Trigger entrance animation after mount
  requestAnimationFrame(() => {
    visible.value = true
  })
})
</script>

<template>
  <section id="projects" class="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- Section header -->
    <div class="mb-12 text-center">
      <h2 class="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">
        {{ t('projects.title') }}
      </h2>
      <p class="text-zinc-500 text-base max-w-xl mx-auto">
        {{ t('projects.subtitle') }}
      </p>
    </div>

    <!-- Empty state -->
    <div
      v-if="!projects.length"
      class="flex flex-col items-center justify-center py-24 text-zinc-600"
    >
      <i class="pi pi-box text-5xl mb-4 opacity-30" />
      <p class="text-sm">No projects available yet. Run <code class="font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded">npm run fetch-projects</code> to populate.</p>
    </div>

    <!-- Bento Grid -->
    <TransitionGroup
      v-else
      tag="div"
      name="bento"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]"
    >
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </TransitionGroup>
  </section>
</template>

<style scoped>
.bento-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.bento-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}
.bento-leave-active {
  transition: all 0.3s ease;
}
.bento-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.bento-move {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
