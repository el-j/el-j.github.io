<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { buildScreenshotUrl } from '@/utils/screenshot'
import { languageColorMap } from '@/utils/metadata'
import watermarkUrl from '@/assets/images/projects-watermark.svg'
import type { Project } from '@/types/project'

const props = defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const { t, te } = useI18n()

const description = computed(() => {
  if (props.project.i18nKey) {
    const descKey = `${props.project.i18nKey}.desc`
    if (te(descKey)) return t(descKey)
  }
  return props.project.description || t('projects.no_description')
})

const hostname = computed(() => {
  try {
    return new URL(props.project.url).hostname
  } catch {
    return ''
  }
})

const faviconUrl = computed(
  () => `https://www.google.com/s2/favicons?domain=${hostname.value}&sz=32`,
)

const coverImage = computed(() => {
  if (props.project.customImage) return props.project.customImage
  if (props.project.screenshot) return props.project.screenshot
  return buildScreenshotUrl(props.project.homepage || props.project.url)
})

const topicColors = [
  'bg-brand-500/15 text-brand-400 border-brand-500/25',
  'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'bg-rose-500/15 text-rose-400 border-rose-500/25',
  'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
]

function topicColor(index) {
  return topicColors[index % topicColors.length]
}

const langDot = computed(
  () => languageColorMap[props.project.language] || 'bg-zinc-400',
)

const isGitHub = computed(() => {
  const h = hostname.value
  return h === 'github.com' || h.endsWith('.github.com') || h.endsWith('.github.io')
})

const statChips = computed(() => {
  const chips = []
  if (props.project.stars != null && props.project.stars > 0) {
    chips.push({ icon: 'pi pi-star-fill text-amber-400', label: props.project.stars, aria: t('projects.stars') })
  }
  if (props.project.forks != null && props.project.forks > 0) {
    chips.push({ icon: 'pi pi-code-branch text-cyan-300', label: props.project.forks, aria: t('projects.forks') })
  }
  if (props.project.license) {
    chips.push({ icon: 'pi pi-shield', label: props.project.license, aria: t('projects.license') })
  }
  return chips
})

const watermarkStyle = computed(() => ({
  backgroundImage: `url(${watermarkUrl})`,
}))

function onEscape(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onEscape))
onUnmounted(() => document.removeEventListener('keydown', onEscape))
</script>

<template>
  <Transition name="modal">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px)"
      @click.self="emit('close')"
    >
      <!-- Modal content -->
      <Transition name="modal-content" appear>
        <div
          class="glass relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-700/50 shadow-2xl"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 p-5 pb-0">
            <img
              :src="faviconUrl"
              :alt="project.name"
              class="w-8 h-8 rounded-lg flex-shrink-0"
              loading="lazy"
            />
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {{ project.name }}
              </h2>
              <div v-if="project.language" class="flex items-center gap-1.5 mt-0.5">
                <span :class="['w-2 h-2 rounded-full flex-shrink-0', langDot]" />
                <span class="text-xs text-zinc-500 dark:text-zinc-400">{{ project.language }}</span>
              </div>
            </div>
            <button
              class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-700/50 transition-all"
              :aria-label="t('projects.close')"
              @click="emit('close')"
            >
              <i class="pi pi-times text-sm" />
            </button>
          </div>

          <!-- Screenshot / Image area -->
          <div class="px-5 pt-4">
            <div class="relative rounded-xl overflow-hidden bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60">
              <img
                v-if="coverImage"
                :src="coverImage"
                :alt="project.name"
                class="w-full max-h-64 object-cover rounded-xl"
              />
              <div
                v-else
                class="flex flex-col items-center justify-center gap-3 rounded-xl py-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(147,51,234,.06),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,.05),transparent_35%)]"
              >
                <img
                  :src="faviconUrl"
                  :alt="project.name"
                  class="w-16 h-16 rounded-xl opacity-60"
                  loading="lazy"
                />
                <span class="text-xs text-zinc-500 truncate max-w-full px-4">
                  {{ project.url }}
                </span>
              </div>
              <div class="absolute inset-0 bg-center bg-cover opacity-[0.12]" :style="watermarkStyle" />
            </div>
          </div>

          <!-- Description -->
          <div class="px-5 pt-4">
            <p class="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {{ description }}
            </p>
          </div>

          <!-- Topics -->
          <div v-if="project.topics && project.topics.length" class="px-5 pt-4">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(topic, idx) in project.topics"
                :key="topic"
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
                  topicColor(idx),
                ]"
              >
                {{ topic }}
              </span>
            </div>
          </div>

          <!-- Metadata row -->
          <div class="flex flex-wrap items-center gap-3 px-5 pt-4 text-xs text-zinc-500 dark:text-zinc-500">
            <span v-if="project.updatedAt" class="inline-flex items-center gap-1">
              <i class="pi pi-calendar text-[10px]" />
              {{ t('projects.last_updated') }}:
              {{ new Date(project.updatedAt).toLocaleDateString() }}
            </span>
            <span v-if="project.language" class="inline-flex items-center gap-1.5">
              <span :class="['w-2 h-2 rounded-full', langDot]" />
              {{ project.language }}
            </span>
            <span v-if="project.homepage" class="inline-flex items-center gap-1">
              <i class="pi pi-desktop text-[10px]" />
              {{ t('projects.homepage') }}
            </span>
            <span
              :class="[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                isGitHub
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                  : 'bg-brand-500/15 text-brand-400 border-brand-500/25',
              ]"
            >
              <i :class="['pi text-[8px]', isGitHub ? 'pi-github' : 'pi-external-link']" />
              {{ isGitHub ? t('projects.open_source') : t('projects.external') }}
            </span>
            <span
              v-if="project.archived"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-amber-500/40 text-amber-300/90 bg-amber-500/10"
            >
              <i class="pi pi-box text-[9px]" />
              {{ t('projects.archived') }}
            </span>
          </div>

          <div v-if="statChips.length" class="flex flex-wrap gap-2 px-5 pt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span
              v-for="chip in statChips"
              :key="chip.icon + chip.label"
              :aria-label="chip.aria"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80"
            >
              <i :class="['text-[11px]', chip.icon]" aria-hidden="true" />
              <span class="font-semibold text-zinc-700 dark:text-zinc-100">{{ chip.label }}</span>
            </span>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center gap-3 p-5">
            <a
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              <i class="pi pi-external-link text-xs" />
              {{ t('projects.view') }}
            </a>
            <button
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm font-medium transition-colors border border-zinc-300/50 dark:border-zinc-700/50 hover:border-zinc-400/50 dark:hover:border-zinc-600/50"
              @click="emit('close')"
            >
              {{ t('projects.close') }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop fade */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Modal content scale + fade */
.modal-content-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-content-leave-active {
  transition: all 0.2s ease;
}
.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
