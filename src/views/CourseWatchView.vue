<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon, CheckCircleIcon, PlayCircleIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const route = useRoute()
const store = useClipperStore()
const loading = ref(false)
const activeLessonIndex = ref(Number(route.query.lesson || 0))
const course = computed(() => store.courses.find((item) => item.id === Number(route.params.id)))
const activeLesson = computed(() => course.value?.lessons?.[activeLessonIndex.value])

watch(() => route.query.lesson, (lesson) => {
  activeLessonIndex.value = Number(lesson || 0)
})

onMounted(async () => {
  loading.value = true
  try {
    await store.loadCourse(String(route.params.id))
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1280px]">
      <RouterLink :to="`/course-gratis/${route.params.id}`" class="inline-flex items-center gap-2 text-sm font-medium text-white/46 hover:text-white">
        <ArrowLeftIcon class="h-4 w-4" />
        Kembali ke detail course
      </RouterLink>

      <div v-if="course" class="mt-5 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section class="dark-card overflow-hidden rounded-lg">
          <video
            v-if="activeLesson?.video_url"
            class="aspect-video w-full bg-black"
            :src="activeLesson.video_url"
            controls
            autoplay
            playsinline
            preload="metadata"
          ></video>
          <div v-else class="grid aspect-video place-items-center bg-black text-sm text-white/42">
            Video belum tersedia.
          </div>
          <div class="border-t border-white/10 p-6">
            <div class="text-xs font-semibold uppercase tracking-[.14em] text-gradient-primary">{{ course.level }} • {{ course.duration }}</div>
            <h1 class="mt-3 text-3xl font-semibold tracking-[-.03em]">{{ activeLesson?.title || course.title }}</h1>
            <p class="mt-3 max-w-3xl text-sm leading-7 text-white/52">{{ course.description }}</p>
          </div>
        </section>

        <aside class="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <section class="dark-card rounded-lg p-5">
            <h2 class="text-lg font-semibold">Playlist</h2>
            <div class="mt-4 space-y-3">
              <button
                v-for="(lesson, index) in course.lessons || []"
                :key="lesson.title"
                class="flex w-full items-center justify-between rounded-lg border p-4 text-left transition"
                :class="activeLessonIndex === index ? 'border-purple-400/45 bg-purple-500/10' : 'border-white/10 bg-white/[.025] hover:border-purple-400/35'"
                @click="activeLessonIndex = index"
              >
                <div>
                  <div class="font-semibold">{{ lesson.title }}</div>
                  <div class="mt-1 text-xs text-white/42">{{ lesson.duration }}</div>
                </div>
                <PlayCircleIcon class="h-5 w-5 text-purple-300" />
              </button>
            </div>
          </section>

          <section class="dark-card rounded-lg p-5">
            <h2 class="text-lg font-semibold">Checklist</h2>
            <div class="mt-4 space-y-3 text-sm text-white/58">
              <div v-for="item in ['Tonton sampai selesai', 'Catat formula hook', 'Praktik di campaign aktif']" :key="item" class="flex items-center gap-3">
                <CheckCircleIcon class="h-5 w-5 text-purple-300" />
                {{ item }}
              </div>
            </div>
          </section>
        </aside>
      </div>

      <div v-else class="dark-card mt-5 grid h-72 place-items-center rounded-lg text-sm text-white/45">
        {{ loading ? 'Memuat video...' : 'Course tidak ditemukan.' }}
      </div>
    </div>
  </AppShell>
</template>
