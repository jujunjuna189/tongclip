<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const saving = ref(false)

const form = ref({
  title: '',
  description: '',
  image_url: '',
  duration: '',
  level: 'Pemula',
  url: '',
  lessons: [{ title: '', duration: '', video_url: '' }],
  resources: [''],
})

const inputClass = 'form-control'
const labelClass = 'text-xs font-medium text-white/44'

const cleanPayload = () => ({
  title: form.value.title,
  description: form.value.description,
  image_url: form.value.image_url || undefined,
  duration: form.value.duration || undefined,
  level: form.value.level || 'Pemula',
  url: form.value.url || undefined,
  lessons: form.value.lessons
    .map((lesson) => ({
      title: String(lesson.title || '').trim(),
      duration: String(lesson.duration || '').trim(),
      video_url: String(lesson.video_url || '').trim(),
    }))
    .filter((lesson) => lesson.title || lesson.duration || lesson.video_url),
  resources: form.value.resources.map((r) => String(r).trim()).filter(Boolean),
})

const addLesson = () => form.value.lessons.push({ title: '', duration: '', video_url: '' })
const removeLesson = (index) => {
  if (form.value.lessons.length === 1) {
    form.value.lessons[index] = { title: '', duration: '', video_url: '' }
    return
  }
  form.value.lessons.splice(index, 1)
}

const addResource = () => form.value.resources.push('')
const removeResource = (index) => {
  if (form.value.resources.length === 1) {
    form.value.resources[index] = ''
    return
  }
  form.value.resources.splice(index, 1)
}

const createCourse = async () => {
  saving.value = true
  try {
    await store.createAdminCourse(cleanPayload())
    router.push('/admin/courses')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AppShell>
    <form class="mx-auto max-w-[720px] pb-24" @submit.prevent="createCourse">
      <div class="flex items-center gap-4">
        <RouterLink
          to="/admin/courses"
          class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/62 transition hover:bg-white/[.075] hover:text-white"
        >
          <ArrowLeftIcon class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Tambah Course</h1>
          <p class="mt-1 text-sm text-white/42">Buat materi belajar baru untuk creator.</p>
        </div>
      </div>

      <!-- Info Dasar -->
      <section class="mt-7 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <h2 class="text-base font-semibold text-white/86">Informasi Course</h2>
        <p class="mt-1 text-sm text-white/38">Detail utama yang tampil di listing dan halaman course.</p>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="block md:col-span-2">
            <span :class="labelClass">Judul Course</span>
            <input v-model="form.title" required :class="inputClass" placeholder="Contoh: Editing Clip Cepat Approve" />
          </label>
          <label class="block md:col-span-2">
            <span :class="labelClass">Deskripsi</span>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="mt-2 w-full resize-y rounded-lg border border-white/[.08] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/24 focus:border-purple-400/55 focus:bg-black/30"
              placeholder="Ringkasan materi course."
            ></textarea>
          </label>
          <label class="block">
            <span :class="labelClass">Level</span>
            <input v-model="form.level" :class="inputClass" placeholder="Pemula" />
          </label>
          <label class="block">
            <span :class="labelClass">Durasi</span>
            <input v-model="form.duration" :class="inputClass" placeholder="35 Menit" />
          </label>
          <label class="block md:col-span-2">
            <span :class="labelClass">Image URL</span>
            <input v-model="form.image_url" :class="inputClass" placeholder="https://..." />
          </label>
          <label class="block md:col-span-2">
            <span :class="labelClass">URL Materi Utama</span>
            <input v-model="form.url" :class="inputClass" placeholder="https://youtube.com/..." />
          </label>
        </div>
      </section>

      <!-- Lessons -->
      <section class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold text-white/86">Lesson</h2>
            <p class="mt-1 text-sm text-white/38">Materi yang tampil di halaman detail course.</p>
          </div>
          <button
            class="inline-flex h-9 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/68 transition hover:bg-white/[.085]"
            type="button"
            @click="addLesson"
          >
            <PlusIcon class="h-4 w-4" />
            Tambah
          </button>
        </div>
        <div class="mt-5 space-y-3">
          <div
            v-for="(_, index) in form.lessons"
            :key="`lesson-${index}`"
            class="grid gap-2 rounded-lg border border-white/[.07] bg-black/20 p-3"
          >
            <div class="flex gap-2">
              <span class="grid h-11 w-9 shrink-0 place-items-center text-xs font-semibold text-white/30">
                {{ index + 1 }}
              </span>
              <input v-model="form.lessons[index].title" :class="inputClass" :placeholder="`Judul lesson ${index + 1}`" />
              <button
                class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/[.08] bg-white/[.035] text-white/44 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
                type="button"
                @click="removeLesson(index)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
            <div class="grid gap-2 pl-11 md:grid-cols-2">
              <input v-model="form.lessons[index].duration" :class="inputClass" placeholder="08:20" />
              <input v-model="form.lessons[index].video_url" :class="inputClass" placeholder="Video URL" />
            </div>
          </div>
        </div>
      </section>

      <!-- Resources -->
      <section class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold text-white/86">Resource</h2>
            <p class="mt-1 text-sm text-white/38">Link materi pendukung untuk creator.</p>
          </div>
          <button
            class="inline-flex h-9 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/68 transition hover:bg-white/[.085]"
            type="button"
            @click="addResource"
          >
            <PlusIcon class="h-4 w-4" />
            Tambah
          </button>
        </div>
        <div class="mt-5 space-y-3">
          <div v-for="(_, index) in form.resources" :key="`resource-${index}`" class="flex gap-2">
            <input v-model="form.resources[index]" :class="inputClass" :placeholder="`Resource URL ${index + 1}`" />
            <button
              class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/[.08] bg-white/[.035] text-white/44 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"
              type="button"
              @click="removeResource(index)"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <!-- Footer bar -->
      <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0B0B0D]/92 px-5 py-4 backdrop-blur lg:left-[252px]">
        <div class="mx-auto flex max-w-[720px] items-center justify-between gap-3">
          <RouterLink
            to="/admin/courses"
            class="inline-flex h-11 items-center rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]"
          >
            Batal
          </RouterLink>
          <button
            class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:opacity-90 disabled:opacity-60"
            type="submit"
            :disabled="saving"
          >
            {{ saving ? 'Menyimpan...' : 'Simpan Course' }}
          </button>
        </div>
      </div>
    </form>
  </AppShell>
</template>
