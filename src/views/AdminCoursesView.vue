<script setup>
import { computed, onMounted } from 'vue'
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const courses = computed(() => store.courses)

const deleteCourse = async (course) => {
  if (!window.confirm(`Hapus course "${course.title}"?`)) return
  await store.deleteAdminCourse(course.id)
}

onMounted(() => store.loadAdminCourses())
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Kelola Course Gratis</h1>
            <p class="mt-2 text-sm text-white/45">Tambah materi belajar, lesson, dan resource untuk creator.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3">
              <div class="text-xs text-white/38">Total Course</div>
              <div class="mt-1 text-2xl font-semibold text-white/88">{{ courses.length }}</div>
            </div>
            <RouterLink
              to="/admin/courses/create"
              class="inline-flex h-12 items-center gap-2 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-5 text-sm font-semibold text-white shadow-blue transition hover:opacity-90"
            >
              <PlusIcon class="h-4 w-4" />
              Tambah Course
            </RouterLink>
          </div>
        </div>
      </section>

      <section class="mt-6 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <h2 class="text-lg font-semibold text-white/88">Daftar Course</h2>
        <div class="mt-5 space-y-3">
          <div
            v-if="!courses.length"
            class="grid h-32 place-items-center rounded-lg border border-dashed border-white/[.1] bg-black/20 text-sm text-white/38"
          >
            Course belum tersedia.
          </div>
          <article
            v-for="course in courses"
            :key="course.id"
            class="rounded-lg border border-white/[.08] bg-black/20 p-4"
          >
            <div class="flex gap-4">
              <div
                class="h-20 w-28 shrink-0 rounded-lg bg-cover bg-center bg-white/[.055]"
                :style="{ backgroundImage: course.image_url ? `url(${course.image_url})` : undefined }"
              ></div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/38">
                  <span>{{ course.level || '-' }}</span>
                  <span>•</span>
                  <span>{{ course.duration || '-' }}</span>
                  <span v-if="course.lessons?.length">•</span>
                  <span v-if="course.lessons?.length">{{ course.lessons.length }} lesson</span>
                </div>
                <h3 class="mt-2 truncate text-base font-semibold text-white/88">{{ course.title }}</h3>
                <p class="mt-1 line-clamp-2 text-sm leading-6 text-white/46">{{ course.description }}</p>
              </div>
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <RouterLink
                :to="`/admin/courses/${course.id}/edit`"
                class="inline-flex h-9 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/68 transition hover:bg-white/[.085]"
              >
                <PencilSquareIcon class="h-4 w-4" />
                Edit
              </RouterLink>
              <button
                class="inline-flex h-9 items-center gap-2 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100/82 transition hover:bg-red-400/16"
                type="button"
                @click="deleteCourse(course)"
              >
                <TrashIcon class="h-4 w-4" />
                Hapus
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </AppShell>
</template>
