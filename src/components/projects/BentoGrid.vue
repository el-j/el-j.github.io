<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard from './ProjectCard.vue'
import ProjectCardModal from './ProjectCardModal.vue'
import projectsData from '@/data/projects-generated.json'
import watermarkUrl from '@/assets/images/projects-watermark.svg'

const { t } = useI18n()

const projects = ref(projectsData)
const visible = ref(false)

const selectedProject = ref(null)
const modalVisible = ref(false)
const watermarkStyle = { backgroundImage: `url(${watermarkUrl})` }

function openModal(project) {
  selectedProject.value = project
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

onMounted(() => {
  // Trigger entrance animation after mount
  requestAnimationFrame(() => {
    visible.value = true
  })
})
</script>

<template>
  <section id="projects" class="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
    <div class="absolute inset-0 -z-10 pointer-events-none opacity-70">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(147,51,234,.06),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,.05),transparent_40%)]" />
      <div class="absolute inset-0 bg-center bg-contain" :style="watermarkStyle" />
    </div>
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
        @expand="openModal"
      />
    </TransitionGroup>

    <!-- Expanded card modal -->
    <ProjectCardModal
      v-if="selectedProject"
      :project="selectedProject"
      :visible="modalVisible"
      @close="closeModal"
    />
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
