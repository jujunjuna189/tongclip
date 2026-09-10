<script setup>
import { computed, onMounted } from 'vue'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const courses = computed(() => store.courses)

onMounted(() => store.loadCourses())
</script>

<template>
  <AppShell>
    <h1 class="text-3xl font-black">Course Gratis</h1>
    <p class="mt-2 text-white/50">Materi belajar buat naikin performa clipper.</p>
    <div class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="course in courses" :key="course.id" class="dark-card overflow-hidden rounded-lg">
        <div class="h-44 bg-cover bg-center" :style="{ backgroundImage: `url(${course.image_url})` }"></div>
        <div class="p-5">
          <div class="flex items-center gap-2 text-xs font-semibold text-white/42">
            <span>{{ course.level }}</span>
            <span>•</span>
            <span>{{ course.duration }}</span>
          </div>
          <h2 class="mt-3 text-xl font-black">{{ course.title }}</h2>
          <p class="mt-2 min-h-16 text-sm leading-6 text-white/52">{{ course.description }}</p>
          <RouterLink
            :to="`/course-gratis/${course.id}`"
            class="mt-5 inline-flex rounded-lg bg-purple-500/20 px-4 py-2 text-sm font-black text-gradient-primary transition hover:bg-purple-500/30 hover:text-white"
          >
            Mulai Belajar
          </RouterLink>
        </div>
      </article>
    </div>
    <div v-if="!courses.length" class="dark-card mt-6 grid h-40 place-items-center rounded-lg text-sm text-white/45">
      Course belum tersedia.
    </div>
  </AppShell>
</template>
