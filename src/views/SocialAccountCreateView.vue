<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const saving = ref(false)
const error = ref('')

const form = ref({
  name: '',
  email: '',
  handle: '',
  platform: 'tiktok',
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
})

const inputClass = 'form-control'
const labelClass = 'text-xs font-medium text-white/44'

const cleanPayload = () => ({
  name: form.value.name.trim(),
  email: form.value.email.trim() || undefined,
  handle: form.value.handle.trim(),
  platform: form.value.platform.trim() || 'tiktok',
  bank_name: form.value.bank_name.trim() || undefined,
  bank_account_number: form.value.bank_account_number.trim() || undefined,
  bank_account_name: form.value.bank_account_name.trim() || undefined,
})

const createAccount = async () => {
  saving.value = true
  error.value = ''

  try {
    await store.createSocialAccount(cleanPayload())
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
    <form class="mx-auto max-w-[720px] pb-24" @submit.prevent="createAccount">
      <div class="flex items-center gap-4">
        <RouterLink
          to="/dashboard"
          class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/62 transition hover:bg-white/[.075] hover:text-white"
        >
          <ArrowLeftIcon class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Tambah Creator</h1>
          <p class="mt-1 text-sm text-white/42">Tambahkan akun sosial baru ke akun creator kamu.</p>
        </div>
      </div>

      <section class="mt-7 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <h2 class="text-base font-semibold text-white/86">Informasi Akun</h2>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="block md:col-span-2">
            <span :class="labelClass">Nama Akun</span>
            <input v-model="form.name" required :class="inputClass" placeholder="Nama akun sosial" />
          </label>
          <label class="block">
            <span :class="labelClass">Handle</span>
            <input v-model="form.handle" required :class="inputClass" placeholder="@handle" />
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
          <label class="block md:col-span-2">
            <span :class="labelClass">Email Akun</span>
            <input v-model="form.email" type="email" :class="inputClass" placeholder="Opsional" />
          </label>
        </div>
      </section>

      <section class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <h2 class="text-base font-semibold text-white/86">Rekening</h2>
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
        <div class="mx-auto flex max-w-[720px] items-center justify-between gap-3">
          <RouterLink
            to="/dashboard"
            class="inline-flex h-11 items-center rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]"
          >
            Batal
          </RouterLink>
          <button
            class="btn-blue inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold disabled:opacity-60"
            type="submit"
            :disabled="saving"
          >
            <PlusIcon class="h-4 w-4" />
            {{ saving ? 'Menyimpan...' : 'Tambah Creator' }}
          </button>
        </div>
      </div>
    </form>
  </AppShell>
</template>
