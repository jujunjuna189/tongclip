<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  AcademicCapIcon,
  Bars3Icon,
  BookOpenIcon,
  FolderOpenIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  PencilSquareIcon,
  PhotoIcon,
  PlayCircleIcon,
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const query = ref('')
const levelFilter = ref('all')
const contentFilter = ref('all')
const viewMode = ref('card')
const loading = ref(false)
const deleting = ref(false)
const showFilters = ref(false)
const filterPopup = ref(null)
const courseToDelete = ref(null)

const levelOptions = computed(() => {
  const levels = store.courses.map((course) => course.level).filter(Boolean)
  return [...new Set(levels)]
})
const filteredCourses = computed(() => {
  const keyword = query.value.toLowerCase().trim()

  return store.courses.filter((course) => {
    const searchable = [
      course.title,
      course.description,
      course.level,
      course.duration,
      course.url,
      ...(course.lessons || []).map((lesson) => `${lesson.title} ${lesson.duration}`),
      ...(course.resources || []),
    ].join(' ').toLowerCase()
    const matchesKeyword = !keyword || searchable.includes(keyword)
    const matchesLevel = levelFilter.value === 'all' || course.level === levelFilter.value
    const hasLessons = Boolean(course.lessons?.length)
    const hasResources = Boolean(course.resources?.length)
    const matchesContent = contentFilter.value === 'all'
      || (contentFilter.value === 'complete' && hasLessons && hasResources)
      || (contentFilter.value === 'needs-content' && (!hasLessons || !hasResources))

    return matchesKeyword && matchesLevel && matchesContent
  })
})
const totalLessons = computed(() => store.courses.reduce((total, course) => total + (course.lessons?.length || 0), 0))
const coursesWithResources = computed(() => store.courses.filter((course) => course.resources?.length).length)
const hasActiveFilters = computed(() => Boolean(query.value.trim()) || levelFilter.value !== 'all' || contentFilter.value !== 'all')
const activeFilterCount = computed(() => Number(levelFilter.value !== 'all') + Number(contentFilter.value !== 'all'))

const contentStatus = (course) => {
  const hasLessons = Boolean(course.lessons?.length)
  const hasResources = Boolean(course.resources?.length)

  return hasLessons && hasResources ? 'Lengkap' : 'Perlu dilengkapi'
}

const resetFilters = () => {
  levelFilter.value = 'all'
  contentFilter.value = 'all'
}

const openDeleteModal = (course) => {
  courseToDelete.value = course
}

const closeDeleteModal = () => {
  if (deleting.value) return
  courseToDelete.value = null
}

const confirmDeleteCourse = async () => {
  if (!courseToDelete.value) return

  deleting.value = true

  try {
    await store.deleteAdminCourse(courseToDelete.value.id)
    courseToDelete.value = null
  } finally {
    deleting.value = false
  }
}

const handleOutsidePointerDown = (event) => {
  const target = event.target

  if (!(target instanceof Element)) return
  if (!filterPopup.value?.contains(target)) {
    showFilters.value = false
  }
}

