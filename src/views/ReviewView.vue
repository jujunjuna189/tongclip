<script setup>
import AppShell from '../components/AppShell.vue'

const steps = [
  ['Verifikasi identitas', 'Selesai', 'Data pemilik base akun sudah tervalidasi.'],
  ['Validasi akun sosial', 'Dalam peninjauan', 'TikTok, Instagram, dan YouTube sedang dicek.'],
  ['Aktivasi wallet', 'Menunggu', 'Wallet aktif setelah akun sosial disetujui.'],
]
</script>

<template>
  <AppShell>
    <h1 class="text-3xl font-black">Peninjauan Akun</h1>
    <div class="mt-6 grid gap-5 md:grid-cols-3">
      <article v-for="(step, index) in steps" :key="step[0]" class="dark-card rounded-lg p-6">
        <div class="text-sm font-black text-blue-300">STEP {{ index + 1 }}</div>
        <h2 class="mt-3 text-xl font-black">{{ step[0] }}</h2>
        <p class="mt-3 rounded-lg bg-blue-500/15 px-3 py-2 text-sm font-bold text-blue-100">{{ step[1] }}</p>
        <p class="mt-4 text-sm leading-6 text-white/50">{{ step[2] }}</p>
      </article>
    </div>
  </AppShell>
</template>
