<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FunnelIcon,
  GiftIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import CampaignCard from '../components/CampaignCard.vue'
import StatCard from '../components/StatCard.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const tabs = ['Semua', 'Pending', 'Approved', 'Rejected', 'Need Action', 'Deleted']
const activeTab = ref('Semua')
const showDailyQuestRules = ref(false)
const campaigns = computed(() => store.campaigns)
const submissions = computed(() => store.submissions)
const dailyQuest = computed(() => store.dailyQuest || {
  reward: 'Rp15.000',
  completed_days: 0,
  target_days: 7,
  remaining_days: 7,
  today_completed: false,
  claimed_count: 0,
  days: Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    date: '',
    label: `H ${index + 1}`,
    completed: false,
    is_today: index === 6,
  })),
})
const dailyQuestClaimed = computed(() => new Intl.NumberFormat('id-ID').format(dailyQuest.value.claimed_count))
const dailyQuestStatus = computed(() => {
  if (dailyQuest.value.completed_days >= dailyQuest.value.target_days) {
    return 'Quest selesai · Hadiah siap diklaim'
  }

  return `${dailyQuest.value.completed_days}/${dailyQuest.value.target_days} hari · Tinggal ${dailyQuest.value.remaining_days} lagi`
})
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
            <div class="grid h-14 w-14 place-items-center rounded-full bg-purple-500/15 text-purple-200 shadow-blue">
              <GiftIcon class="h-7 w-7 stroke-[1.6]" />
            </div>
            <div>
              <h2 class="text-[25px] font-semibold uppercase leading-none tracking-[-.025em]">Daily Quest!</h2>
              <p class="mt-3 text-sm font-normal text-white/50">Submit 1/hari sampai 7 kali</p>
            </div>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full border border-purple-400/50 bg-purple-500/15 px-6 py-2.5 text-sm font-semibold text-purple-100 shadow-blue">
            <GiftIcon class="h-[18px] w-[18px] stroke-[1.8]" />
            {{ dailyQuest.reward }}
          </div>
        </div>

        <div class="mt-6 rounded-lg border border-white/8 bg-black/28 p-4">
          <div class="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            <div
              v-for="day in dailyQuest.days"
              :key="day.day"
              class="grid aspect-[1.75/1] place-items-center rounded-lg border text-sm font-medium transition"
              :class="[
                day.completed
                  ? 'border-purple-300/45 bg-purple-500/18 text-purple-100 shadow-blue'
                  : day.is_today
                    ? 'border-sky-300/35 bg-sky-500/10 text-sky-100/78'
                    : 'border-white/8 bg-white/[.035] text-white/48',
              ]"
            >
              <CheckCircleIcon v-if="day.completed" class="h-6 w-6 stroke-[1.8]" />
              <GiftIcon v-else-if="day.day === dailyQuest.target_days" class="h-6 w-6 text-purple-400/45" />
              <span v-else>H {{ day.day }}</span>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center text-sm font-medium text-white/78">
              <span class="grid h-7 w-7 place-items-center rounded-full bg-purple-500/30 text-[10px]">DA</span>
              <span class="-ml-2 grid h-7 w-7 place-items-center rounded-full bg-sky-500/30 text-[10px]">RE</span>
              <span class="-ml-2 grid h-7 w-7 place-items-center rounded-full bg-cyan-500/30 text-[10px]">NC</span>
              <span class="ml-3"><span class="text-purple-300">{{ dailyQuestClaimed }}+</span> Orang Telah Claim Hadiah</span>
            </div>
          </div>
        </div>

        <RouterLink
          to="/campaigns"
          class="mt-3 flex h-11 w-full items-center justify-between rounded-lg border border-white/8 bg-white/[.025] px-4 text-left text-sm font-medium text-white/68 transition hover:border-white/14 hover:bg-white/[.045] hover:text-white"
        >
          {{ dailyQuest.today_completed ? 'Video hari ini sudah masuk' : 'Submit 1 Video hari ini' }}
          <ChevronRightIcon class="h-4 w-4 text-white/46" />
        </RouterLink>
        <div class="mt-4 flex items-center justify-between text-xs font-medium text-white/50">
          <span>{{ dailyQuestStatus }}</span>
          <button
            class="inline-flex items-center gap-1 transition hover:text-white/78"
            type="button"
            @click="showDailyQuestRules = true"
          >
            Aturan misi <ChevronRightIcon class="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      <section class="dark-card mt-8 rounded-lg p-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-lg font-semibold tracking-[-.01em]">Video Kamu</h2>
          <button class="inline-flex h-9 items-center gap-3 rounded-full border border-white/10 bg-white/[.025] px-4 text-xs font-medium text-white/56">
              <ArrowPathIcon class="h-4 w-4 text-purple-300" />
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
            <span v-if="activeTab === tab" class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-gradient-to-b from-[#a088ff] to-bluebrand"></span>
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
                      class="inline-flex h-8 items-center rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 text-[11px] font-semibold text-white shadow-blue"
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
        Onboarding Progress <span class="ml-3 text-purple-400">0/4 steps</span> <span class="font-normal text-white/35">completed</span>
      </div>

      <div
        v-if="showDailyQuestRules"
        class="fixed inset-0 z-50 grid place-items-center bg-black/72 px-5 backdrop-blur-sm"
        @click.self="showDailyQuestRules = false"
      >
        <section class="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d0d12] p-5 shadow-card">
          <div class="flex items-start justify-between gap-5">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[.16em] text-purple-200/72">Daily Quest</p>
              <h2 class="mt-2 text-xl font-semibold tracking-[-.02em] text-white">Aturan misi</h2>
            </div>
            <button
              class="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[.035] text-white/56 transition hover:bg-white/[.07] hover:text-white"
              type="button"
              aria-label="Tutup aturan misi"
              @click="showDailyQuestRules = false"
            >
              <XMarkIcon class="h-5 w-5 stroke-[1.8]" />
            </button>
          </div>

          <div class="mt-5 space-y-3 text-sm leading-6 text-white/64">
            <p class="rounded-lg border border-white/8 bg-white/[.035] p-4">
              Submit minimal 1 video per hari untuk menyelesaikan 1 kotak Daily Quest.
            </p>
            <p class="rounded-lg border border-white/8 bg-white/[.035] p-4">
              Progress dihitung dari hari submit video, maksimal 1 progress per hari walaupun kamu submit lebih dari 1 video.
            </p>
            <p class="rounded-lg border border-white/8 bg-white/[.035] p-4">
              Selesaikan {{ dailyQuest.target_days }} hari dalam periode quest untuk membuka hadiah {{ dailyQuest.reward }}.
            </p>
            <p class="rounded-lg border border-white/8 bg-white/[.035] p-4">
              Video yang dihitung adalah submission campaign yang punya link video dan berhasil masuk ke sistem.
            </p>
          </div>

          <RouterLink
            to="/campaigns"
            class="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand text-sm font-semibold text-white shadow-blue"
            @click="showDailyQuestRules = false"
          >
            Mulai submit video
          </RouterLink>
        </section>
      </div>
    </div>
  </AppShell>
</template>