onMounted(async () => {
  document.addEventListener('pointerdown', handleOutsidePointerDown)
  loading.value = true

  try {
    await store.loadAdminCourses()
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsidePointerDown)
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Kelola Course Gratis</h1>
          <p class="mt-2 text-sm text-white/45">Tambah materi belajar, lesson, dan resource untuk creator.</p>
        </div>
        <RouterLink
          to="/admin/courses/create"
          class="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 text-sm font-semibold text-white shadow-blue transition hover:opacity-90"
        >
          <PlusIcon class="h-4 w-4" />
          Tambah Course
        </RouterLink>
      </div>

      <div class="mt-5 grid gap-4 md:grid-cols-3">
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-medium text-white/40">Total Course</div>
              <div class="mt-2 text-2xl font-semibold text-white/90">{{ store.courses.length }}</div>
            </div>
            <AcademicCapIcon class="h-7 w-7 text-purple-300" />
          </div>
        </section>
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-medium text-white/40">Total Lesson</div>
              <div class="mt-2 text-2xl font-semibold text-white/90">{{ totalLessons }}</div>
            </div>
            <BookOpenIcon class="h-7 w-7 text-purple-300" />
          </div>
        </section>
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-medium text-white/40">Dengan Resource</div>
              <div class="mt-2 text-2xl font-semibold text-white/90">{{ coursesWithResources }}</div>
            </div>
            <FolderOpenIcon class="h-7 w-7 text-purple-300" />
          </div>
        </section>
      </div>

      <section class="mt-6 rounded-lg border border-white/[.08] bg-white/[.025] p-4">
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex h-10 w-full min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3.5 md:w-[360px] xl:w-[420px]">
            <MagnifyingGlassIcon class="h-4 w-4 shrink-0 text-white/42" />
            <input v-model="query" class="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Cari course..." />
            <button v-if="query" class="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md text-white/38 transition hover:bg-white/[.055] hover:text-white" type="button" aria-label="Hapus pencarian" @click="query = ''">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </label>

          <div ref="filterPopup" class="relative shrink-0">
            <button
              class="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm font-semibold text-white/68 transition hover:bg-white/[.055] hover:text-white"
              type="button"
              @click="showFilters = !showFilters"
            >
              <FunnelIcon class="h-4 w-4" />
              Filter
              <span v-if="activeFilterCount" class="grid h-5 min-w-5 place-items-center rounded-full bg-purple-500/30 px-1 text-[10px] font-black text-purple-100">{{ activeFilterCount }}</span>
            </button>

            <div v-if="showFilters" class="absolute left-0 top-12 z-30 w-72 rounded-lg border border-white/10 bg-[#111113] p-3 shadow-[0_18px_42px_rgba(0,0,0,.38)]">
              <div class="flex items-center justify-between gap-3">
                <div class="text-sm font-semibold text-white/86">Filter Course</div>
                <button class="grid h-8 w-8 place-items-center rounded-lg bg-white/[.045] text-white/46 transition hover:bg-white/[.075] hover:text-white" type="button" aria-label="Tutup filter" @click="showFilters = false">
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>

              <div class="mt-4">
                <div class="text-[11px] font-semibold uppercase tracking-[.12em] text-white/30">Level</div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <button class="h-8 rounded-lg px-3 text-xs font-semibold transition" :class="levelFilter === 'all' ? 'bg-white/10 text-white' : 'border border-white/10 bg-white/[.035] text-white/52 hover:bg-white/[.065] hover:text-white'" type="button" @click="levelFilter = 'all'">Semua</button>
                  <button v-for="level in levelOptions" :key="level" class="h-8 rounded-lg px-3 text-xs font-semibold transition" :class="levelFilter === level ? 'bg-white/10 text-white' : 'border border-white/10 bg-white/[.035] text-white/52 hover:bg-white/[.065] hover:text-white'" type="button" @click="levelFilter = level">
                    {{ level }}
                  </button>
                </div>
              </div>

              <div class="mt-4">
                <div class="text-[11px] font-semibold uppercase tracking-[.12em] text-white/30">Konten</div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <button
                    v-for="item in [
                      { value: 'all', label: 'Semua' },
                      { value: 'complete', label: 'Lengkap' },
                      { value: 'needs-content', label: 'Perlu dilengkapi' },
                    ]"
                    :key="item.value"
                    class="h-8 rounded-lg px-3 text-xs font-semibold transition"
                    :class="contentFilter === item.value ? 'bg-white/10 text-white' : 'border border-white/10 bg-white/[.035] text-white/52 hover:bg-white/[.065] hover:text-white'"
                    type="button"
                    @click="contentFilter = item.value"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>

              <button
                class="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-white/[.055] text-xs font-semibold text-white/68 transition hover:bg-white/[.085] hover:text-white disabled:opacity-40"
                type="button"
                :disabled="!activeFilterCount"
                @click="resetFilters"
              >
                Reset filter
              </button>
            </div>
          </div>

          <div class="ml-auto grid h-10 w-[82px] shrink-0 grid-cols-2 rounded-lg border border-white/10 bg-black/20 p-1">
            <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'card' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" aria-label="Grid view" @click="viewMode = 'card'">
              <Squares2X2Icon class="h-4 w-4" />
            </button>
            <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" aria-label="List view" @click="viewMode = 'list'">
              <Bars3Icon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section v-if="loading" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="index in 6" :key="index" class="h-[360px] animate-pulse rounded-lg border border-white/[.08] bg-white/[.035]"></div>
      </section>

      <section v-else-if="viewMode === 'card'" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div v-if="!filteredCourses.length" class="col-span-full grid h-40 place-items-center rounded-lg border border-dashed border-white/[.1] bg-black/20 text-sm text-white/38">
          Course tidak ditemukan.
        </div>
        <article
          v-for="course in filteredCourses"
          :key="course.id"
          class="group overflow-hidden rounded-lg border border-white/[.08] bg-white/[.025] transition hover:-translate-y-0.5 hover:border-purple-300/30 hover:bg-white/[.04]"
        >
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
              {{ course.lessons?.length || 0 }} materi
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
            <div class="mb-3 flex flex-wrap gap-2">
              <span
                class="rounded-full px-3 py-1 text-[11px] font-semibold"
                :class="contentStatus(course) === 'Lengkap' ? 'bg-emerald-400/10 text-emerald-100/82' : 'bg-amber-400/10 text-amber-100/82'"
              >
                {{ contentStatus(course) }}
              </span>
              <span class="rounded-full bg-white/[.045] px-3 py-1 text-[11px] font-semibold text-white/46">{{ course.resources?.length || 0 }} resource</span>
            </div>
            <h3 class="line-clamp-2 text-lg font-semibold leading-6 text-white/92">{{ course.title }}</h3>
            <p class="mt-2.5 line-clamp-2 text-sm leading-6 text-white/50">{{ course.description }}</p>
            <div class="mt-5 flex items-center gap-2">
              <RouterLink :to="`/admin/courses/${course.id}/edit`" class="inline-flex h-9 items-center gap-2 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/72 transition hover:bg-white/[.085] hover:text-white">
                <PencilSquareIcon class="h-4 w-4" />
                Edit
              </RouterLink>
              <button class="inline-flex h-9 items-center gap-2 rounded-lg bg-red-400/10 px-4 text-sm font-semibold text-red-100/82 transition hover:bg-red-400/16" type="button" @click="openDeleteModal(course)">
                <TrashIcon class="h-4 w-4" />
                Hapus
              </button>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="mt-6 overflow-x-auto">
        <div class="min-w-[920px] space-y-2">
          <table class="w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">Course</th>
                <th class="px-4 pb-1 font-medium">Level</th>
                <th class="px-4 pb-1 font-medium">Durasi</th>
                <th class="px-4 pb-1 font-medium">Lesson</th>
                <th class="px-4 pb-1 font-medium">Resource</th>
                <th class="px-4 pb-1 font-medium">Status</th>
                <th class="px-4 pb-1 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredCourses.length">
                <td colspan="7" class="rounded-lg border border-dashed border-white/[.1] bg-black/20 px-4 py-12 text-center text-sm text-white/38">Course tidak ditemukan.</td>
              </tr>
              <tr v-for="course in filteredCourses" :key="course.id" class="group text-white/68">
                <td class="rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="text-sm font-semibold text-white/86">{{ course.title }}</div>
                  <div class="mt-1 max-w-[360px] truncate text-[11px] text-white/34">{{ course.description }}</div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ course.level || '-' }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ course.duration || '-' }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 font-semibold text-gradient-primary transition group-hover:bg-white/[.045]">{{ course.lessons?.length || 0 }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ course.resources?.length || 0 }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <span
                    class="rounded-full px-3 py-1 text-[11px] font-semibold"
                    :class="contentStatus(course) === 'Lengkap' ? 'bg-emerald-400/10 text-emerald-100/82' : 'bg-amber-400/10 text-amber-100/82'"
                  >
                    {{ contentStatus(course) }}
                  </span>
                </td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex gap-2">
                    <RouterLink :to="`/admin/courses/${course.id}/edit`" class="inline-flex h-8 items-center rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/72 hover:bg-white/[.085]">Edit</RouterLink>
                    <button class="h-8 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="openDeleteModal(course)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-if="courseToDelete" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeDeleteModal">
        <section class="w-full max-w-md rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]">
          <div class="flex items-start justify-between gap-4">
            <div class="flex gap-4">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-100">
                <ExclamationTriangleIcon class="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <h2 class="text-base font-semibold text-white/90">Hapus course?</h2>
                <p class="mt-2 text-sm leading-6 text-white/46">Course ini akan dihapus dari database beserta lesson dan resource yang tersimpan.</p>
              </div>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" @click="closeDeleteModal">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 rounded-lg border border-white/[.08] bg-white/[.03] p-4">
            <div class="text-sm font-semibold text-white/86">{{ courseToDelete.title }}</div>
            <div class="mt-1 text-xs text-white/38">{{ courseToDelete.level || '-' }} · {{ courseToDelete.duration || '-' }}</div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button class="h-10 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" :disabled="deleting" @click="closeDeleteModal">Batal</button>
            <button class="h-10 rounded-lg bg-red-500/85 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60" type="button" :disabled="deleting" @click="confirmDeleteCourse">
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
