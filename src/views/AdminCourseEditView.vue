<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const route = useRoute()
const router = useRouter()
const store = useClipperStore()
const saving = ref(false)
const loading = ref(true)
const currentStep = ref(0)
const coverImage = ref(null)
const coverPreview = ref('')

const courseId = Number(route.params.id)
const steps = [
  { title: 'Informasi', description: 'Judul dan detail' },
  { title: 'Media', description: 'Cover dan video' },
  { title: 'Materi', description: 'Lesson dan resource' },
]

const form = ref({
  title: '',
  description: '',
  duration: '',
  level: 'Pemula',
  url: '',
  lessons: [{ title: '', duration: '', video_url: '' }],
  resources: [''],
})

const inputClass = 'form-control'
const labelClass = 'text-xs font-medium text-white/44'
const textareaClass = 'mt-2 w-full resize-y rounded-lg border border-white/[.08] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/24 focus:border-purple-400/55 focus:bg-black/30'
const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
const canContinue = computed(() => currentStep.value !== 0 || Boolean(form.value.title.trim() && form.value.description.trim()))

const chooseCoverImage = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  coverImage.value = file
  coverPreview.value = URL.createObjectURL(file)
}

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

const buildPayload = () => {
  const payload = new FormData()
  const lessons = form.value.lessons
    .map((lesson) => ({
      title: String(lesson.title || '').trim(),
      duration: String(lesson.duration || '').trim(),
      video_url: String(lesson.video_url || '').trim(),
    }))
    .filter((lesson) => lesson.title || lesson.duration || lesson.video_url)
  const resources = form.value.resources.map((resource) => String(resource || '').trim()).filter(Boolean)

  payload.append('title', form.value.title)
  payload.append('description', form.value.description)
  payload.append('duration', form.value.duration)
  payload.append('level', form.value.level || 'Pemula')
  payload.append('url', form.value.url)

  if (coverImage.value) {
    payload.append('cover_image', coverImage.value)
  }

  lessons.forEach((lesson, index) => {
    payload.append(`lessons[${index}][title]`, lesson.title)
    payload.append(`lessons[${index}][duration]`, lesson.duration)
    payload.append(`lessons[${index}][video_url]`, lesson.video_url)
  })
  resources.forEach((resource) => payload.append('resources[]', resource))

  return payload
}

const nextStep = () => {
  if (!canContinue.value || isLastStep.value) return
  currentStep.value += 1
}

const previousStep = () => {
  if (isFirstStep.value) return
  currentStep.value -= 1
}

const updateCourse = async () => {
  saving.value = true
  try {
    await store.updateAdminCourse(courseId, buildPayload())
    router.push('/admin/courses')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await store.loadAdminCourses()
  const course = store.courses.find((item) => item.id === courseId)

  if (!course) {
    router.push('/admin/courses')
    return
  }

  form.value = {
    title: course.title || '',
    description: course.description || '',
    duration: course.duration || '',
    level: course.level || 'Pemula',
    url: course.url || '',
    lessons: course.lessons?.length
      ? course.lessons.map((lesson) => ({
          title: lesson.title || '',
          duration: lesson.duration || '',
          video_url: lesson.video_url || '',
        }))
      : [{ title: '', duration: '', video_url: '' }],
    resources: course.resources?.length ? [...course.resources] : [''],
  }
  coverPreview.value = course.image_url || ''
  coverImage.value = null
  loading.value = false
})
</script>

