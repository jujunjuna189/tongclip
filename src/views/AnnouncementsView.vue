<script setup>
import { computed, onMounted } from 'vue'
import { CheckCircleIcon, MegaphoneIcon, QuestionMarkCircleIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const announcements = computed(() => store.announcements)
const faqs = [
  {
    question: 'Bagaimana cara ikut campaign?',
    answer: 'Buka menu Campaigns, pilih campaign yang sesuai, baca brief dan aturan brand, lalu submit link video lewat halaman detail campaign.',
  },
  {
    question: 'Kenapa submission saya masih pending?',
    answer: 'Submission perlu dicek admin terlebih dahulu. Status akan berubah setelah link, konten, dan aturan campaign selesai diverifikasi.',
  },
  {
    question: 'Kapan pendapatan bisa dicairkan?',
    answer: 'Pendapatan yang sudah valid akan masuk ke saldo Bisa Dicairkan. Kamu bisa mengajukan withdraw sesuai minimum dan data rekening yang tersimpan.',
  },
  {
    question: 'Apakah bisa memakai lebih dari satu akun sosial?',
    answer: 'Bisa, selama akun tersebut terhubung dan punya akses aktif. Pilih akun yang ingin dipakai melalui dropdown akun di bagian atas dashboard.',
  },
]
const rules = [
  'Konten harus sesuai brief campaign dan tidak boleh memakai materi yang melanggar hak cipta.',
  'Link video yang dikirim harus bisa diakses admin selama proses review berlangsung.',
  'Manipulasi views, spam submission, atau aktivitas tidak wajar dapat membuat submission ditolak.',
  'Reward hanya dihitung untuk submission yang valid dan memenuhi aturan campaign.',
  'Data rekening dan profil harus benar agar proses payout tidak tertunda.',
]

onMounted(() => store.loadAnnouncements())
</script>

<template>
  <AppShell>
    <section class="w-full pb-24">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[.16em] text-purple-200/70">Bantuan</p>
          <h1 class="mt-2 text-3xl font-black tracking-[-.03em]">FAQ & Peraturan</h1>
          <p class="mt-2 max-w-2xl text-white/50">Panduan singkat untuk creator menjalankan campaign, submission, dan payout dengan aman.</p>
        </div>
      </div>

      <div class="mt-7 grid gap-4 lg:grid-cols-3">
        <article class="dark-card rounded-lg p-5">
          <div class="grid h-11 w-11 place-items-center rounded-lg bg-purple-500/14 text-purple-200">
            <QuestionMarkCircleIcon class="h-6 w-6 stroke-[1.8]" />
          </div>
          <h2 class="mt-4 text-base font-semibold text-white/88">FAQ</h2>
          <p class="mt-2 text-sm leading-6 text-white/48">Jawaban untuk pertanyaan yang paling sering ditanyakan creator.</p>
        </article>
        <article class="dark-card rounded-lg p-5">
          <div class="grid h-11 w-11 place-items-center rounded-lg bg-sky-500/14 text-sky-200">
            <ShieldCheckIcon class="h-6 w-6 stroke-[1.8]" />
          </div>
          <h2 class="mt-4 text-base font-semibold text-white/88">Peraturan</h2>
          <p class="mt-2 text-sm leading-6 text-white/48">Aturan dasar supaya submission tidak tertolak dan payout lancar.</p>
        </article>
        <article class="dark-card rounded-lg p-5">
          <div class="grid h-11 w-11 place-items-center rounded-lg bg-cyan-500/14 text-cyan-200">
            <MegaphoneIcon class="h-6 w-6 stroke-[1.8]" />
          </div>
          <h2 class="mt-4 text-base font-semibold text-white/88">Pengumuman</h2>
          <p class="mt-2 text-sm leading-6 text-white/48">Info terbaru dari admin terkait platform dan campaign.</p>
        </article>
      </div>

      <div class="mt-8 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section class="dark-card rounded-lg p-5">
          <div class="flex items-center gap-3">
            <QuestionMarkCircleIcon class="h-5 w-5 text-purple-200" />
            <h2 class="text-lg font-semibold tracking-[-.01em]">FAQ</h2>
          </div>

          <div class="mt-5 divide-y divide-white/8">
            <article v-for="item in faqs" :key="item.question" class="py-4 first:pt-0 last:pb-0">
              <h3 class="text-sm font-semibold text-white/86">{{ item.question }}</h3>
              <p class="mt-2 text-sm leading-6 text-white/50">{{ item.answer }}</p>
            </article>
          </div>
        </section>

        <section class="dark-card rounded-lg p-5">
          <div class="flex items-center gap-3">
            <ShieldCheckIcon class="h-5 w-5 text-sky-200" />
            <h2 class="text-lg font-semibold tracking-[-.01em]">Peraturan Umum</h2>
          </div>

          <div class="mt-5 grid gap-3">
            <div v-for="rule in rules" :key="rule" class="flex gap-3 rounded-lg border border-white/8 bg-white/[.025] p-4">
              <CheckCircleIcon class="mt-0.5 h-5 w-5 shrink-0 text-emerald-200/80" />
              <p class="text-sm leading-6 text-white/56">{{ rule }}</p>
            </div>
          </div>
        </section>
      </div>

      <section class="dark-card mt-6 rounded-lg p-5">
        <div class="flex items-center gap-3">
          <MegaphoneIcon class="h-5 w-5 text-cyan-200" />
          <h2 class="text-lg font-semibold tracking-[-.01em]">Pengumuman Admin</h2>
        </div>

        <div class="mt-5 grid gap-3">
          <div v-if="!announcements.length" class="grid h-28 place-items-center rounded-lg border border-dashed border-white/10 bg-white/[.025] text-sm text-white/38">
            Belum ada pengumuman.
          </div>

          <article v-for="item in announcements" :key="item.title" class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
            <h3 class="text-base font-semibold text-white/88">{{ item.title }}</h3>
            <p class="mt-2 leading-7 text-white/54">{{ item.body }}</p>
            <p v-if="item.published_at" class="mt-3 text-xs text-white/34">{{ item.published_at }}</p>
          </article>
        </div>
      </section>
    </section>
  </AppShell>
</template>
