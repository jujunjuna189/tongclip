<script setup>
import { BanknotesIcon, ChartBarIcon, InformationCircleIcon, PlayIcon, VideoCameraIcon } from '@heroicons/vue/24/outline'

defineProps({
  label: String,
  value: String,
  hint: String,
  wide: Boolean,
})

const icons = {
  'Total Pendapatan': InformationCircleIcon,
  'Bisa Dicairkan': BanknotesIcon,
  'Total Views': PlayIcon,
  'Total Video': VideoCameraIcon,
}

const styles = {
  'Total Pendapatan': {
    value: 'text-white',
    glow: 'shadow-[inset_0_-70px_90px_rgba(136,107,255,.10)] border-purple-500/15',
  },
  'Bisa Dicairkan': {
    value: 'text-[#9DFFA5]',
    glow: 'shadow-[inset_0_-70px_90px_rgba(34,197,94,.18)] border-green-500/15',
  },
  'Total Views': {
    value: 'text-blueglow',
    glow: 'shadow-[inset_0_-70px_90px_rgba(136,107,255,.18)] border-purple-500/15',
  },
  'Total Video': {
    value: 'text-blueglow',
    glow: 'shadow-[inset_0_-70px_90px_rgba(14,165,233,.15)] border-purple-500/15',
  },
}
</script>

<template>
  <div class="dark-card relative min-h-44 overflow-hidden rounded-lg p-6" :class="[wide ? 'xl:col-span-1' : '', styles[label]?.glow]">
    <div class="absolute right-7 top-7 text-[120px] font-semibold leading-none text-white/[.025]">C</div>
    <div class="flex items-center gap-2 text-base font-medium text-white/56">
      <component :is="icons[label] || ChartBarIcon" class="h-5 w-5 stroke-[1.8]" />
      {{ label }}
    </div>
    <div class="mt-20 text-[36px] font-semibold leading-none tracking-[-.03em]" :class="styles[label]?.value || 'text-white'">{{ value }}</div>
    <div v-if="hint" class="mt-2.5 text-xs font-medium text-white/40">{{ hint }}</div>
  </div>
</template>
