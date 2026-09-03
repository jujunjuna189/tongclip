<script setup>
import { computed, onMounted } from 'vue'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const users = computed(() => store.leaderboard)

onMounted(() => store.loadLeaderboard())
</script>

<template>
  <AppShell>
    <section class="dark-card rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black">Top Leaderboard</h1>
          <p class="mt-2 text-white/50">Creator dengan pendapatan tertinggi bulan ini.</p>
        </div>
      </div>
      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <article v-for="user in users" :key="user.name" class="rounded-lg border border-white/10 bg-white/[.025] p-5">
          <div class="grid h-12 w-12 place-items-center rounded-lg bg-blue-500/20 text-xl font-black text-blue-100">{{ user.name[0] }}</div>
          <h2 class="mt-5 text-xl font-black">{{ user.name }}</h2>
          <p class="mt-1 text-white/46">{{ user.handle }}</p>
          <p class="mt-4 rounded-lg bg-white/[.05] px-3 py-2 text-xl font-bold text-blue-300">{{ user.income }}</p>
        </article>
      </div>
    </section>
  </AppShell>
</template>
