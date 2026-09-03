<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import CampaignCard from '../components/CampaignCard.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const query = ref('')
const category = ref('')
const type = ref('')
const filteredCampaigns = computed(() => {
  const keyword = query.value.toLowerCase()
  return store.campaigns.filter(c => `${c.title} ${c.brand} ${c.category} ${c.type}`.toLowerCase().includes(keyword))
})
const loadCampaigns = () => store.loadCampaigns({
  search: query.value || undefined,
  category: category.value || undefined,
  type: type.value || undefined,
})

onMounted(loadCampaigns)
watch([query, category, type], loadCampaigns)
</script>

<template>
  <AppShell>
    <div class="mb-6 h-64 rounded-lg bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-70"></div>
    <div class="mb-5 flex flex-wrap items-center gap-3">
      <h1 class="mr-3 text-[24px] font-semibold tracking-[-.02em]">Explore Semua Campaign</h1>
      <input v-model="query" class="h-11 min-w-72 rounded-lg border border-white/10 bg-white/[.045] px-4 text-[13px] font-medium text-white outline-none placeholder:text-white/42 focus:border-blue-400" placeholder="Cari campaign atau brand..." />
      <button class="inline-flex h-11 items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/[.055] px-4 text-[13px] font-medium text-blue-100 hover:border-blue-400/45 hover:text-white">
        <FunnelIcon class="h-4 w-4 stroke-[1.8]" />
        Filter
      </button>
      <div class="relative">
        <select v-model="category" class="h-11 min-w-36 appearance-none rounded-lg border border-white/10 bg-white/[.045] px-4 pr-9 text-[13px] font-medium text-white/78 outline-none hover:border-blue-400/45">
          <option value="" class="bg-black">Semua kategori</option>
          <option v-for="item in store.campaignFilters.categories" :key="item" :value="item" class="bg-black">{{ item }}</option>
        </select>
        <ChevronDownIcon class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 stroke-[2] text-white/58" />
      </div>
      <div class="relative">
        <select v-model="type" class="h-11 min-w-32 appearance-none rounded-lg border border-white/10 bg-white/[.045] px-4 pr-9 text-[13px] font-medium text-white/78 outline-none hover:border-blue-400/45">
          <option value="" class="bg-black">Semua tipe</option>
          <option v-for="item in store.campaignFilters.types" :key="item" :value="item" class="bg-black">{{ item }}</option>
        </select>
        <ChevronDownIcon class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 stroke-[2] text-white/58" />
      </div>
    </div>
    <div class="grid gap-5 xl:grid-cols-3">
      <CampaignCard v-for="campaign in filteredCampaigns" :key="campaign.slug" :campaign="campaign" />
    </div>
    <div v-if="!filteredCampaigns.length" class="dark-card grid h-40 place-items-center rounded-lg text-sm text-white/45">
      Campaign tidak ditemukan.
    </div>
  </AppShell>
</template>
