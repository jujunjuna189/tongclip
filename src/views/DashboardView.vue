<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FunnelIcon,
  GiftIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import CampaignCard from '../components/CampaignCard.vue'
import StatCard from '../components/StatCard.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const tabs = ['Semua', 'Pending', 'Approved', 'Rejected', 'Need Action', 'Deleted']
const activeTab = ref('Semua')
const campaigns = computed(() => store.campaigns)
const submissions = computed(() => store.submissions)
const stats = computed(() => store.stats.length ? store.stats : [
  { label: 'Total Pendapatan', value: 'Rp0' },
  { label: 'Bisa Dicairkan', value: 'Rp0' },
  { label: 'Total Video', value: '0 Video' },
])

onMounted(() => store.loadDashboard())
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Selamat datang, Clip Master</h1>

      <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard v-for="stat in stats" :key="stat.label" :label="stat.label" :value="stat.value" />
      </div>

      <section class="dark-card relative mt-7 overflow-hidden rounded-lg p-5 md:p-6">
        <div class="flex flex-wrap items-center justify-between gap-5">
          <div class="flex items-center gap-5">
            <div class="grid h-14 w-14 place-items-center rounded-full bg-blue-500/15 text-blue-200 shadow-blue">
              <GiftIcon class="h-7 w-7 stroke-[1.6]" />
            </div>
            <div>
              <h2 class="text-[25px] font-semibold uppercase leading-none tracking-[-.025em]">Daily Quest!</h2>
              <p class="mt-3 text-sm font-normal text-white/50">Submit 1/hari sampai 7 kali</p>
            </div>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full border border-blue-400/50 bg-blue-500/15 px-6 py-2.5 text-sm font-semibold text-blue-100 shadow-blue">
            <GiftIcon class="h-[18px] w-[18px] stroke-[1.8]" />
            Rp 15.000
          </div>
        </div>

        <div class="mt-6 rounded-lg border border-white/8 bg-black/28 p-4">
          <div class="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            <div v-for="day in 7" :key="day" class="grid aspect-[1.75/1] place-items-center rounded-lg border border-white/8 bg-white/[.035] text-sm font-medium text-white/48">
              <span v-if="day < 7">H {{ day }}</span>
              <GiftIcon v-else class="h-6 w-6 text-blue-400/45" />
            </div>
          </div>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center text-sm font-medium text-white/78">
              <span class="grid h-7 w-7 place-items-center rounded-full bg-blue-500/30 text-[10px]">DA</span>
              <span class="-ml-2 grid h-7 w-7 place-items-center rounded-full bg-sky-500/30 text-[10px]">RE</span>
              <span class="-ml-2 grid h-7 w-7 place-items-center rounded-full bg-cyan-500/30 text-[10px]">NC</span>
              <span class="ml-3"><span class="text-blue-300">1.000+</span> Orang Telah Claim Hadiah</span>
            </div>
          </div>
        </div>

        <button class="mt-3 flex h-11 w-full items-center justify-between rounded-lg border border-white/8 bg-white/[.025] px-4 text-left text-sm font-medium text-white/68">
          Submit 1 Video hari ini
          <ChevronRightIcon class="h-4 w-4 text-white/46" />
        </button>
        <div class="mt-4 flex items-center justify-between text-xs font-medium text-white/50">
          <span>0/7 hari · Tinggal 7 lagi</span>
          <span class="inline-flex items-center gap-1">Aturan misi <ChevronRightIcon class="h-3.5 w-3.5" /></span>
        </div>
      </section>

      <section class="dark-card mt-8 rounded-lg p-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-lg font-semibold tracking-[-.01em]">Video Kamu</h2>
          <button class="inline-flex h-9 items-center gap-3 rounded-full border border-white/10 bg-white/[.025] px-4 text-xs font-medium text-white/56">
              <ArrowPathIcon class="h-4 w-4 text-blue-300" />
            Refresh Views dalam <span class="text-white/82">01:27:28</span>
            <ChevronDownIcon class="h-3.5 w-3.5" />
          </button>
        </div>

        <div class="mt-5 flex gap-8 border-b border-white/8 text-sm">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="relative pb-3 font-medium"
            :class="activeTab === tab ? 'text-white' : 'text-white/34'"
            @click="activeTab = tab"
          >
            {{ tab }}
            <span v-if="activeTab === tab" class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-bluebrand"></span>
          </button>
        </div>

        <div class="mt-4 flex flex-wrap gap-3">
          <button class="inline-flex h-9 items-center gap-3 rounded-lg border border-white/10 bg-white/[.035] px-4 text-xs font-medium text-white/66">
            Semua campaign
            <ChevronDownIcon class="h-3.5 w-3.5" />
          </button>
          <button class="inline-flex h-9 items-center gap-3 rounded-lg border border-white/10 bg-white/[.035] px-4 text-xs font-medium text-white/66">
            Urutkan dari
            <FunnelIcon class="h-3.5 w-3.5" />
          </button>
        </div>

        <div v-if="!submissions.length" class="mt-5 grid h-20 place-items-center rounded-lg border border-dashed border-white/8 bg-black/20 text-xs text-white/35">
          Belum ada submission untuk campaign ini.
        </div>

        <div v-else class="mt-5 overflow-hidden rounded-lg border border-white/8 bg-black/20">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[820px] text-left text-xs">
              <thead class="border-b border-white/8 bg-white/[.035] text-white/45">
                <tr>
                  <th class="w-16 px-4 py-3 font-medium">Nomor</th>
                  <th class="px-4 py-3 font-medium">Tanggal Jam Submit</th>
                  <th class="px-4 py-3 font-medium">Caption</th>
                  <th class="px-4 py-3 font-medium">Tipe</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                  <th class="w-24 px-4 py-3 font-medium">Link</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/8">
                <tr v-for="(submission, index) in submissions" :key="submission.id" class="text-white/72">
                  <td class="px-4 py-3 text-white/50">{{ index + 1 }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">{{ submission.submitted_at || '-' }}</td>
                  <td class="px-4 py-3">
                    <div class="max-w-[280px] truncate font-medium text-white/82">{{ submission.caption || '-' }}</div>
                    <div v-if="submission.account" class="mt-1 text-[11px] text-white/36">{{ submission.account }}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">{{ submission.type || '-' }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-100">
                      {{ submission.status || '-' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <a
                      :href="submission.link"
                      target="_blank"
                      rel="noreferrer"
                      class="inline-flex h-8 items-center rounded-lg bg-bluebrand px-4 text-[11px] font-semibold text-white shadow-blue"
                    >
                      View
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="mt-9">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-lg font-semibold tracking-[-.01em]">Semua Campaign Aktif</h2>
          <div class="flex flex-wrap gap-2.5">
            <button class="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[.045] text-white/58">
              <FunnelIcon class="h-4 w-4" />
            </button>
            <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[.045] px-4 text-xs font-medium text-white/66">
              Kategori <ChevronDownIcon class="h-3.5 w-3.5" />
            </button>
            <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[.045] px-4 text-xs font-medium text-white/66">
              Tipe <ChevronDownIcon class="h-3.5 w-3.5" />
            </button>
            <button class="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[.045] text-white/58">♪</button>
            <button class="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[.045] text-white/58">◎</button>
            <button class="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[.045] text-white/58">▶</button>
          </div>
        </div>

        <div class="grid gap-5 xl:grid-cols-3">
          <CampaignCard v-for="campaign in campaigns" :key="campaign.slug" :campaign="campaign" />
        </div>

        <div class="mt-12 flex justify-center">
          <RouterLink to="/campaigns" class="btn-blue inline-flex h-12 items-center gap-2 rounded-lg px-9 text-sm font-semibold">
            Load More Campaign
            <span class="text-lg leading-none">+</span>
          </RouterLink>
        </div>
      </section>

      <div class="fixed bottom-5 right-5 z-20 hidden rounded-full border border-white/10 bg-black/80 px-6 py-3 text-sm font-medium text-white/80 shadow-card backdrop-blur lg:block">
        Onboarding Progress <span class="ml-3 text-blue-400">0/4 steps</span> <span class="font-normal text-white/35">completed</span>
      </div>
    </div>
  </AppShell>
</template>
