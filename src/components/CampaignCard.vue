<script setup>
import { computed } from 'vue'

const props = defineProps({
  campaign: Object,
  accent: {
    type: String,
    default: 'blue',
  },
})

const deadlineProgress = computed(() => {
  if (!props.campaign?.deadline_value) return 100

  const now = new Date()
  const deadline = new Date(`${props.campaign.deadline_value}T23:59:59`)
  const remainingDays = Math.ceil((deadline.getTime() - now.getTime()) / 86400000)

  return Math.max(8, Math.min(100, remainingDays * 4))
})
</script>

<template>
  <RouterLink
    :to="`/campaigns/${campaign.slug}`"
    class="dark-card block overflow-hidden rounded-lg transition hover:-translate-y-0.5"
    :class="accent === 'orange' ? 'hover:border-orange-500/40' : 'hover:border-purple-500/40'"
  >
    <div class="relative h-60 bg-cover bg-center" :style="{ backgroundImage: `url(${campaign.image})` }">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>
      <span
        v-if="campaign.exclusive"
        class="absolute right-0 top-0 rounded-bl-2xl border bg-black/60 px-4 py-2.5 text-xs font-medium"
        :class="accent === 'orange' ? 'border-orange-300/60 text-orange-100' : 'border-purple-300/60 text-purple-100'"
      >
        Exclusive Campaign
      </span>
      <span
        v-if="campaign.joined"
        class="absolute left-3 top-3 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-100"
      >
        {{ campaign.submission_status === 'review' ? 'Review' : 'Joined' }}
      </span>
      <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/82">
        <span>{{ campaign.brand }}</span>
        <span class="rounded-full bg-white/10 px-3 py-1.5">{{ campaign.type }}</span>
      </div>
    </div>
    <div class="p-5">
      <h2 class="min-h-12 text-[17px] font-semibold leading-6 tracking-[-.015em]">{{ campaign.title }}</h2>
      <div class="mt-1 text-[26px] font-semibold tracking-[-.03em]">{{ campaign.rate }} <span class="text-sm font-normal text-white/50">/ 1K Views</span></div>
      <div class="mt-5 flex items-center justify-between text-xs text-white/58">
        <span>Deadline</span>
        <span>{{ campaign.deadline || '-' }}</span>
      </div>
      <div class="mt-2.5 h-1 rounded-full bg-white/10">
        <div
          :class="accent === 'orange' ? 'orange-progress' : 'blue-progress'"
          class="h-full rounded-full"
          :style="{ width: deadlineProgress + '%' }"
        ></div>
      </div>
    </div>
  </RouterLink>
</template>
