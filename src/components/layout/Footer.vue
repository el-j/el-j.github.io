<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <footer class="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-500">
      <p>
        {{ t('footer.made_with') }}
        <span class="text-red-400 mx-1">♥</span>
        {{ t('footer.and') }}
        <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="text-brand-400 hover:text-brand-300 transition-colors mx-1">Vue 3</a>
      </p>
      <p>© {{ new Date().getFullYear() }} el-j · {{ t('footer.rights') }}</p>
    </div>
  </footer>
</template>
