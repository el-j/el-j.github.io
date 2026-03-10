<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    <!-- Background gradient blobs -->
    <div class="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl" />
      <div class="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/5 blur-3xl" />
    </div>

    <!-- Grid pattern overlay -->
    <div
      class="absolute inset-0 -z-10 opacity-[0.03]"
      style="background-image: linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px); background-size: 60px 60px"
      aria-hidden="true"
    />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-brand-400 bg-brand-500/10 border border-brand-500/20 mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        Open Source
      </div>

      <!-- Heading -->
      <h1 class="text-5xl sm:text-7xl font-bold tracking-tight text-zinc-100 mb-6 leading-[1.1]">
        {{ t('hero.greeting') }}
      </h1>

      <p class="text-xl sm:text-2xl font-medium text-zinc-400 mb-4 max-w-2xl mx-auto">
        {{ t('hero.role') }}
      </p>

      <p class="text-base text-zinc-500 mb-10 max-w-lg mx-auto">
        {{ t('hero.description') }}
      </p>

      <!-- CTAs -->
      <div class="flex flex-wrap items-center justify-center gap-3">
        <a
          href="#projects"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-brand-500 text-white hover:bg-brand-600 glow transition-all duration-200 hover:scale-105"
        >
          <i class="pi pi-th-large text-xs" />
          {{ t('hero.cta_projects') }}
        </a>
        <a
          href="https://github.com/el-j"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm glass text-zinc-100 hover:glass-hover transition-all duration-200 hover:scale-105"
        >
          <i class="pi pi-github text-xs" />
          {{ t('hero.cta_github') }}
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-600 animate-bounce">
      <i class="pi pi-chevron-down text-xs" />
    </div>
  </section>
</template>
