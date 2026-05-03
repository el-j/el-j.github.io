<script setup>
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import HeroSection from './components/projects/HeroSection.vue'
import BentoGrid from './components/projects/BentoGrid.vue'
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
    <Navbar />

    <main>
      <HeroSection />
      <BentoGrid />
    </main>

    <Footer />
  </div>
</template>
