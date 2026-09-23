<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ArrowLeftIcon, PhotoIcon, PlusIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const saving = ref(false)
const error = ref('')
const avatarFile = ref(null)
const avatarPreview = ref('')
const currentStep = ref(0)
const steps = [
  { title: 'Profil', description: 'Nama akun' },
  { title: 'Akun', description: 'Email dan platform' },
  { title: 'Bank', description: 'Data payout' },
]

const form = ref({
  name: '',
  email: '',
  handle: '',
  platform: 'tiktok',
  whatsapp_number: '',
  social_url: '',
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
})

const inputClass = 'form-control'
const labelClass = 'text-xs font-medium text-white/44'
const handleEdited = ref(false)
const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
const canContinue = computed(() => {
  if (currentStep.value === 0) {
    return Boolean(form.value.name.trim())
  }

  if (currentStep.value === 1) {
    return Boolean(form.value.handle.trim() && form.value.platform.trim())
  }

  return true
})

const handleFromEmail = (email) => {
  const localPart = String(email || '').split('@')[0] || ''
  const handle = localPart
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '')

  return handle ? `@${handle}` : ''
}

watch(() => form.value.email, (email) => {
  if (handleEdited.value) return
  form.value.handle = handleFromEmail(email)
})

const markHandleEdited = () => {
  handleEdited.value = true
}

const nextStep = () => {
  if (!canContinue.value || isLastStep.value) return
  currentStep.value += 1
}

const previousStep = () => {
  if (isFirstStep.value) return
  currentStep.value -= 1
}

const chooseAvatar = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

const createPayload = () => {
  const payload = new FormData()
  payload.append('name', form.value.name.trim())
  payload.append('handle', form.value.handle.trim())
  payload.append('platform', form.value.platform.trim() || 'tiktok')

  if (form.value.email.trim()) {
    payload.append('email', form.value.email.trim())
  }

  const socialFields = [
    'whatsapp_number',
    'social_url',
  ]

  socialFields.forEach((field) => {
    const value = form.value[field].trim()
    if (value) payload.append(field, value)
  })

  if (form.value.bank_name.trim()) {
    payload.append('bank_name', form.value.bank_name.trim())
  }

  if (form.value.bank_account_number.trim()) {
    payload.append('bank_account_number', form.value.bank_account_number.trim())
  }

  if (form.value.bank_account_name.trim()) {
    payload.append('bank_account_name', form.value.bank_account_name.trim())
  }

  if (avatarFile.value) {
    payload.append('avatar', avatarFile.value)
  }

  return payload
}

