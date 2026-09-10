<script setup>
import LogoMark from '../components/LogoMark.vue'

const stats = [
  ['10.241+', 'Total Member'],
  ['20.504+', 'Total Pesanan'],
  ['500JT+', 'Budget Campaign'],
  ['3 Hari', 'Estimasi Payout'],
]
const steps = [
  ['Join Campaign', 'Pilih campaign brand, cek brief, rate per views, budget tersisa, dan platform yang didukung.'],
  ['Upload Konten', 'Posting clip ke TikTok, Instagram, atau YouTube, lalu submit link video ke dashboard.'],
  ['Tarik Saldo', 'Views divalidasi, pendapatan tercatat, withdraw dibuka tanggal 15 & 16 tiap bulan.'],
]
</script>

<template>
  <main class="hero-bg min-h-screen overflow-hidden">
    <header class="mx-auto flex max-w-7xl items-center justify-between px-5 py-7 md:px-8">
      <RouterLink to="/"><LogoMark /></RouterLink>
      <nav class="hidden items-center gap-10 text-sm font-semibold text-white/62 lg:flex">
        <a href="#fitur" class="hover:text-white">Fitur</a>
        <a href="#cara-kerja" class="hover:text-white">Cara Kerja</a>
        <RouterLink to="/campaigns" class="hover:text-white">Campaign</RouterLink>
        <RouterLink to="/hubungi-admin" class="hover:text-white">Kontak</RouterLink>
      </nav>
      <RouterLink to="/auth" class="btn-blue rounded-lg px-8 py-3 text-sm font-bold">Member Area</RouterLink>
    </header>

    <section class="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-5 pb-20 pt-10 md:px-8 lg:grid-cols-[1.05fr_.95fr]">
      <div class="relative z-10">
        <p class="mb-5 inline-flex rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-bold text-gradient-primary">Creator Brand Marketplace</p>
        <h1 class="max-w-5xl text-5xl font-light leading-tight tracking-normal md:text-7xl">
          Ladang cuan baru buat <span class="font-semibold text-gradient-primary drop-shadow-[0_0_18px_rgba(136,107,255,.8)]">clipper</span> di Indonesia.
        </h1>
        <p class="mt-7 max-w-3xl text-lg leading-9 text-white/72">
          Gabung campaign brand, clipping konten, submit video, dan pantau pendapatan dalam satu dashboard yang simpel buat creator.
        </p>
        <div class="mt-9 flex flex-wrap gap-4">
          <RouterLink to="/auth" class="btn-blue rounded-lg px-8 py-4 text-base font-bold">Clipping Sekarang</RouterLink>
          <a href="#cara-kerja" class="rounded-lg border border-white/55 px-8 py-4 text-base font-bold text-white hover:bg-white/10">Lihat Cara Kerja</a>
        </div>
        <div class="mt-14 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
          <div v-for="stat in stats" :key="stat[1]">
            <div class="text-3xl font-black">{{ stat[0] }}</div>
            <div class="mt-2 text-sm text-white/55">{{ stat[1] }}</div>
          </div>
        </div>
      </div>

      <div class="relative min-h-[560px]">
        <div class="absolute right-4 top-8 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-bluebrand/80 to-blueglow/30 blur-[1px]"></div>
        <div class="glass absolute right-0 top-2 w-80 rounded-lg p-5 shadow-card">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-white/55">Payout ID : 120</span>
            <span class="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-black text-gradient-primary">Approved</span>
          </div>
          <div class="mt-8 grid grid-cols-2 gap-4">
            <div><div class="text-sm text-white/45">Views Jumlah</div><div class="mt-1 text-3xl font-black">20K</div></div>
            <div><div class="text-sm text-white/45">Saldo Masuk</div><div class="mt-1 text-3xl font-black text-gradient-primary">Rp100K</div></div>
          </div>
        </div>
        <div class="glass absolute bottom-16 left-0 w-[400px] overflow-hidden rounded-lg shadow-card">
          <div class="h-56 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center"></div>
          <div class="p-5">
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-[#a088ff] to-bluebrand font-black">S</div>
              <div><div class="font-black">Sulianto Indria Putra</div><div class="text-sm text-white/45">@superclips 2 hari lalu</div></div>
            </div>
            <div class="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div><div class="text-white/45">Views</div><div class="font-black">250K</div></div>
              <div><div class="text-white/45">Payout</div><div class="font-black text-gradient-primary">Rp1.4JT</div></div>
              <div><div class="text-white/45">Claim</div><div class="font-black">1000/1000</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="fitur" class="mx-auto max-w-7xl px-5 pb-10 md:px-8">
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="feature in ['Multi akun dalam 1 base akun', 'Penarikan dana tanggal 15 & 16', 'Campaign clipping', 'Pencatatan pendapatan', 'Course gratis']" :key="feature" class="dark-card rounded-lg p-5">
          <div class="mb-5 h-2 w-14 rounded-full bg-gradient-to-b from-[#a088ff] to-bluebrand"></div>
          <h3 class="text-xl font-black">{{ feature }}</h3>
        </div>
      </div>
    </section>

    <section id="cara-kerja" class="mx-auto max-w-7xl px-5 pb-24 md:px-8">
      <div class="rounded-[28px] bg-white p-6 text-slate-950 md:p-10">
        <p class="font-black text-gradient-primary">Gimana Cara Kerjanya?</p>
        <h2 class="mt-2 text-4xl font-black tracking-tight">3 langkah doang. Tinggal posting, cuan ngalir.</h2>
        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <article v-for="(step, index) in steps" :key="step[0]" class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-b from-[#a088ff] to-bluebrand text-xl font-black text-white">{{ index + 1 }}</div>
            <h3 class="mt-5 text-xl font-black">{{ step[0] }}</h3>
            <p class="mt-3 leading-7 text-slate-600">{{ step[1] }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
