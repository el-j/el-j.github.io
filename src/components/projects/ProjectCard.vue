<script setup>
import { computed, ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

const { t, te } = useI18n()

const cardRef = ref(null)
// Tilt is only applied to featured cards to keep mouse-tracking overhead low.
// useMouseInElement provides reactive values that are only re-evaluated on
// mouse moves over the target element, so the cost is proportional to
// how many featured cards are on screen (typically one or two).
const { elementX, elementY, isOutside, elementWidth, elementHeight } = useMouseInElement(cardRef)

const tiltStyle = computed(() => {
  if (!props.project.featured || isOutside.value) return {}
  const x = (elementY.value / elementHeight.value - 0.5) * 10
  const y = (elementX.value / elementWidth.value - 0.5) * -10
  return {
    transform: `perspective(800px) rotateX(${x}deg) rotateY(${y}deg) scale(1.02)`,
  }
})

const description = computed(() => {
  if (props.project.i18nKey) {
    const descKey = `${props.project.i18nKey}.desc`
    if (te(descKey)) return t(descKey)
  }
  return props.project.description || t('projects.no_description')
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
</script>

<template>
  <article
    ref="cardRef"
    :class="[
      'group relative glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col',
      project.featured ? 'col-span-2 row-span-2' : '',
    ]"
    :style="tiltStyle"
  >
    <!-- Featured badge -->
    <span
      v-if="project.featured"
      class="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-amber-400 bg-amber-400/15 border border-amber-400/25"
    >
      <i class="pi pi-star-fill text-[8px]" />
      {{ $t('projects.featured') }}
    </span>

    <!-- Card body -->
    <div class="flex flex-col flex-1 p-5 gap-4">
      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-zinc-100 truncate text-sm leading-snug">
            {{ project.name }}
          </h3>
          <!-- Language dot -->
          <div v-if="project.language" class="flex items-center gap-1.5 mt-1">
            <span :class="['w-2 h-2 rounded-full flex-shrink-0', langDot]" />
            <span class="text-[11px] text-zinc-500">{{ project.language }}</span>
          </div>
        </div>
        <!-- External link icon -->
        <a
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700/50 transition-all opacity-0 group-hover:opacity-100"
          :aria-label="$t('projects.view')"
          @click.stop
        >
          <i class="pi pi-external-link text-xs" />
        </a>
      </div>

      <!-- Description -->
      <p class="text-xs text-zinc-400 leading-relaxed flex-1 line-clamp-3">
        {{ description }}
      </p>

      <!-- Topics / Tech stack -->
      <div v-if="project.topics && project.topics.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="(topic, idx) in project.topics.slice(0, project.featured ? 8 : 4)"
          :key="topic"
          :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border', topicColor(idx)]"
        >
          {{ topic }}
        </span>
      </div>

      <!-- Footer: Updated at -->
      <div class="flex items-center justify-between pt-1 border-t border-zinc-800">
        <span v-if="project.updatedAt" class="text-[10px] text-zinc-600">
          {{ new Date(project.updatedAt).toLocaleDateString() }}
        </span>
        <a
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-brand-400 hover:text-brand-300 transition-colors ml-auto"
        >
          {{ $t('projects.view') }}
          <i class="pi pi-arrow-right text-[9px]" />
        </a>
      </div>
    </div>

    <!-- Hover glow overlay -->
    <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
         style="background: radial-gradient(circle at 50% 0%, rgba(59,130,246,0.06), transparent 70%)" />
  </article>
</template>
