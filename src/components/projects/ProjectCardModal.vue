<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  project: {
    type: Object,
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

const languageColorMap = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-400',
  Vue: 'bg-emerald-400',
  Python: 'bg-blue-500',
  Rust: 'bg-orange-500',
  Go: 'bg-cyan-400',
  HTML: 'bg-red-400',
  CSS: 'bg-violet-400',
}

const langDot = computed(
  () => languageColorMap[props.project.language] || 'bg-zinc-400',
)

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
          v-if="visible"
          class="glass relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-700/50 shadow-2xl"
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
              <h2 class="text-lg font-bold text-zinc-100 truncate">
                {{ project.name }}
              </h2>
              <div v-if="project.language" class="flex items-center gap-1.5 mt-0.5">
                <span :class="['w-2 h-2 rounded-full flex-shrink-0', langDot]" />
                <span class="text-xs text-zinc-400">{{ project.language }}</span>
              </div>
            </div>
            <button
              class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-all"
              :aria-label="t('projects.close')"
              @click="emit('close')"
            >
              <i class="pi pi-times text-sm" />
            </button>
          </div>

          <!-- Screenshot / Image area -->
          <div class="px-5 pt-4">
            <div v-if="project.customImage" class="rounded-xl overflow-hidden">
              <img
                :src="project.customImage"
                :alt="project.name"
                class="w-full max-h-64 object-cover rounded-xl"
              />
            </div>
            <div
              v-else
              class="flex flex-col items-center justify-center gap-3 rounded-xl bg-zinc-800/50 border border-zinc-700/30 py-10"
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
          </div>

          <!-- Description -->
          <div class="px-5 pt-4">
            <p class="text-sm text-zinc-300 leading-relaxed">
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
          <div class="flex flex-wrap items-center gap-3 px-5 pt-4 text-xs text-zinc-500">
            <span v-if="project.updatedAt" class="inline-flex items-center gap-1">
              <i class="pi pi-calendar text-[10px]" />
              {{ t('projects.last_updated') }}:
              {{ new Date(project.updatedAt).toLocaleDateString() }}
            </span>
            <span v-if="project.language" class="inline-flex items-center gap-1.5">
              <span :class="['w-2 h-2 rounded-full', langDot]" />
              {{ project.language }}
            </span>
            <span
              :class="[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                hostname && hostname.includes('github.com')
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                  : 'bg-brand-500/15 text-brand-400 border-brand-500/25',
              ]"
            >
              <i :class="['pi text-[8px]', hostname && hostname.includes('github.com') ? 'pi-github' : 'pi-external-link']" />
              {{ hostname && hostname.includes('github.com') ? t('projects.open_source') : t('projects.external') }}
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
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-zinc-300 hover:text-zinc-100 text-sm font-medium transition-colors border border-zinc-700/50 hover:border-zinc-600/50"
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
