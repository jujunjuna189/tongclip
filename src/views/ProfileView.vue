<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { PhotoIcon, PlusIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const saving = ref(false)
const success = ref('')
const error = ref('')
const avatarFile = ref(null)
const avatarPreview = ref('')
const form = ref({
  name: '',
  handle: '',
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
})

const user = computed(() => store.user)
const initial = computed(() => user.value?.name?.charAt(0)?.toUpperCase() || 'C')
const labelClass = 'text-xs font-medium text-white/44'

const fillForm = () => {
  form.value = {
    name: user.value?.name || '',
    handle: user.value?.handle || '',
    bank_name: user.value?.bank_name || '',
    bank_account_number: user.value?.bank_account_number || '',
    bank_account_name: user.value?.bank_account_name || '',
  }
  avatarPreview.value = user.value?.avatar_url || ''
  avatarFile.value = null
}

const chooseAvatar = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

const saveProfile = async () => {
  saving.value = true
  success.value = ''
  error.value = ''

  try {
    const payload = new FormData()
    payload.append('name', form.value.name)
    payload.append('handle', form.value.handle.trim())
    payload.append('bank_name', form.value.bank_name)
    payload.append('bank_account_number', form.value.bank_account_number)
    payload.append('bank_account_name', form.value.bank_account_name)

    if (avatarFile.value) {
      payload.append('avatar', avatarFile.value)
    }

    await store.updateProfile(payload)
    fillForm()
    success.value = 'Profile berhasil disimpan.'
  } catch (exception) {
    const errors = axios.isAxiosError(exception) ? exception.response?.data?.errors : null
    error.value = errors
      ? Object.values(errors).flat().join(' ')
      : axios.isAxiosError(exception)
        ? exception.response?.data?.message || 'Gagal menyimpan profile.'
        : 'Gagal menyimpan profile.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!store.user) {
    await store.loadMe()
  }

  fillForm()
})
</script>

<template>
  <AppShell>
    <section class="mx-auto grid max-w-[1120px] gap-6 lg:grid-cols-[360px_1fr]">
      <aside class="dark-card rounded-lg p-6">
        <div>
          <div class="flex items-center gap-4">
            <label class="group relative block h-28 w-28 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/[.045]">
              <img v-if="avatarPreview" :src="avatarPreview" alt="" class="h-full w-full object-cover" />
              <span v-else class="grid h-full w-full place-items-center bg-gradient-to-b from-[#a088ff] to-bluebrand text-4xl font-black">
                {{ initial }}
              </span>
              <span class="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-center text-xs font-semibold text-white opacity-100 transition md:opacity-0 md:group-hover:opacity-100">Upload foto</span>
              <input class="sr-only" type="file" accept="image/*" @change="chooseAvatar" />
            </label>

            <label class="cursor-pointer inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[.025] px-4 text-sm font-semibold text-white/80 transition hover:bg-white/[.055]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
              Ganti Foto
              <input class="sr-only" type="file" accept="image/*" @change="chooseAvatar" />
            </label>
          </div>

          <div class="mt-5">
            <h1 class="text-xl font-semibold text-white/90">{{ user?.name || 'Creator' }}</h1>
            <p class="mt-1 text-sm text-white/42">{{ user?.email || user?.handle }}</p>
            <p class="mt-3 inline-flex rounded-full bg-white/[.055] px-3 py-1 text-xs font-semibold text-white/58">{{ user?.role || 'creator' }}</p>
          </div>
        </div>

        <div class="mt-6 rounded-lg border border-white/10 bg-white/[.025] p-4">
          <div class="text-xs text-white/34">Username aktif</div>
          <div class="mt-2 text-lg font-semibold text-gradient-primary">{{ user?.handle || '-' }}</div>
        </div>
      </aside>

      <form class="dark-card rounded-lg p-6" @submit.prevent="saveProfile">
        <div>
          <h2 class="text-xl font-semibold text-white/90">Profile</h2>
          <p class="mt-2 text-sm text-white/42">Ubah identitas akun dan data payout utama.</p>
        </div>

        <div class="mt-6 border-b border-white/10 pb-6">
          <span :class="labelClass">Avatar</span>
          <label class="mt-2 flex min-h-28 cursor-pointer flex-col gap-4 rounded-lg border border-dashed border-white/[.12] bg-black/20 p-4 transition hover:border-purple-300/35 hover:bg-white/[.035] sm:flex-row sm:items-center">
            <span class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-white/[.055] text-white/44">
              <img v-if="avatarPreview" :src="avatarPreview" alt="" class="h-full w-full object-cover" />
              <PhotoIcon v-else class="h-8 w-8" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white/78">Upload avatar</span>
              <span class="mt-1 block text-xs leading-5 text-white/38">Pilih file gambar untuk foto profile creator.</span>
            </span>
            <span class="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 text-xs font-semibold text-white shadow-blue sm:self-center">
              <PlusIcon class="h-4 w-4" />
              Pilih Foto
            </span>
            <input class="sr-only" type="file" accept="image/*" @change="chooseAvatar" />
          </label>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <label class="block">
            <span :class="labelClass">Nama</span>
            <input v-model="form.name" required class="form-control" placeholder="Nama lengkap" />
          </label>
          <label class="block">
            <span :class="labelClass">Username</span>
            <input v-model="form.handle" required class="form-control" placeholder="@handle" />
          </label>
        </div>

        <div class="mt-8 border-t border-white/10 pt-6">
          <h3 class="text-base font-semibold text-white/86">Informasi Payout</h3>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <label class="block">
              <span :class="labelClass">Bank</span>
              <input v-model="form.bank_name" class="form-control" placeholder="BCA" />
            </label>
            <label class="block">
              <span :class="labelClass">Nomor Rekening</span>
              <input v-model="form.bank_account_number" class="form-control" placeholder="1234567890" />
            </label>
            <label class="block md:col-span-2">
              <span :class="labelClass">Nama Rekening</span>
              <input v-model="form.bank_account_name" class="form-control" placeholder="Nama pemilik rekening" />
            </label>
          </div>
        </div>

        <p v-if="success" class="mt-5 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{{ success }}</p>
        <p v-if="error" class="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</p>

        <button class="mt-6 h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-5 text-sm font-semibold text-white shadow-blue disabled:opacity-60" type="submit" :disabled="saving">
          {{ saving ? 'Menyimpan...' : 'Simpan Profile' }}
        </button>
      </form>
    </section>
  </AppShell>
</template>
