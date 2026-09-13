<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  ArrowRightIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlayCircleIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const courses = computed(() => store.courses)
const fallbackImage = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80'
const loading = ref(false)
const search = ref('')
const selectedLevel = ref('Semua')

const levels = computed(() => [
  'Semua',
  ...Array.from(new Set(courses.value.map((course) => course.level).filter(Boolean))),
])
const totalLessons = computed(() => courses.value.reduce((total, course) => total + (course.lessons?.length || 1), 0))
const filteredCourses = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return courses.value.filter((course) => {
    const matchesLevel = selectedLevel.value === 'Semua' || course.level === selectedLevel.value
    const matchesKeyword = !keyword
      || course.title.toLowerCase().includes(keyword)
      || course.description.toLowerCase().includes(keyword)

    return matchesLevel && matchesKeyword
  })
})

onMounted(async () => {
  loading.value = true
  try {
    await store.loadCourses()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppShell>
    <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
      <div class="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <h1 class="text-[30px] font-semibold leading-tight text-white md:text-[36px]">Course Gratis</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            Materi singkat untuk memperbaiki hook, editing, caption, dan workflow submit campaign.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Total Course</div>
            <div class="mt-2 text-2xl font-semibold text-white/90">{{ courses.length }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Total Materi</div>
            <div class="mt-2 text-2xl font-semibold text-white/90">{{ totalLessons }}</div>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-3 lg:grid-cols-[1fr_auto]">
        <label class="relative block">
          <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-[24px] h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            v-model="search"
            class="form-control !mt-0 !pl-11"
            placeholder="Cari course, topik, atau skill"
            type="search"
          />
        </label>
        <div class="flex gap-2 overflow-x-auto pb-1 lg:justify-end lg:pb-0">
          <button
            v-for="level in levels"
            :key="level"
            class="h-11 shrink-0 rounded-lg px-4 text-sm font-semibold transition"
            :class="selectedLevel === level ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white shadow-blue' : 'border border-white/[.08] bg-white/[.045] text-white/58 hover:bg-white/[.075] hover:text-white'"
            type="button"
            @click="selectedLevel = level"
          >
            {{ level }}
          </button>
        </div>
      </div>
    </section>

    <div v-if="loading" class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="index in 3" :key="index" class="h-[360px] animate-pulse rounded-lg border border-white/[.08] bg-white/[.035]"></div>
    </div>

    <div v-else-if="filteredCourses.length" class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="course in filteredCourses"
        :key="course.id"
        class="group overflow-hidden rounded-lg border border-white/[.08] bg-white/[.025] transition hover:-translate-y-0.5 hover:border-purple-300/30 hover:bg-white/[.04]"
      >
        <RouterLink :to="`/course-gratis/${course.id}`" class="block">
          <div class="relative aspect-[16/9] overflow-hidden bg-black">
            <div
              class="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
              :style="{ backgroundImage: `url(${course.image_url || fallbackImage})` }"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent"></div>
            <div class="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/78 backdrop-blur">
              <PlayCircleIcon class="h-4 w-4 text-purple-200" />
              {{ course.lessons?.length || 1 }} materi
            </div>
            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              <span class="rounded-full bg-purple-500/18 px-3 py-1 text-xs font-semibold text-purple-100">{{ course.level || 'Pemula' }}</span>
              <span class="inline-flex items-center gap-1.5 text-xs font-medium text-white/68">
                <ClockIcon class="h-4 w-4" />
                {{ course.duration || '-' }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <h2 class="line-clamp-2 min-h-14 text-xl font-semibold leading-7 text-white/92">{{ course.title }}</h2>
            <p class="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-white/50">{{ course.description }}</p>
            <div class="mt-5 flex items-center justify-between border-t border-white/[.08] pt-4">
              <span class="text-sm font-semibold text-gradient-primary">Mulai Belajar</span>
              <span class="btn-blue grid h-9 w-9 place-items-center rounded-lg text-white transition">
                <ArrowRightIcon class="h-4 w-4" />
              </span>
            </div>
          </div>
        </RouterLink>
      </article>
    </div>

    <div v-else class="mt-6 grid min-h-56 place-items-center rounded-lg border border-white/[.08] bg-white/[.025] p-6 text-center">
      <div>
        <div class="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-white/[.055] text-white/50">
          <PlayCircleIcon class="h-6 w-6" />
        </div>
        <h2 class="mt-4 text-base font-semibold text-white/82">Course belum ditemukan</h2>
        <p class="mt-2 text-sm text-white/42">{{ courses.length ? 'Coba ubah pencarian atau filter level.' : 'Course belum tersedia.' }}</p>
      </div>
    </div>
  </AppShell>
</template>
