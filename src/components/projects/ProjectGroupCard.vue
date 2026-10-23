<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { buildScreenshotUrl } from '@/utils/screenshot'
import type { ProjectGroup } from '@/types/projectGroup'
import watermarkUrl from '@/assets/images/projects-watermark.svg'

const props = defineProps<{ group: ProjectGroup }>()

const { t } = useI18n()
const router = useRouter()

const coverImage = computed(
  () =>
    props.group.screenshot ??
    buildScreenshotUrl(props.group.repos[0]?.homepage ?? props.group.repos[0]?.url),
)

const watermarkStyle = { backgroundImage: `url(${watermarkUrl})` }

const totalStars = computed(() =>
  props.group.repos.reduce((sum, r) => sum + (r.stars ?? 0), 0),
)

const topicColors = [
  'bg-brand-500/15 text-brand-400 border-brand-500/25',
  'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'bg-rose-500/15 text-rose-400 border-rose-500/25',
  'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
]

function topicColor(index: number) {
  return topicColors[index % topicColors.length]
}

const allTopics = computed(() => {
  const seen = new Set<string>()
  const topics: string[] = []
  for (const repo of props.group.repos) {
    for (const t of repo.topics ?? []) {
      if (!seen.has(t)) {
        seen.add(t)
        topics.push(t)
      }
    }
  }
  return topics.slice(0, 5)
})

function navigate() {
  router.push({ name: 'project-detail', params: { slug: props.group.slug } })
}
</script>

<template>
  <article
    data-testid="group-card"
    class="group relative glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col hover:scale-[1.02] hover:glow-sm col-span-2"
    @click="navigate"
  >
    <!-- Group badge -->
    <span
      class="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-brand-400 bg-brand-500/15 border border-brand-500/25"
    >
      <i class="pi pi-objects-column text-[8px]" />
      {{ t('projects.group_badge') }}
    </span>

    <!-- Featured badge -->
    <span
      v-if="group.featured"
      class="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-amber-400 bg-amber-400/15 border border-amber-400/25"
    >
      <i class="pi pi-star-fill text-[8px]" />
      {{ t('projects.featured') }}
    </span>

    <!-- Screenshot -->
    <div class="relative w-full h-32 overflow-hidden bg-zinc-200/80 dark:bg-zinc-900/80">
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="group.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div
        v-else
        class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(147,51,234,.06),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,.05),transparent_35%)]"
      />
      <div class="absolute inset-0 bg-center bg-cover opacity-[0.08]" :style="watermarkStyle" />
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
    </div>

    <!-- Card body -->
    <div class="flex flex-col flex-1 p-5 gap-4">
      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-sm leading-snug">
            {{ group.title }}
          </h3>
          <div v-if="group.category" class="flex items-center gap-1.5 mt-1">
            <i class="pi pi-tag text-[9px] text-brand-400" aria-hidden="true" />
            <span class="text-[11px] text-zinc-500 dark:text-zinc-500">{{ group.category }}</span>
          </div>
        </div>
        <i class="pi pi-arrow-right text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
      </div>

      <!-- Description -->
      <p
        v-if="group.description"
        class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 line-clamp-2"
      >
        {{ group.description }}
      </p>

      <!-- Repo count + stars -->
      <div class="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span class="inline-flex items-center gap-1">
          <i class="pi pi-box text-[10px]" />
          {{ group.repos.length === 1 ? t('projects.group_count_one', { n: 1 }) : t('projects.group_count', { n: group.repos.length }) }}
        </span>
        <span v-if="totalStars > 0" class="inline-flex items-center gap-1">
          <i class="pi pi-star-fill text-amber-400 text-[10px]" />
          {{ totalStars }}
        </span>
      </div>

      <!-- Topics -->
      <div v-if="allTopics.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="(topic, idx) in allTopics"
          :key="topic"
          :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border', topicColor(idx)]"
        >
          {{ topic }}
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-1 border-t border-zinc-200 dark:border-zinc-800">
        <span v-if="group.updatedAt" class="text-[10px] text-zinc-400 dark:text-zinc-600">
          {{ new Date(group.updatedAt).toLocaleDateString() }}
        </span>
        <span
          class="inline-flex items-center gap-1 text-[11px] font-medium text-brand-400 group-hover:text-brand-300 transition-colors ml-auto"
        >
          {{ t('projects.view') }}
          <i class="pi pi-arrow-right text-[9px] transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>

    <!-- Hover glow overlay -->
    <div
      class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style="background: radial-gradient(circle at 50% 0%, rgba(59,130,246,0.06), transparent 70%)"
    />
  </article>
</template>
