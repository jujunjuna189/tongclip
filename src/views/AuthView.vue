<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { EyeIcon } from '@heroicons/vue/24/outline'
import LogoMark from '../components/LogoMark.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const role = ref('Creator')
const identifier = ref('@tongkrongan.clip')
const password = ref('password')
const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    await store.login(identifier.value, password.value)
    router.push('/dashboard')
  } catch (exception) {
    error.value = axios.isAxiosError(exception)
      ? exception.response?.data?.message || exception.response?.data?.errors?.identifier?.[0] || 'Login gagal. Cek email dan password.'
      : 'Login gagal. Cek email dan password.'
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
          <h1 class="text-[34px] font-semibold leading-tight tracking-[-.035em]">Selamat datang di Clipper</h1>
          <p class="mt-5 text-base font-normal text-white/48">Login sebagai {{ role }}</p>
        </div>

        <div class="mt-12 grid h-16 grid-cols-2 rounded-xl border border-white/10 bg-white/[.055] p-1">
          <button
            class="rounded-lg text-sm font-medium transition"
            :class="role === 'Creator' ? 'bg-bluebrand text-white shadow-[0_0_22px_rgba(31,107,255,.32)]' : 'text-white/48 hover:text-white'"
            type="button"
            @click="role = 'Creator'"
          >
            Sebagai Creator
          </button>
          <button
            class="rounded-lg text-sm font-medium transition"
            :class="role === 'Brand' ? 'bg-bluebrand text-white shadow-[0_0_22px_rgba(31,107,255,.32)]' : 'text-white/48 hover:text-white'"
            type="button"
            @click="role = 'Brand'"
          >
            Sebagai Brand
          </button>
        </div>

        <button class="mt-10 flex h-16 items-center justify-center gap-4 rounded-xl border border-white/10 bg-white/[.055] text-base font-medium text-white/78 transition hover:border-white/18 hover:bg-white/[.075]">
          <span class="text-2xl font-semibold text-blue-400">G</span>
          Lanjutkan dengan Google
        </button>

        <div class="my-8 flex items-center gap-7 text-sm text-white/48">
          <span class="h-px flex-1 bg-white/14"></span>
          Atau lanjutkan dengan
          <span class="h-px flex-1 bg-white/14"></span>
        </div>

        <form @submit.prevent="login">
          <label class="block text-sm font-medium text-white/58">Email / Handle Akun</label>
          <input
            class="mt-3 h-16 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-blue-500/70"
            placeholder="Email atau @handle"
            v-model="identifier"
          />

          <div class="mt-7 flex items-center justify-between">
            <label class="block text-sm font-medium text-white/58">Password</label>
            <button class="text-sm font-medium text-blueglow" type="button">Lupa password?</button>
          </div>
          <div class="relative mt-3">
            <input
              class="h-16 w-full rounded-xl border border-white/10 bg-black/20 px-5 pr-14 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-blue-500/70"
              placeholder="Password"
              type="password"
              v-model="password"
            />
            <button class="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-white/50" type="button">
              <EyeIcon class="h-5 w-5 stroke-[1.8]" />
            </button>
          </div>

          <p v-if="error" class="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</p>

          <button type="submit" class="mt-12 flex h-16 w-full items-center justify-center rounded-xl bg-bluebrand text-base font-medium text-white shadow-[0_0_26px_rgba(31,107,255,.34)] transition hover:bg-[#2D78FF] disabled:opacity-60" :disabled="loading">
            {{ loading ? 'Masuk...' : 'Login' }}
          </button>
        </form>

        <p class="mt-10 text-center text-base text-white/45">
          Belum punya akun?
          <RouterLink to="/peninjauan-akun" class="font-medium text-blueglow">Daftar Sekarang!</RouterLink>
        </p>

        <div class="mt-12 flex justify-center gap-6 text-xs text-white/28">
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </section>

    <section class="relative hidden min-h-screen overflow-hidden bg-[#030918] lg:block">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(31,107,255,.34),transparent_38%),linear-gradient(120deg,rgba(112,185,255,.14),rgba(0,0,0,.78))]"></div>
      <div class="absolute inset-0 opacity-45" style="background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px); background-size: 18px 18px;"></div>
      <div class="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2">
        <div class="absolute left-4 top-28 h-28 w-[520px] -skew-x-[42deg] rounded-xl bg-gradient-to-r from-blueglow to-bluebrand shadow-[0_0_90px_rgba(31,107,255,.34)]"></div>
        <div class="absolute bottom-16 left-72 h-28 w-[420px] skew-x-[42deg] rounded-xl bg-gradient-to-r from-[#0B2F85] to-bluebrand opacity-80"></div>
        <div class="absolute left-[335px] top-[190px] h-32 w-44 rotate-45 rounded-3xl bg-[#030918]"></div>
      </div>
    </section>
  </main>
</template>
