<script setup>
import { computed, onMounted } from 'vue'
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  MegaphoneIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const campaigns = computed(() => store.adminCampaigns.slice(0, 5))
const submissions = computed(() => store.adminSubmissions.slice(0, 5))

const adminStats = computed(() => [
  { label: 'Total Creator', value: String(store.adminCreators.length || 0), icon: UserGroupIcon, tone: 'text-purple-200' },
  { label: 'Campaign Aktif', value: String(store.adminCampaigns.length || 0), icon: MegaphoneIcon, tone: 'text-sky-200' },
  { label: 'Submission Review', value: String(store.adminSubmissions.length || 0), icon: VideoCameraIcon, tone: 'text-amber-100' },
  { label: 'Payout Valid', value: store.adminPayouts?.total_income || 'Rp0', icon: BanknotesIcon, tone: 'text-emerald-200' },
])

onMounted(() => {
  void Promise.all([
    store.loadAdminCampaigns(),
    store.loadAdminSubmissions(),
    store.loadAdminCreators(),
    store.loadAdminPayouts(),
  ])
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Dashboard Admin</h1>
          <p class="mt-2 text-sm text-white/45">Pantau creator, campaign, submission, dan payout dari satu tempat.</p>
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div v-for="stat in adminStats" :key="stat.label" class="dark-card min-h-36 rounded-lg p-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-white/48">{{ stat.label }}</p>
            <component :is="stat.icon" class="h-5 w-5 stroke-[1.8]" :class="stat.tone" />
          </div>
          <div class="mt-10 text-[30px] font-semibold leading-none tracking-[-.025em]" :class="stat.tone">{{ stat.value }}</div>
        </div>
      </div>

      <div class="mt-8 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section class="dark-card rounded-lg p-5">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold tracking-[-.01em]">Campaign Terbaru</h2>
            <MegaphoneIcon class="h-5 w-5 text-white/38" />
          </div>

          <div class="mt-5 overflow-hidden rounded-lg border border-white/8 bg-black/20">
            <table class="w-full min-w-[680px] text-left text-xs">
              <thead class="border-b border-white/8 bg-white/[.035] text-white/45">
                <tr>
                  <th class="px-4 py-3 font-medium">Campaign</th>
                  <th class="px-4 py-3 font-medium">Kategori</th>
                  <th class="px-4 py-3 font-medium">Rate</th>
                  <th class="px-4 py-3 font-medium">Deadline</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/8">
                <tr v-for="campaign in campaigns" :key="campaign.slug" class="text-white/72">
                  <td class="px-4 py-3">
                    <div class="font-medium text-white/86">{{ campaign.title }}</div>
                    <div class="mt-1 text-[11px] text-white/36">{{ campaign.brand }}</div>
                  </td>
                  <td class="px-4 py-3">{{ campaign.category }}</td>
                  <td class="px-4 py-3">{{ campaign.rate }}</td>
                  <td class="px-4 py-3">{{ campaign.deadline || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="dark-card rounded-lg p-5">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold tracking-[-.01em]">Antrian Review</h2>
            <ClockIcon class="h-5 w-5 text-white/38" />
          </div>

          <div class="mt-5 space-y-3">
            <div v-if="!submissions.length" class="grid h-24 place-items-center rounded-lg border border-dashed border-white/8 bg-black/20 text-xs text-white/35">
              Belum ada submission.
            </div>
            <div v-for="submission in submissions" :key="submission.id" class="rounded-lg border border-white/8 bg-black/20 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="text-sm font-medium text-white/84">{{ submission.caption || '-' }}</div>
                  <div class="mt-1 text-xs text-white/38">{{ submission.account || 'Tanpa akun' }}</div>
                </div>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-100">
                  <CheckCircleIcon class="h-3.5 w-3.5" />
                  {{ submission.status || 'Review' }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
