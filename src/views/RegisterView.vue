<script setup>
import { ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import LogoMark from '../components/LogoMark.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const name = ref('')
const email = ref('')
const password = ref('')
const whatsappNumber = ref('')
const socialAccounts = ref([
  { id: 1, platform: 'tiktok', handle: '', social_url: '' },
  { id: 2, platform: 'instagram', handle: '', social_url: '' },
  { id: 3, platform: 'youtube', handle: '', social_url: '' },
  { id: 4, platform: 'facebook', handle: '', social_url: '' },
])
const platforms = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
]
const socialPrefixes = { tiktok: 'tik_', instagram: 'ig_', youtube: 'yt_', facebook: 'fb_' }
const socialHandle = (platform, username) => {
  const prefix = socialPrefixes[platform]
  const cleanUsername = username.trim().replace(/^@+/, '')
  return `${prefix}${cleanUsername.startsWith(prefix) ? cleanUsername.slice(prefix.length) : cleanUsername}`
}
let nextSocialId = 4
const addSocialAccount = () => {
  socialAccounts.value.push({ id: ++nextSocialId, platform: 'tiktok', handle: '', social_url: '' })
}
const removeSocialAccount = (id) => {
  if (id === 1) return
  socialAccounts.value = socialAccounts.value.filter((account) => account.id !== id)
}
const loading = ref(false)
const error = ref('')
const currentStep = ref(0)

const handle = ref('')
const handleManuallyChanged = ref(false)

watch(email, (newEmail) => {
  if (!handleManuallyChanged.value) {
    handle.value = newEmail
      .split('@')[0]
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '')
  }
})

const onHandleInput = () => {
  handleManuallyChanged.value = true
}

const nextStep = () => {
  error.value = ''
  currentStep.value = 1
}

const previousStep = () => {
  error.value = ''
  currentStep.value = 0
}

