<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard from './ProjectCard.vue'
import ProjectCardModal from './ProjectCardModal.vue'
import type { Project } from '@/types/project'
import projectsData from '@/data/projects-generated.json'
import watermarkUrl from '@/assets/images/projects-watermark.svg'

const { t } = useI18n()

const allProjects = projectsData as Project[]

const selectedProject = ref<Project | null>(null)
const modalVisible = ref(false)
const watermarkStyle = { backgroundImage: `url(${watermarkUrl})` }

// ── Filters ─────────────────────────────────────────────────────────────────
const activeLanguage = ref<string | null>(null)
const showArchived = ref(false)

type SortKey = 'newest' | 'stars' | 'forks' | 'az'
const sortKey = ref<SortKey>('newest')

const sortOptions: { key: SortKey; labelKey: string }[] = [
  { key: 'newest', labelKey: 'projects.sort_newest' },
  { key: 'stars',  labelKey: 'projects.sort_stars' },
  { key: 'forks',  labelKey: 'projects.sort_forks' },
  { key: 'az',     labelKey: 'projects.sort_az' },
]

// Collect unique non-null languages
const languages = computed<string[]>(() => {
  const langs = new Set<string>()
  for (const p of allProjects) {
    if (p.language) langs.add(p.language)
  }
  return Array.from(langs).sort()
})

const projects = computed<Project[]>(() => {
  let list = allProjects.slice()

  if (!showArchived.value) {
    list = list.filter(p => !p.archived)
  }
  if (activeLanguage.value) {
    list = list.filter(p => p.language === activeLanguage.value)
  }

  list.sort((a, b) => {
    // Featured always first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1

    switch (sortKey.value) {
      case 'stars':
        return (b.stars ?? 0) - (a.stars ?? 0)
      case 'forks':
        return (b.forks ?? 0) - (a.forks ?? 0)
      case 'az':
        return a.name.localeCompare(b.name)
      case 'newest':
      default:
        if (a.updatedAt && b.updatedAt) return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        if (a.updatedAt) return -1
        if (b.updatedAt) return 1
        return 0
    }
  })

  return list
})

function openModal(project: Project) {
  selectedProject.value = project
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}
</script>

<template>
  <section id="projects" class="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
    <div class="absolute inset-0 -z-10 pointer-events-none opacity-70">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(147,51,234,.06),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,.05),transparent_40%)]" />
      <div class="absolute inset-0 bg-center bg-contain" :style="watermarkStyle" />
    </div>

    <!-- Section header -->
    <div class="mb-10 text-center">
      <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
        {{ t('projects.title') }}
      </h2>
      <p class="text-zinc-500 dark:text-zinc-500 text-base max-w-xl mx-auto">
        {{ t('projects.subtitle') }}
      </p>
    </div>

    <!-- Filter + Sort bar -->
    <div class="mb-8 flex flex-wrap items-center gap-3">
      <!-- Language filter chips -->
      <div class="flex flex-wrap gap-2">
        <button
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
            activeLanguage === null
              ? 'bg-brand-500 text-white border-brand-500'
              : 'text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-brand-400 hover:text-brand-400',
          ]"
          @click="activeLanguage = null"
        >
          {{ t('projects.filter_all') }}
        </button>
        <button
          v-for="lang in languages"
          :key="lang"
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
            activeLanguage === lang
              ? 'bg-brand-500 text-white border-brand-500'
              : 'text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-brand-400 hover:text-brand-400',
          ]"
          @click="activeLanguage = lang"
        >
          {{ lang }}
        </button>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Archived toggle -->
      <label class="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-500 dark:text-zinc-400 select-none">
        <input
          v-model="showArchived"
          type="checkbox"
          class="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-600 accent-brand-500"
        />
        {{ t('projects.filter_archived') }}
      </label>

      <!-- Sort dropdown -->
      <div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{{ t('projects.sort_label') }}:</span>
        <select
          v-model="sortKey"
          class="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none focus:border-brand-400 cursor-pointer"
        >
          <option
            v-for="opt in sortOptions"
            :key="opt.key"
            :value="opt.key"
          >
            {{ t(opt.labelKey) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!projects.length"
      class="flex flex-col items-center justify-center py-24 text-zinc-500 dark:text-zinc-600"
    >
      <i class="pi pi-box text-5xl mb-4 opacity-30" />
      <p class="text-sm">No projects match the current filters.</p>
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
