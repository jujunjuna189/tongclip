<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  PlayCircleIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const route = useRoute()
const store = useClipperStore()
const loading = ref(false)
const course = computed(() => store.courses.find((item) => item.id === Number(route.params.id)))

const resourceLabel = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'Resource'
  }
}

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
    <div class="mx-auto max-w-[1240px]">
      <RouterLink to="/course-gratis" class="inline-flex items-center gap-2 text-sm font-medium text-white/46 hover:text-white">
        <ArrowLeftIcon class="h-4 w-4" />
        Kembali ke course gratis
      </RouterLink>

      <div v-if="course" class="mt-5 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section class="dark-card overflow-hidden rounded-lg">
          <div class="relative h-[420px] overflow-hidden bg-black/30">
            <div v-if="course.image_url" class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${course.image_url})` }"></div>
            <div v-else class="absolute inset-0 grid place-items-center bg-white/[.035] text-white/26">
              <PhotoIcon class="h-20 w-20 stroke-[1.4]" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div class="absolute bottom-7 left-7 right-7">
              <div class="flex items-center gap-2 text-xs font-semibold text-gradient-primary">
                <span>{{ course.level }}</span>
                <span>•</span>
                <span>{{ course.duration }}</span>
              </div>
              <h1 class="mt-3 max-w-3xl text-[38px] font-semibold leading-tight tracking-[-.03em]">{{ course.title }}</h1>
              <p class="mt-4 max-w-2xl text-sm leading-7 text-white/58">{{ course.description }}</p>
            </div>
          </div>

          <div class="p-6">
            <h2 class="text-xl font-semibold">Materi Course</h2>
            <div class="mt-5 space-y-3">
              <RouterLink
                v-for="(lesson, index) in course.lessons || []"
                :key="lesson.title"
                :to="`/course-gratis/${course.id}/watch?lesson=${index}`"
                class="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[.025] p-4 text-left transition hover:border-purple-400/35"
              >
                <div class="flex items-center gap-3">
                  <span class="grid h-8 w-8 place-items-center rounded-full bg-purple-500/15 text-xs font-semibold text-gradient-primary">{{ index + 1 }}</span>
                  <div>
                    <div class="font-semibold">{{ lesson.title }}</div>
                    <div class="mt-1 text-xs text-white/42">{{ lesson.duration }}</div>
                  </div>
                </div>
                <PlayCircleIcon class="h-6 w-6 text-purple-300" />
              </RouterLink>
            </div>
          </div>
        </section>

        <aside class="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <section class="dark-card rounded-lg p-5">
            <h2 class="text-lg font-semibold">Mulai Belajar</h2>
            <p class="mt-2 text-sm leading-6 text-white/48">Ikuti materi berurutan, lalu pakai checklist sebelum submit campaign.</p>
            <RouterLink :to="`/course-gratis/${course.id}/watch`" class="btn-blue mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold">
              <PlayCircleIcon class="h-5 w-5" />
              Putar Materi
            </RouterLink>
          </section>

          <section class="dark-card rounded-lg p-5">
            <h2 class="text-lg font-semibold">Resource</h2>
            <div class="mt-4 space-y-3">
              <a v-for="item in course.resources || []" :key="item" :href="item" target="_blank" rel="noreferrer" class="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[.025] p-4 text-left text-sm font-medium text-white/70 transition hover:border-purple-400/35 hover:text-white">
                <span class="min-w-0">
                  <span class="block text-xs font-semibold uppercase tracking-[.12em] text-white/34">{{ resourceLabel(item) }}</span>
                  <span class="mt-1 line-clamp-2 break-all text-sm leading-5 text-white/68">{{ item }}</span>
                </span>
                <DocumentArrowDownIcon class="ml-3 h-5 w-5 shrink-0 text-purple-300" />
              </a>
              <div v-if="!course.resources?.length" class="rounded-lg border border-white/10 bg-white/[.025] p-4 text-sm text-white/42">
                Resource belum tersedia.
              </div>
            </div>
          </section>

          <section class="dark-card rounded-lg p-5">
            <h2 class="text-lg font-semibold">Checklist</h2>
            <div class="mt-4 space-y-3 text-sm text-white/58">
              <div v-for="item in ['Tonton materi utama', 'Download resource', 'Praktik di 1 campaign']" :key="item" class="flex items-center gap-3">
                <CheckCircleIcon class="h-5 w-5 text-purple-300" />
                {{ item }}
              </div>
            </div>
          </section>
        </aside>
      </div>

      <div v-else class="dark-card mt-5 grid h-72 place-items-center rounded-lg text-sm text-white/45">
        {{ loading ? 'Memuat course...' : 'Course tidak ditemukan.' }}
      </div>
    </div>
  </AppShell>
</template>