<template>
  <AppShell>
    <form class="mx-auto max-w-[960px] pb-24" @submit.prevent="updateCourse">
      <div class="flex items-center gap-4">
        <RouterLink to="/admin/courses" class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/62 transition hover:bg-white/[.075] hover:text-white">
          <ArrowLeftIcon class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Edit Course</h1>
          <p class="mt-1 text-sm text-white/42">Perbarui materi belajar yang sudah tersimpan.</p>
        </div>
      </div>

      <div v-if="loading" class="mt-7 rounded-lg border border-white/[.08] bg-white/[.025] p-6 text-sm text-white/45">
        Memuat data course...
      </div>

      <template v-else>
        <div class="mt-7 grid gap-3 md:grid-cols-3">
          <button v-for="(step, index) in steps" :key="step.title" class="flex h-16 items-center gap-3 rounded-lg border px-4 text-left transition" :class="index === currentStep ? 'border-purple-400/45 bg-purple-500/10' : index < currentStep ? 'border-emerald-300/18 bg-emerald-400/8' : 'border-white/[.07] bg-white/[.025]'" type="button" @click="currentStep = index">
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold" :class="index === currentStep ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : index < currentStep ? 'bg-emerald-400/14 text-emerald-100' : 'bg-white/[.055] text-white/44'">{{ index + 1 }}</span>
            <span>
              <span class="block text-sm font-semibold text-white/82">{{ step.title }}</span>
              <span class="mt-0.5 block text-xs text-white/36">{{ step.description }}</span>
            </span>
          </button>
        </div>

        <section v-if="currentStep === 0" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
          <h2 class="text-base font-semibold text-white/86">Informasi Course</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="block md:col-span-2">
              <span :class="labelClass">Judul Course</span>
              <input v-model="form.title" required :class="inputClass" placeholder="Contoh: Editing Clip Cepat Approve" />
            </label>
            <label class="block md:col-span-2">
              <span :class="labelClass">Deskripsi</span>
              <textarea v-model="form.description" required rows="5" :class="textareaClass" placeholder="Ringkasan materi course."></textarea>
            </label>
            <label class="block">
              <span :class="labelClass">Level</span>
              <input v-model="form.level" :class="inputClass" placeholder="Pemula" />
            </label>
            <label class="block">
              <span :class="labelClass">Durasi</span>
              <input v-model="form.duration" :class="inputClass" placeholder="35 Menit" />
            </label>
          </div>
        </section>

        <section v-if="currentStep === 1" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
          <h2 class="text-base font-semibold text-white/86">Media Course</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="block md:col-span-2">
              <span :class="labelClass">Cover Image</span>
              <span class="mt-2 flex min-h-32 cursor-pointer flex-col gap-4 rounded-lg border border-dashed border-white/[.12] bg-black/20 p-4 transition hover:border-purple-300/35 hover:bg-white/[.035] sm:flex-row sm:items-center">
                <span class="grid h-24 w-36 shrink-0 place-items-center overflow-hidden rounded-lg bg-white/[.055] text-white/44">
                  <img v-if="coverPreview" :src="coverPreview" alt="" class="h-full w-full object-cover" />
                  <PhotoIcon v-else class="h-8 w-8" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-semibold text-white/78">Upload cover</span>
                  <span class="mt-1 block text-xs leading-5 text-white/38">Gambar ini tampil di listing dan detail course.</span>
                </span>
                <span class="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 text-xs font-semibold text-white shadow-blue">
                  <PlusIcon class="h-4 w-4" />
                  Pilih Foto
                </span>
                <input class="sr-only" type="file" accept="image/*" @change="chooseCoverImage" />
              </span>
            </label>
            <label class="block md:col-span-2">
              <span :class="labelClass">URL Materi Utama</span>
              <input v-model="form.url" :class="inputClass" placeholder="https://youtube.com/..." />
            </label>
          </div>
        </section>

        <section v-if="currentStep === 2" class="mt-5 space-y-5">
          <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-semibold text-white/86">Lesson</h2>
                <p class="mt-1 text-sm text-white/38">Materi yang tampil di halaman detail course.</p>
              </div>
              <button class="inline-flex h-9 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/68 transition hover:bg-white/[.085]" type="button" @click="addLesson">
                <PlusIcon class="h-4 w-4" />
                Tambah
              </button>
            </div>
            <div class="mt-5 space-y-3">
              <div v-for="(_, index) in form.lessons" :key="`lesson-${index}`" class="grid gap-2 rounded-lg border border-white/[.07] bg-black/20 p-3">
                <div class="flex gap-2">
                  <span class="grid h-11 w-9 shrink-0 place-items-center text-xs font-semibold text-white/30">{{ index + 1 }}</span>
                  <input v-model="form.lessons[index].title" :class="inputClass" :placeholder="`Judul lesson ${index + 1}`" />
                  <button class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/[.08] bg-white/[.035] text-white/44 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200" type="button" @click="removeLesson(index)">
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

          <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-semibold text-white/86">Resource</h2>
                <p class="mt-1 text-sm text-white/38">Link materi pendukung untuk creator.</p>
              </div>
              <button class="inline-flex h-9 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/68 transition hover:bg-white/[.085]" type="button" @click="addResource">
                <PlusIcon class="h-4 w-4" />
                Tambah
              </button>
            </div>
            <div class="mt-5 space-y-3">
              <div v-for="(_, index) in form.resources" :key="`resource-${index}`" class="flex gap-2">
                <input v-model="form.resources[index]" :class="inputClass" :placeholder="`Resource URL ${index + 1}`" />
                <button class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/[.08] bg-white/[.035] text-white/44 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200" type="button" @click="removeResource(index)">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </section>
      </template>

      <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0B0B0D]/92 px-5 py-4 backdrop-blur lg:left-[252px]">
        <div class="mx-auto flex max-w-[960px] items-center justify-between gap-3">
          <RouterLink to="/admin/courses" class="inline-flex h-11 items-center rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]">Batal</RouterLink>
          <div v-if="!loading" class="flex items-center gap-3">
            <button v-if="!isFirstStep" class="h-11 rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" @click="previousStep">Kembali</button>
            <button v-if="!isLastStep" class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:opacity-90 disabled:opacity-45" type="button" :disabled="!canContinue" @click="nextStep">Lanjut</button>
            <button v-else class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:opacity-90 disabled:opacity-60" type="submit" :disabled="saving">
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </AppShell>
</template>
