<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'
import LogoMark from '../components/LogoMark.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const checking = ref(false)
const error = ref('')
let statusTimer

const isRejected = computed(() => ['rejected', 'blocked'].includes(String(store.user?.status || '').toLowerCase()))

const checkStatus = async () => {
  if (checking.value) return
  checking.value = true
  error.value = ''

  try {
    const user = await store.loadMe()
    if (String(user.status || '').toLowerCase() === 'active') {
      router.replace('/dashboard')
    }
  } catch {
    error.value = 'Status belum dapat diperbarui. Silakan coba lagi beberapa saat.'
  } finally {
    checking.value = false
  }
}

onMounted(() => {
  checkStatus()
  statusTimer = window.setInterval(checkStatus, 10000)
})

onBeforeUnmount(() => {
  window.clearInterval(statusTimer)
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-10 text-white">
    <section class="w-full max-w-[680px]">
      <div class="flex justify-center">
        <LogoMark />
      </div>

      <div class="mt-10 rounded-lg border border-white/10 bg-white/[.028] p-6 text-center md:p-9">
        <div class="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-purple-300/25 bg-purple-500/12 text-purple-200">
          <ShieldCheckIcon v-if="!isRejected" class="h-7 w-7" />
          <DocumentCheckIcon v-else class="h-7 w-7" />
        </div>

        <p class="mt-6 text-sm font-semibold text-purple-200/80">Status pendaftaran</p>
        <h1 class="mt-3 text-[28px] font-semibold leading-tight md:text-[32px]">
          {{ isRejected ? 'Pendaftaran kamu belum disetujui' : 'Pendaftaran kamu sedang kami tinjau' }}
        </h1>
        <p class="mx-auto mt-4 max-w-[540px] text-sm leading-7 text-white/48 md:text-base">
          <template v-if="isRejected">
            Tim kami menemukan informasi yang perlu diperbaiki sebelum akun dapat diaktifkan. Silakan baca catatan berikut, lalu hubungi admin setelah datanya diperbarui.
          </template>
          <template v-else>
            Terima kasih sudah bergabung dengan Tongkrongan Clipper. Tim kami sedang memeriksa informasi akun dan profil sosialmu untuk memastikan semuanya sesuai. Kamu akan mendapatkan akses dashboard setelah pendaftaran disetujui.
          </template>
        </p>

        <div v-if="isRejected" class="mt-7 rounded-lg border border-red-300/20 bg-red-400/[.07] p-5 text-left">
          <p class="text-xs font-semibold uppercase text-red-100/55">Catatan admin</p>
          <p class="mt-3 whitespace-pre-line text-sm leading-6 text-red-50/82">{{ store.user?.rejection_note || 'Silakan hubungi admin untuk mendapatkan informasi lebih lanjut.' }}</p>
        </div>

        <div v-else class="mt-8 grid gap-3 text-left sm:grid-cols-3">
          <div class="rounded-lg border border-emerald-300/15 bg-emerald-400/[.06] p-4">
            <CheckCircleIcon class="h-5 w-5 text-emerald-200" />
            <p class="mt-3 text-sm font-semibold text-white/82">Data terkirim</p>
            <p class="mt-1 text-xs leading-5 text-white/38">Informasi pendaftaran sudah kami terima.</p>
          </div>
          <div class="rounded-lg border border-purple-300/25 bg-purple-500/[.08] p-4">
            <ClockIcon class="h-5 w-5 text-purple-200" />
            <p class="mt-3 text-sm font-semibold text-white/82">Sedang ditinjau</p>
            <p class="mt-1 text-xs leading-5 text-white/38">Admin sedang memeriksa kelengkapan akun.</p>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
            <ShieldCheckIcon class="h-5 w-5 text-white/34" />
            <p class="mt-3 text-sm font-semibold text-white/60">Akses dashboard</p>
            <p class="mt-1 text-xs leading-5 text-white/32">Terbuka otomatis setelah disetujui.</p>
          </div>
        </div>

        <p v-if="error" class="mt-5 rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</p>

        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-5 text-sm font-semibold text-white shadow-blue disabled:opacity-60"
            type="button"
            :disabled="checking"
            @click="checkStatus"
          >
            <ArrowPathIcon class="h-4 w-4" :class="checking ? 'animate-spin' : ''" />
            {{ checking ? 'Memeriksa...' : 'Cek Status' }}
          </button>
          <RouterLink to="/logout" class="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[.045] px-5 text-sm font-semibold text-white/62 transition hover:bg-white/[.075] hover:text-white">
            Keluar dari akun
          </RouterLink>
        </div>

        <p class="mt-6 text-xs leading-5 text-white/30">Halaman ini akan memperbarui status secara otomatis.</p>
      </div>
    </section>
  </main>
</template>