const register = async () => {
  if (!socialAccounts.value.length) {
    error.value = 'Tambahkan minimal satu akun sosial sebelum mendaftar.'
    return
  }
  loading.value = true
  error.value = ''

  try {
    await store.register({
      name: name.value,
      email: email.value,
      handle: handle.value,
      password: password.value,
      whatsapp_number: whatsappNumber.value,
      social_accounts: socialAccounts.value.map(({ platform, handle: accountHandle, social_url }) => ({
        platform,
        handle: socialHandle(platform, accountHandle),
        social_url,
      })),
    })
    router.push('/menunggu-persetujuan')
  } catch (exception) {
    const errors = axios.isAxiosError(exception) ? exception.response?.data?.errors : null
    error.value = axios.isAxiosError(exception) && exception.code === 'ECONNABORTED'
      ? 'Server belum merespons. Silakan periksa koneksi lalu coba daftar kembali.'
      : errors
      ? Object.values(errors).flat().join(' ')
      : axios.isAxiosError(exception)
        ? exception.response?.data?.message || 'Daftar gagal. Cek data kamu.'
        : 'Daftar gagal. Cek data kamu.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="grid min-h-screen bg-[#080808] text-white lg:grid-cols-2">
    <section class="flex min-h-screen flex-col px-8 py-10 lg:px-14">
      <RouterLink to="/" class="inline-flex">
        <LogoMark />
      </RouterLink>

      <div class="mx-auto flex w-full max-w-[530px] grow flex-col justify-center py-10">
        <div class="text-center">
          <h1 class="text-[34px] font-semibold leading-tight tracking-[-.035em]">Buat akun Clipper</h1>
          <p class="mt-5 text-base font-normal text-white/48">Lengkapi data awal untuk mulai peninjauan akun.</p>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-3">
          <div class="flex h-14 items-center gap-2 rounded-lg border px-3" :class="currentStep === 0 ? 'border-purple-400/45 bg-purple-500/10' : 'border-emerald-300/20 bg-emerald-400/[.06]'">
            <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-semibold" :class="currentStep === 0 ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : 'bg-emerald-400/15 text-emerald-100'">1</span>
            <span class="whitespace-nowrap text-xs font-semibold text-white/78 sm:text-sm">Data Akun</span>
          </div>
          <div class="flex h-14 items-center gap-2 rounded-lg border px-3" :class="currentStep === 1 ? 'border-purple-400/45 bg-purple-500/10' : 'border-white/[.08] bg-white/[.025]'">
            <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-semibold" :class="currentStep === 1 ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : 'bg-white/[.055] text-white/44'">2</span>
            <span class="whitespace-nowrap text-xs font-semibold text-white/78 sm:text-sm">Kontak & Sosial</span>
          </div>
        </div>

        <form class="mt-7" @submit.prevent="currentStep === 0 ? nextStep() : register()">
          <div v-if="currentStep === 0">
            <label class="block text-sm font-medium text-white/58">Nama Lengkap</label>
            <input v-model="name" required class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="Nama kamu" />

            <label class="mt-6 block text-sm font-medium text-white/58">Email</label>
            <input v-model="email" required type="email" class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="nama@email.com" />

            <label class="mt-6 block text-sm font-medium text-white/58">Username</label>
            <input v-model="handle" @input="onHandleInput" required type="text" class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="username" />
            <p class="mt-2 text-xs text-white/38">Isi dengan username Telegram kamu. Terisi otomatis dari email, tetapi bisa diubah jika berbeda.</p>

            <label class="mt-6 block text-sm font-medium text-white/58">Password</label>
            <input v-model="password" required minlength="8" type="password" class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="Minimal 8 karakter" />
          </div>

          <div v-else>
            <h2 class="text-base font-semibold text-white/82">Kontak & Akun Sosial</h2>
            <p class="mt-1 text-sm text-white/38">Tambahkan kontak dan link akun yang kamu gunakan.</p>

            <div class="mt-5">
              <label class="block">
                <span class="text-sm font-medium text-white/58">No. WhatsApp</span>
                <input v-model="whatsappNumber" required type="tel" class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="081234567890" />
              </label>
              <div class="mt-7 flex items-center justify-between gap-3">
                <h3 class="text-sm font-semibold text-white/78">Akun sosial diajukan</h3>
                <button type="button" class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-purple-300/25 bg-purple-500/10 px-3 text-xs font-semibold text-purple-100 transition hover:bg-purple-500/20" @click="addSocialAccount">
                  <PlusIcon class="h-4 w-4" /> Tambah link akun
                </button>
              </div>
              <div v-for="(account, index) in socialAccounts" :key="account.id" class="mt-3 rounded-lg border border-white/10 bg-white/[.025] p-4">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-sm font-semibold text-white/74">{{ index === 0 ? 'Akun TikTok utama' : `Akun ${platforms.find((platform) => platform.value === account.platform)?.label}` }}</span>
                  <button v-if="index > 0" type="button" class="grid h-8 w-8 place-items-center rounded-lg text-white/40 transition hover:bg-red-400/10 hover:text-red-200" aria-label="Hapus akun sosial" @click="removeSocialAccount(account.id)"><TrashIcon class="h-4 w-4" /></button>
                </div>
                <div class="mt-3 grid gap-4 sm:grid-cols-2">
                  <label class="block">
                    <span class="text-sm font-medium text-white/58">Platform</span>
                    <select v-model="account.platform" required :disabled="index === 0" class="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#15151a] px-3 text-sm text-white outline-none focus:border-purple-500/70 disabled:opacity-70">
                      <option v-for="platform in platforms" :key="platform.value" :value="platform.value">{{ platform.label }}</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="text-sm font-medium text-white/58">Username</span>
                    <span class="mt-2 flex h-12 items-center rounded-lg border border-white/10 bg-black/20 px-3 focus-within:border-purple-500/70">
                      <span class="shrink-0 text-sm text-white/50">@{{ socialPrefixes[account.platform] }}</span>
                      <input v-model="account.handle" required maxlength="250" class="min-w-0 flex-1 bg-transparent pl-1 text-sm text-white outline-none placeholder:text-white/22" placeholder="username" @input="account.handle = account.handle.replace(/^@+/, '')" />
                    </span>
                  </label>
                </div>
                <label class="mt-4 block">
                  <span class="text-sm font-medium text-white/58">Link profil</span>
                  <input v-model="account.social_url" required type="url" class="mt-2 h-12 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="https://..." />
                </label>
              </div>
            </div>
          </div>

          <p v-if="error" class="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</p>

          <button v-if="currentStep === 0" type="submit" class="mt-10 flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#a088ff] to-bluebrand text-base font-medium text-white shadow-[0_0_26px_rgba(136,107,255,.34)] transition hover:bg-[#7551e9]">
            Lanjut
          </button>

          <div v-else class="mt-10 grid grid-cols-[auto_1fr] gap-3">
            <button type="button" class="h-14 rounded-xl border border-white/10 bg-white/[.055] px-6 text-base font-medium text-white/72 transition hover:bg-white/[.085]" @click="previousStep">
              Kembali
            </button>
            <button type="submit" class="flex h-14 items-center justify-center rounded-xl bg-gradient-to-b from-[#a088ff] to-bluebrand px-5 text-base font-medium text-white shadow-[0_0_26px_rgba(136,107,255,.34)] transition hover:bg-[#7551e9] disabled:opacity-60" :disabled="loading">
              {{ loading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}
            </button>
          </div>
        </form>

        <p class="mt-8 text-center text-base text-white/45">
          Sudah punya akun?
          <RouterLink to="/auth" class="font-medium text-blueglow">Login</RouterLink>
        </p>
      </div>
    </section>

    <section class="relative hidden min-h-screen overflow-hidden bg-[#030918] lg:block">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(136,107,255,.34),transparent_38%),linear-gradient(120deg,rgba(223,198,255,.14),rgba(0,0,0,.78))]"></div>
      <div class="absolute inset-0 opacity-45" style="background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px); background-size: 18px 18px;"></div>
      <div class="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2">
        <div class="absolute left-4 top-28 h-28 w-[520px] -skew-x-[42deg] rounded-xl bg-gradient-to-r from-blueglow to-bluebrand shadow-[0_0_90px_rgba(136,107,255,.34)]"></div>
        <div class="absolute bottom-16 left-72 h-28 w-[420px] skew-x-[42deg] rounded-xl bg-gradient-to-r from-[#2b106c] to-bluebrand opacity-80"></div>
        <div class="absolute left-[335px] top-[190px] h-32 w-44 rotate-45 rounded-3xl bg-[#030918]"></div>
      </div>
    </section>
  </main>
</template>