const createAccount = async () => {
  saving.value = true
  error.value = ''

  try {
    await store.createSocialAccount(createPayload())
    router.push('/dashboard')
  } catch (exception) {
    error.value = axios.isAxiosError(exception)
      ? exception.response?.data?.message || exception.response?.data?.errors?.handle?.[0] || 'Gagal menambahkan social account.'
      : 'Gagal menambahkan social account.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AppShell>
    <form class="mx-auto max-w-[840px] pb-24" @submit.prevent="createAccount">
      <div class="flex items-center gap-4">
        <RouterLink
          to="/dashboard"
          class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/62 transition hover:bg-white/[.075] hover:text-white"
        >
          <ArrowLeftIcon class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Tambah Akun</h1>
          <p class="mt-1 text-sm text-white/42">Tambahkan akun sosial baru ke akun creator kamu.</p>
        </div>
      </div>

      <div class="mt-7 grid gap-3 md:grid-cols-3">
        <button
          v-for="(step, index) in steps"
          :key="step.title"
          class="flex h-16 items-center gap-3 rounded-lg border px-4 text-left transition"
          :class="index === currentStep ? 'border-purple-400/45 bg-purple-500/10' : index < currentStep ? 'border-emerald-300/18 bg-emerald-400/8' : 'border-white/[.07] bg-white/[.025]'"
          type="button"
          @click="currentStep = index"
        >
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold" :class="index === currentStep ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : index < currentStep ? 'bg-emerald-400/14 text-emerald-100' : 'bg-white/[.055] text-white/44'">
            {{ index + 1 }}
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-white/82">{{ step.title }}</span>
            <span class="mt-0.5 block truncate text-xs text-white/36">{{ step.description }}</span>
          </span>
        </button>
      </div>

      <section v-if="currentStep === 0" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <h2 class="text-base font-semibold text-white/86">Profil Akun</h2>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="block md:col-span-2">
            <span :class="labelClass">Nama Akun</span>
            <input v-model="form.name" required :class="inputClass" placeholder="Nama akun sosial" />
          </label>
          <label class="block md:col-span-2">
            <span :class="labelClass">Avatar</span>
            <span class="mt-2 flex min-h-28 cursor-pointer flex-col gap-4 rounded-lg border border-dashed border-white/[.12] bg-black/20 p-4 transition hover:border-purple-300/35 hover:bg-white/[.035] sm:flex-row sm:items-center">
              <span class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-white/[.055] text-white/44">
                <img v-if="avatarPreview" :src="avatarPreview" alt="" class="h-full w-full object-cover" />
                <PhotoIcon v-else class="h-8 w-8" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-semibold text-white/78">Upload avatar</span>
                <span class="mt-1 block text-xs leading-5 text-white/38">Pilih file gambar untuk foto creator.</span>
              </span>
              <span class="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 text-xs font-semibold text-white shadow-blue sm:self-center">
                <PlusIcon class="h-4 w-4" />
                Pilih Foto
              </span>
              <input class="sr-only" type="file" accept="image/*" @change="chooseAvatar" />
            </span>
          </label>
        </div>
      </section>

      <section v-if="currentStep === 1" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <h2 class="text-base font-semibold text-white/86">Informasi Akun</h2>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="block md:col-span-2">
            <span :class="labelClass">Email Akun</span>
            <input v-model="form.email" type="email" :class="inputClass" placeholder="Opsional" />
          </label>
          <label class="block">
            <span :class="labelClass">Username</span>
            <input v-model="form.handle" required :class="inputClass" placeholder="@handle" @input="markHandleEdited" />
          </label>
          <label class="block">
            <span :class="labelClass">Platform</span>
            <select v-model="form.platform" required class="form-control">
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
            </select>
          </label>
          <label class="block">
            <span :class="labelClass">No. WhatsApp</span>
            <input v-model="form.whatsapp_number" type="tel" :class="inputClass" placeholder="081234567890" />
          </label>
          <label class="block">
            <span :class="labelClass">Link Akun Sosial</span>
            <input v-model="form.social_url" type="url" :class="inputClass" placeholder="https://tiktok.com/@username" />
          </label>
        </div>
      </section>

      <section v-if="currentStep === 2" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="flex items-center gap-3">
          <h2 class="text-base font-semibold text-white/86">Rekening</h2>
          <span class="rounded-full border border-purple-300/25 bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-100/82">Optional</span>
        </div>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="block">
            <span :class="labelClass">Bank</span>
            <input v-model="form.bank_name" :class="inputClass" placeholder="BCA" />
          </label>
          <label class="block">
            <span :class="labelClass">Nomor Rekening</span>
            <input v-model="form.bank_account_number" :class="inputClass" placeholder="1234567890" />
          </label>
          <label class="block md:col-span-2">
            <span :class="labelClass">Nama Pemilik Rekening</span>
            <input v-model="form.bank_account_name" :class="inputClass" placeholder="Nama sesuai rekening" />
          </label>
        </div>
      </section>

      <p v-if="error" class="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</p>

      <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0B0B0D]/92 px-5 py-4 backdrop-blur lg:left-[252px]">
        <div class="mx-auto flex max-w-[840px] items-center justify-between gap-3">
          <RouterLink
            to="/dashboard"
            class="inline-flex h-11 items-center rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]"
          >
            Batal
          </RouterLink>
          <div class="flex items-center gap-3">
            <button v-if="!isFirstStep" class="h-11 rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" @click="previousStep">Kembali</button>
            <button v-if="!isLastStep" class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:bg-[#7551e9] disabled:opacity-45" type="button" :disabled="!canContinue" @click="nextStep">
              Lanjut
            </button>
            <button
              v-else
              class="btn-blue inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold disabled:opacity-60"
              type="submit"
              :disabled="saving"
            >
              <PlusIcon class="h-4 w-4" />
              {{ saving ? 'Menyimpan...' : 'Tambah Akun' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </AppShell>
</template>
