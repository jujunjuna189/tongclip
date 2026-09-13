<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  PlayCircleIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const courses = computed(() => store.courses)
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
    <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-5">
      <div class="grid gap-4 xl:grid-cols-[1fr_300px]">
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.02em] text-white md:text-[28px]">Course Gratis</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-white/52">
            Materi singkat untuk memperbaiki hook, editing, caption, dan workflow submit campaign.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-3">
            <div class="text-xs font-medium text-white/38">Total Course</div>
            <div class="mt-1 text-2xl font-semibold text-white/90">{{ courses.length }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-3">
            <div class="text-xs font-medium text-white/38">Total Materi</div>
            <div class="mt-1 text-2xl font-semibold text-white/90">{{ totalLessons }}</div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap items-center gap-3">
        <label class="flex h-11 min-w-72 items-center gap-3 rounded-lg border border-white/10 bg-white/[.045] px-4">
          <MagnifyingGlassIcon class="h-4 w-4 shrink-0 text-white/35" />
          <input v-model="search" class="h-full min-w-0 flex-1 bg-transparent text-[13px] font-medium text-white outline-none placeholder:text-white/42" placeholder="Cari course atau topik..." />
        </label>
        <button class="inline-flex h-11 items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/[.055] px-4 text-[13px] font-medium text-purple-100 hover:border-purple-400/45 hover:text-white">
          <FunnelIcon class="h-4 w-4 stroke-[1.8]" />
          Filter
        </button>
        <div class="relative">
          <select v-model="selectedLevel" class="h-11 min-w-36 appearance-none rounded-lg border border-white/10 bg-white/[.045] px-4 pr-9 text-[13px] font-medium text-white/78 outline-none hover:border-purple-400/45">
            <option v-for="level in levels" :key="level" :value="level" class="bg-black">{{ level === 'Semua' ? 'Semua level' : level }}</option>
          </select>
          <ChevronDownIcon class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 stroke-[2] text-white/58" />
        </div>
      </div>
    </section>

    <div v-if="loading" class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="index in 3" :key="index" class="h-[320px] animate-pulse rounded-lg border border-white/[.08] bg-white/[.035]"></div>
    </div>

    <div v-else-if="filteredCourses.length" class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="course in filteredCourses"
        :key="course.id"
        class="group overflow-hidden rounded-lg border border-white/[.08] bg-white/[.025] transition hover:-translate-y-0.5 hover:border-purple-300/30 hover:bg-white/[.04]"
      >
        <RouterLink :to="`/course-gratis/${course.id}`" class="block">
          <div class="relative aspect-[16/9] overflow-hidden bg-black">
            <div
              v-if="course.image_url"
              class="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
              :style="{ backgroundImage: `url(${course.image_url})` }"
            ></div>
            <div v-else class="absolute inset-0 grid place-items-center bg-white/[.035] text-white/26">
              <PhotoIcon class="h-14 w-14 stroke-[1.4]" />
            </div>
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

          <div class="p-4">
            <h2 class="line-clamp-2 text-lg font-semibold leading-6 text-white/92">{{ course.title }}</h2>
            <p class="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{{ course.description }}</p>
            <div class="mt-4 flex items-center justify-between border-t border-white/[.08] pt-3">
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
