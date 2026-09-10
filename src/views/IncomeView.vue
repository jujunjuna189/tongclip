<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ChevronUpDownIcon,
  MegaphoneIcon,
  VideoCameraIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const activeMode = ref('Total')
const icons = {
  'Total Campaign': MegaphoneIcon,
  'Total Video': VideoCameraIcon,
  'Total Approved': CheckBadgeIcon,
}
const styles = {
  'Total Campaign': { color: 'text-purple-400', glow: 'shadow-[inset_0_-70px_90px_rgba(147,51,234,.16)]' },
  'Total Video': { color: 'text-sky-400', glow: 'shadow-[inset_0_-70px_90px_rgba(14,165,233,.14)]' },
  'Total Approved': { color: 'text-lime-300', glow: 'shadow-[inset_0_-70px_90px_rgba(132,204,22,.15)]' },
}

const stats = computed(() => (store.incomeSummary?.stats || []).map((item) => ({
  ...item,
  icon: icons[item.label] || ChartBarIcon,
  ...(styles[item.label] || styles['Total Campaign']),
})))
const chart = computed(() => store.incomeSummary?.chart || [])
const maxAmount = computed(() => Math.max(...chart.value.map((item) => item.amount), 1))
const totalIncome = computed(() => store.incomeSummary?.total_income || 'Rp0')

onMounted(() => store.loadIncomeSummary())
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1400px]">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-[28px] font-semibold tracking-[-.025em]">Analitik Performa Kamu</h1>
        <button class="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[.045] px-4 text-sm font-medium text-white/55 hover:text-white">
          <ArrowDownTrayIcon class="h-5 w-5 stroke-[1.8]" />
          Export CSV
        </button>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <section v-for="item in stats" :key="item.label" class="dark-card min-h-52 rounded-lg p-6" :class="item.glow">
          <div class="flex items-center gap-3 text-base font-medium text-white/55">
            <component :is="item.icon" class="h-6 w-6 stroke-[1.8]" />
            {{ item.label }}
          </div>
          <div class="mt-24 flex items-end gap-2">
            <span class="text-[40px] font-semibold leading-none tracking-[-.04em]" :class="item.color">{{ item.value }}</span>
            <span class="pb-1 text-lg font-normal" :class="item.color">{{ item.suffix }}</span>
          </div>
        </section>
      </div>

      <section class="dark-card mt-9 rounded-lg p-6">
        <div class="flex flex-wrap items-center gap-4">
          <h2 class="mr-4 text-[24px] font-semibold tracking-[-.02em]">Total Views</h2>
          <div class="inline-flex rounded-lg border border-white/10 bg-white/[.025] p-1">
            <button
              v-for="mode in ['Total', 'Kenaikan']"
              :key="mode"
              class="h-10 rounded-md px-5 text-sm font-medium transition"
              :class="activeMode === mode ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : 'text-white/45 hover:text-white'"
              @click="activeMode = mode"
            >
              {{ mode }}
            </button>
          </div>
          <button class="inline-flex h-12 min-w-72 items-center justify-between rounded-lg border border-white/10 bg-white/[.035] px-4 text-sm font-medium text-white/76">
            <span class="inline-flex items-center gap-3">
              <CalendarDaysIcon class="h-5 w-5 text-white/54" />
              28 hari terakhir
            </span>
            <ChevronUpDownIcon class="h-5 w-5 text-white/54" />
          </button>
        </div>

        <div class="relative mt-10 h-[430px] overflow-hidden rounded-lg bg-black/15">
          <div class="absolute inset-x-8 bottom-16 top-4 border-b border-r border-white/22">
            <div class="absolute inset-0 opacity-75" style="background-image: linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px); background-size: 48px 100%, 100% 72px;"></div>
            <div class="absolute bottom-0 left-0 right-0 flex h-full items-end gap-1 px-2">
              <div
                v-for="item in chart"
                :key="item.label"
                class="min-w-0 flex-1 rounded-t bg-gradient-to-b from-[#a088ff] to-bluebrand/80 shadow-blue transition"
                :style="{ height: `${Math.max(4, (item.amount / maxAmount) * 100)}%` }"
                :title="`${item.label}: ${item.amount_label}`"
              ></div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-b from-[#a088ff] to-bluebrand"></div>
            <div class="absolute -right-16 -top-2 text-sm text-white/52">{{ totalIncome }}</div>
            <div class="absolute -right-4 bottom-[-8px] text-sm text-white/52">0</div>
            <div class="absolute bottom-2 right-3 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 py-2 text-lg font-semibold text-white">{{ totalIncome }}</div>
          </div>

          <div class="absolute bottom-3 left-6 right-14 grid grid-cols-[repeat(30,minmax(42px,1fr))] gap-0 overflow-hidden text-xs text-white/56">
            <span v-for="item in chart" :key="item.label" class="text-center">{{ item.label }}</span>
          </div>
        </div>
      </section>
    </div>
  </AppShell>
</template>
