<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { buildScreenshotUrl } from '@/utils/screenshot'
import type { ProjectGroup } from '@/types/projectGroup'
import projectGroupsData from '@/data/project-groups-generated.json'
import watermarkUrl from '@/assets/images/projects-watermark.svg'

const props = defineProps<{ slug: string }>()

const { t } = useI18n()
const router = useRouter()

const allGroups = projectGroupsData as ProjectGroup[]

const group = computed<ProjectGroup | null>(
  () => allGroups.find((g) => g.slug === props.slug) ?? null,
)

const totalStars = computed(() =>
  group.value?.repos.reduce((sum, r) => sum + (r.stars ?? 0), 0) ?? 0,
)

const totalForks = computed(() =>
  group.value?.repos.reduce((sum, r) => sum + (r.forks ?? 0), 0) ?? 0,
)

const coverImage = computed(() => {
  if (!group.value) return null
  return group.value.screenshot ?? buildScreenshotUrl(group.value.repos[0]?.homepage ?? group.value.repos[0]?.url)
})

const watermarkStyle = { backgroundImage: `url(${watermarkUrl})` }

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <!-- Back link -->
    <button
      class="inline-flex items-center gap-2 mb-10 text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-400 transition-colors"
      @click="goBack"
    >
      {{ t('projects.back') }}
    </button>

    <!-- 404-style fallback -->
    <div
      v-if="!group"
      class="flex flex-col items-center justify-center py-24 text-zinc-500 dark:text-zinc-600"
    >
      <i class="pi pi-box text-5xl mb-4 opacity-30" />
      <p class="text-sm">{{ t('projects.no_projects') }}</p>
    </div>

    <template v-else>
      <!-- Group hero -->
      <div class="relative rounded-2xl overflow-hidden mb-10 glass">
        <!-- Cover image -->
        <div class="relative h-48 sm:h-64 bg-zinc-200/80 dark:bg-zinc-900/80 overflow-hidden">
          <img
            v-if="coverImage"
            :src="coverImage"
            :alt="group.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            v-else
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(147,51,234,.06),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,.05),transparent_35%)]"
          />
          <div class="absolute inset-0 bg-center bg-contain opacity-[0.08]" :style="watermarkStyle" />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
        </div>

        <!-- Group info -->
        <div class="p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 mb-2"
              >
                <i class="pi pi-objects-column text-[9px]" />
                {{ t('projects.group_badge') }}
              </span>
              <h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {{ group.title }}
              </h1>
              <p v-if="group.description" class="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
                {{ group.description }}
              </p>
            </div>

            <!-- Stats rollup -->
            <div class="flex gap-3 text-sm">
              <span
                v-if="totalStars > 0"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-200"
              >
                <i class="pi pi-star-fill text-amber-400 text-xs" />
                <span class="font-semibold">{{ totalStars }}</span>
              </span>
              <span
                v-if="totalForks > 0"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-200"
              >
                <i class="pi pi-code-branch text-cyan-300 text-xs" />
                <span class="font-semibold">{{ totalForks }}</span>
              </span>
            </div>
          </div>

          <!-- Category + repo count -->
          <div class="flex flex-wrap items-center gap-3 mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span v-if="group.category" class="inline-flex items-center gap-1">
              <i class="pi pi-tag text-[9px] text-brand-400" />
              {{ group.category }}
            </span>
            <span class="inline-flex items-center gap-1">
              <i class="pi pi-box text-[9px]" />
              {{ group.repos.length === 1 ? t('projects.group_count_one', { n: 1 }) : t('projects.group_count', { n: group.repos.length }) }}
            </span>
            <span v-if="group.updatedAt" class="inline-flex items-center gap-1">
              <i class="pi pi-calendar text-[9px]" />
              {{ new Date(group.updatedAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Constituent repos -->
      <div class="space-y-4">
        <a
          v-for="repo in group.repos"
          :key="repo.id"
          :href="repo.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block glass rounded-xl p-5 hover:scale-[1.01] transition-all duration-200"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h2 class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm truncate">
                {{ repo.name }}
              </h2>
              <p v-if="repo.description" class="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {{ repo.description }}
              </p>
            </div>
            <i class="pi pi-external-link text-xs text-zinc-400 flex-shrink-0 mt-0.5" />
          </div>

          <div class="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span v-if="repo.language" class="inline-flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-brand-400" />
              {{ repo.language }}
            </span>
            <span v-if="repo.stars && repo.stars > 0" class="inline-flex items-center gap-1">
              <i class="pi pi-star-fill text-amber-400 text-[10px]" />
              {{ repo.stars }}
            </span>
            <span v-if="repo.license" class="inline-flex items-center gap-1">
              <i class="pi pi-shield text-[10px]" />
              {{ repo.license }}
            </span>
          </div>
        </a>
      </div>
    </template>
  </div>
</template>
