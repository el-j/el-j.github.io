<script setup>
import { ref, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from '@/i18n/index.js'

const { locale } = useI18n()
const isDark = useDark({ selector: 'html' })
const toggleDark = useToggle(isDark)

function toggleLang() {
  const idx = SUPPORTED_LOCALES.indexOf(locale.value)
  locale.value = SUPPORTED_LOCALES[(idx + 1) % SUPPORTED_LOCALES.length]
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale.value)
  } catch { /* SecurityError in sandboxed contexts – ignore */ }
}

const isScrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo -->
      <a href="#" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight hover:text-brand-400 transition-colors">
        el-j
      </a>

      <!-- Nav links -->
      <ul class="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        <li>
          <a href="#projects" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{{ $t('nav.projects') }}</a>
        </li>
        <li>
          <a href="https://github.com/el-j" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            {{ $t('nav.about') }}
          </a>
        </li>
      </ul>

      <!-- Controls -->
      <div class="flex items-center gap-2">
        <!-- Language toggle -->
        <button
          @click="toggleLang"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all uppercase tracking-wider"
          :aria-label="$t('nav.toggle_lang')"
        >
          {{ locale === 'en' ? 'DE' : 'EN' }}
        </button>

        <!-- Dark mode toggle -->
        <button
          @click="toggleDark()"
          class="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          :aria-label="$t('nav.toggle_theme')"
        >
          <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-sm" />
        </button>
      </div>
    </nav>
  </header>
</template>
