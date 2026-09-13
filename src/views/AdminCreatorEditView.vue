<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon, PhotoIcon, PlusIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const route = useRoute()
const router = useRouter()
const store = useClipperStore()
const saving = ref(false)
const loading = ref(true)
const currentStep = ref(0)
const avatarFile = ref(null)
const avatarPreview = ref('')
const showPassword = ref(false)

const creatorId = computed(() => Number(route.params.id))

const steps = [
  { title: 'Profil', description: 'Nama dan avatar' },
  { title: 'Akses', description: 'Login dan status' },
  { title: 'Bank', description: 'Data payout' },
]

const form = ref({
  name: '',
  email: '',
  handle: '',
  password: '',
  status: 'active',
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
})

const inputClass = 'form-control'
const selectClass = 'form-control form-select'
const labelClass = 'text-xs font-medium text-white/44'
const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
const handleEdited = ref(false)

const canContinue = computed(() => {
  if (currentStep.value === 0) return Boolean(form.value.name.trim())
  if (currentStep.value === 1) {
    return Boolean(
      form.value.email.trim() &&
      form.value.handle.trim() &&
      form.value.status &&
      (!form.value.password || form.value.password.length >= 8),
    )
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

const chooseAvatar = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

const nextStep = () => {
  if (!canContinue.value || isLastStep.value) return
  currentStep.value += 1
}

const previousStep = () => {
  if (isFirstStep.value) return
  currentStep.value -= 1
}

const updateCreator = async () => {
  saving.value = true
  try {
    const payload = new FormData()
    payload.append('name', form.value.name)
    payload.append('email', form.value.email)
    payload.append('handle', form.value.handle)
    payload.append('status', form.value.status)
    payload.append('bank_name', form.value.bank_name)
    payload.append('bank_account_number', form.value.bank_account_number)
    payload.append('bank_account_name', form.value.bank_account_name)
    if (form.value.password) payload.append('password', form.value.password)
    if (avatarFile.value) payload.append('avatar', avatarFile.value)

    await store.updateAdminCreator(creatorId.value, payload)
    router.push('/admin/creators')
  } catch (err) {
    const msg = err?.response?.data?.message
      || (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join('\n') : null)
      || 'Terjadi kesalahan, coba lagi.'
    alert(msg)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await store.loadAdminCreators()
  const creator = store.adminCreators.find((c) => c.id === creatorId.value)

  if (!creator) {
    router.push('/admin/creators')
    return
  }

  form.value = {
    name: creator.name || '',
    email: creator.email || '',
    handle: creator.handle || '',
    password: '',
    status: String(creator.status || 'Active').toLowerCase(),
    bank_name: creator.bank_name || '',
    bank_account_number: creator.bank_account_number || '',
    bank_account_name: creator.bank_account_name || '',
  }

  avatarPreview.value = creator.avatar_url || ''
  handleEdited.value = true // prevent handle auto-overwrite on email watch
  loading.value = false
})
</script>

<template>
  <AppShell>
    <form class="mx-auto max-w-[960px] pb-24" @submit.prevent="updateCreator">
      <div class="flex items-center gap-4">
        <RouterLink
          to="/admin/creators"
          class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/62 transition hover:bg-white/[.075] hover:text-white"
        >
          <ArrowLeftIcon class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Edit Creator</h1>
          <p class="mt-1 text-sm text-white/42">Perbarui data akun creator.</p>
        </div>
      </div>

      <div v-if="loading" class="mt-7 rounded-lg border border-white/[.08] bg-white/[.025] p-6 text-sm text-white/45">
        Memuat data creator...
      </div>

      <template v-else>
        <div class="mt-7 grid gap-3 md:grid-cols-3">
          <button
            v-for="(step, index) in steps"
            :key="step.title"
            class="flex h-16 items-center gap-3 rounded-lg border px-4 text-left transition"
            :class="index === currentStep ? 'border-purple-400/45 bg-purple-500/10' : index < currentStep ? 'border-emerald-300/18 bg-emerald-400/8' : 'border-white/[.07] bg-white/[.025]'"
            type="button"
            @click="currentStep = index"
          >
            <span
              class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold"
              :class="index === currentStep ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : index < currentStep ? 'bg-emerald-400/14 text-emerald-100' : 'bg-white/[.055] text-white/44'"
            >
              {{ index + 1 }}
            </span>
            <span>
              <span class="block text-sm font-semibold text-white/82">{{ step.title }}</span>
              <span class="mt-0.5 block text-xs text-white/36">{{ step.description }}</span>
            </span>
          </button>
        </div>

        <!-- Step 0: Profil -->
        <section v-if="currentStep === 0" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
          <h2 class="text-base font-semibold text-white/86">Profil Creator</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="block">
              <span :class="labelClass">Nama</span>
              <input v-model="form.name" required :class="inputClass" placeholder="Contoh: Dinda Putri" />
            </label>
            <label class="block">
              <span :class="labelClass">Avatar</span>
              <span class="mt-2 flex min-h-28 cursor-pointer flex-col gap-4 rounded-lg border border-dashed border-white/[.12] bg-black/20 p-4 transition hover:border-purple-300/35 hover:bg-white/[.035] sm:flex-row sm:items-center">
                <span class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-white/[.055] text-white/44">
                  <img v-if="avatarPreview" :src="avatarPreview" alt="" class="h-full w-full object-cover" />
                  <PhotoIcon v-else class="h-8 w-8" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-semibold text-white/78">{{ avatarFile ? 'Foto baru dipilih' : 'Ganti avatar' }}</span>
                  <span class="mt-1 block text-xs leading-5 text-white/38">Kosongkan jika tidak ingin mengubah foto.</span>
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

        <!-- Step 1: Akses -->
        <section v-if="currentStep === 1" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
          <h2 class="text-base font-semibold text-white/86">Akses Login</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="block">
              <span :class="labelClass">Email</span>
              <input v-model="form.email" required type="email" :class="inputClass" placeholder="creator@example.com" />
            </label>
            <label class="block">
              <span :class="labelClass">Handle</span>
              <input v-model="form.handle" required :class="inputClass" placeholder="@creator" @input="markHandleEdited" />
            </label>
            <label class="block">
              <span :class="labelClass">
                Password Baru
                <span class="ml-1 rounded-full border border-white/10 bg-white/[.06] px-1.5 py-0.5 text-[10px] text-white/40">opsional</span>
              </span>
              <span class="relative block">
                <input
                  v-model="form.password"
                  :minlength="form.password ? 8 : undefined"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control pr-12"
                  placeholder="Kosongkan jika tidak diubah"
                />
                <button
                  class="absolute right-3 top-[32px] grid h-8 w-8 -translate-y-1/2 place-items-center text-white/50 transition hover:text-white"
                  type="button"
                  :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                  @click="showPassword = !showPassword"
                >
                  <EyeSlashIcon v-if="showPassword" class="h-5 w-5 stroke-[1.8]" />
                  <EyeIcon v-else class="h-5 w-5 stroke-[1.8]" />
                </button>
              </span>
            </label>
            <label class="block">
              <span :class="labelClass">Status</span>
              <select v-model="form.status" :class="selectClass">
                <option class="bg-black" value="active">Active</option>
                <option class="bg-black" value="review">Review</option>
                <option class="bg-black" value="blocked">Blocked</option>
              </select>
            </label>
          </div>
        </section>

        <!-- Step 2: Bank -->
        <section v-if="currentStep === 2" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
          <div class="flex items-center gap-3">
            <h2 class="text-base font-semibold text-white/86">Data Bank</h2>
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
              <span :class="labelClass">Nama Rekening</span>
              <input v-model="form.bank_account_name" :class="inputClass" placeholder="Sesuai buku tabungan" />
            </label>
          </div>
        </section>
      </template>

      <!-- Footer bar -->
      <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0B0B0D]/92 px-5 py-4 backdrop-blur lg:left-[252px]">
        <div class="mx-auto flex max-w-[960px] items-center justify-between gap-3">
          <RouterLink
            to="/admin/creators"
            class="inline-flex h-11 items-center rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]"
          >
            Batal
          </RouterLink>
          <div class="flex items-center gap-3">
            <button
              v-if="!isFirstStep && !loading"
              class="h-11 rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]"
              type="button"
              @click="previousStep"
            >
              Kembali
            </button>
            <button
              v-if="!isLastStep && !loading"
              class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:bg-[#7551e9] disabled:opacity-45"
              type="button"
              :disabled="!canContinue"
              @click="nextStep"
            >
              Lanjut
            </button>
            <button
              v-else-if="!loading"
              class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:bg-[#7551e9] disabled:opacity-60"
              type="submit"
              :disabled="saving"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </AppShell>
</template>
