<script setup>
import { ref } from 'vue'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const form = ref({
  handle: '',
})
const loading = ref(false)
const message = ref('')
const error = ref('')

const steps = [
  ['Verifikasi identitas', 'Selesai', 'Data pemilik base akun sudah tervalidasi.'],
  ['Validasi akun sosial', 'Dalam peninjauan', 'TikTok, Instagram, dan YouTube sedang dicek.'],
  ['Aktivasi wallet', 'Menunggu', 'Wallet aktif setelah akun sosial disetujui.'],
]

const submitJoinRequest = async () => {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    await store.joinBrand({
      handle: form.value.handle,
    })
    form.value.handle = ''
    message.value = 'Permintaan join brand berhasil dikirim dan menunggu approval owner brand.'
  } catch {
    error.value = 'Permintaan gagal dikirim. Cek handle brand yang kamu tuju.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppShell>
    <h1 class="text-3xl font-black">Peninjauan Akun</h1>
    <div class="mt-6 grid gap-5 md:grid-cols-3">
      <article v-for="(step, index) in steps" :key="step[0]" class="dark-card rounded-lg p-6">
        <div class="text-sm font-black text-gradient-primary">STEP {{ index + 1 }}</div>
        <h2 class="mt-3 text-xl font-black">{{ step[0] }}</h2>
        <p class="mt-3 rounded-lg bg-purple-500/15 px-3 py-2 text-sm font-bold text-purple-100">{{ step[1] }}</p>
        <p class="mt-4 text-sm leading-6 text-white/50">{{ step[2] }}</p>
      </article>
    </div>

    <section class="mt-6 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
      <h2 class="text-base font-semibold text-white/86">Join Brand</h2>
      <form class="mt-5 grid gap-4 md:grid-cols-[1fr_auto]" @submit.prevent="submitJoinRequest">
        <label class="block">
          <span class="text-xs font-medium text-white/44">Handle Brand</span>
          <input v-model="form.handle" required class="form-control" placeholder="@brand.demo" />
        </label>
        <button class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-5 text-sm font-semibold text-white shadow-blue transition hover:bg-[#7551e9] disabled:opacity-60 md:self-end" type="submit" :disabled="loading">
          {{ loading ? 'Mengirim...' : 'Kirim Request' }}
        </button>
      </form>
      <p v-if="message" class="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{{ message }}</p>
      <p v-if="error" class="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</p>
    </section>
  </AppShell>
</template>
