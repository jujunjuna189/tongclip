<script setup>
import { computed, onMounted } from 'vue'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const announcements = computed(() => store.announcements)

onMounted(() => store.loadAnnouncements())
</script>

<template>
  <AppShell>
    <h1 class="text-3xl font-black">Announcement</h1>
    <div class="mt-6 space-y-4">
      <article v-for="item in announcements" :key="item.title" class="dark-card rounded-lg p-6">
        <h2 class="text-xl font-black">{{ item.title }}</h2>
        <p class="mt-3 leading-7 text-white/54">{{ item.body }}</p>
      </article>
    </div>
  </AppShell>
</template>
