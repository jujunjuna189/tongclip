<script setup>
import { ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import LogoMark from '../components/LogoMark.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

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

const register = async () => {
  loading.value = true
  error.value = ''

  try {
    await store.register({
      name: name.value,
      email: email.value,
      handle: handle.value,
      password: password.value,
    })
    router.push('/onboarding')
  } catch (exception) {
    const errors = axios.isAxiosError(exception) ? exception.response?.data?.errors : null
    error.value = errors
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

        <form class="mt-10" @submit.prevent="register">
          <label class="block text-sm font-medium text-white/58">Nama Lengkap</label>
          <input v-model="name" required class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="Nama kamu" />

          <label class="mt-6 block text-sm font-medium text-white/58">Email</label>
          <input v-model="email" required type="email" class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="nama@email.com" />

          <label class="mt-6 block text-sm font-medium text-white/58">Handle (Username)</label>
          <input v-model="handle" @input="onHandleInput" required type="text" class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="username" />

          <label class="mt-6 block text-sm font-medium text-white/58">Password</label>
          <input v-model="password" required minlength="8" type="password" class="mt-3 h-14 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70" placeholder="Minimal 8 karakter" />

          <p v-if="error" class="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</p>

          <button type="submit" class="mt-10 flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#a088ff] to-bluebrand text-base font-medium text-white shadow-[0_0_26px_rgba(136,107,255,.34)] transition hover:bg-[#7551e9] disabled:opacity-60" :disabled="loading">
            {{ loading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}
          </button>
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
