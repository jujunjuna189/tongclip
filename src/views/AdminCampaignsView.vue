<script setup>
import { computed, onMounted, ref } from 'vue'
import { Bars3Icon, ExclamationTriangleIcon, MagnifyingGlassIcon, PencilSquareIcon, PhotoIcon, PlusIcon, Squares2X2Icon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const query = ref('')
const viewMode = ref('card')
const deleting = ref(false)
const campaignToDelete = ref(null)
const campaigns = computed(() => {
  const keyword = query.value.toLowerCase()
  return store.adminCampaigns.filter((campaign) => `${campaign.title} ${campaign.brand} ${campaign.category} ${campaign.type}`.toLowerCase().includes(keyword))
})

const deadlineProgress = (campaign) => {
  if (!campaign.deadline_value) return 100

  const now = new Date()
  const deadline = new Date(`${campaign.deadline_value}T23:59:59`)
  const remainingDays = Math.ceil((deadline.getTime() - now.getTime()) / 86400000)

  return Math.max(8, Math.min(100, remainingDays * 4))
}

const openDeleteModal = (campaign) => {
  campaignToDelete.value = campaign
}

const closeDeleteModal = () => {
  if (deleting.value) return
  campaignToDelete.value = null
}

const confirmDeleteCampaign = async () => {
  if (!campaignToDelete.value) return

  deleting.value = true

  try {
    await store.deleteAdminCampaign(campaignToDelete.value.id)
    campaignToDelete.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(() => store.loadAdminCampaigns())
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Kelola Campaign</h1>
          <p class="mt-2 text-sm text-white/45">Pantau status campaign, budget, deadline, dan tipe konten.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="grid h-10 grid-cols-2 rounded-lg border border-white/10 bg-white/[.035] p-1">
            <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'card' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'card'" aria-label="Card view">
              <Squares2X2Icon class="h-4 w-4" />
            </button>
            <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'list'" aria-label="List view">
              <Bars3Icon class="h-4 w-4" />
            </button>
          </div>
          <RouterLink to="/admin/campaigns/create" class="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 text-sm font-semibold text-white shadow-blue">
            <PlusIcon class="h-4 w-4 stroke-[2]" />
            Campaign
          </RouterLink>
        </div>
      </div>

      <div class="mt-6 flex h-11 max-w-md items-center gap-3 rounded-lg border border-white/10 bg-white/[.045] px-4">
        <MagnifyingGlassIcon class="h-4 w-4 text-white/42" />
        <input v-model="query" class="h-full flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Cari campaign..." />
      </div>

      <section v-if="viewMode === 'card'" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="campaign in campaigns" :key="campaign.slug" class="dark-card overflow-hidden rounded-lg transition hover:-translate-y-0.5 hover:border-purple-500/40">
          <div class="relative h-56 overflow-hidden bg-black/30">
            <div v-if="campaign.image" class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${campaign.image})` }"></div>
            <div v-else class="absolute inset-0 grid place-items-center bg-white/[.035] text-white/26">
              <PhotoIcon class="h-14 w-14 stroke-[1.4]" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>
            <span class="absolute left-3 top-3 rounded-full border border-purple-300/30 bg-black/60 px-3 py-1.5 text-xs font-semibold text-purple-100">
              {{ campaign.status || 'Active' }}
            </span>
            <span
              v-if="campaign.exclusive"
              class="absolute right-0 top-0 rounded-bl-2xl border border-purple-300/60 bg-black/60 px-4 py-2.5 text-xs font-medium text-purple-100"
            >
              Exclusive Campaign
            </span>
            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-xs text-white/82">
              <span class="truncate">{{ campaign.brand || 'Tanpa brand' }}</span>
              <span class="shrink-0 rounded-full bg-white/10 px-3 py-1.5">{{ campaign.type || 'Campaign' }}</span>
            </div>
          </div>

          <div class="p-5">
            <h2 class="min-h-12 text-[17px] font-semibold leading-6 tracking-[-.015em] text-white/90">{{ campaign.title }}</h2>
            <div class="mt-1 text-[26px] font-semibold tracking-[-.03em] text-gradient-primary">
              {{ campaign.rate }} <span class="text-sm font-normal text-white/50">/ 1K Views</span>
            </div>

            <div class="mt-5 flex items-center justify-between text-xs text-white/58">
              <span>Deadline</span>
              <span>{{ campaign.deadline || '-' }}</span>
            </div>
            <div class="mt-2.5 h-1 rounded-full bg-white/10">
              <div class="blue-progress h-full rounded-full" :style="{ width: deadlineProgress(campaign) + '%' }"></div>
            </div>

            <div class="mt-5 flex flex-wrap gap-2 text-[11px] text-white/56">
              <span class="rounded-full bg-white/[.045] px-3 py-1">{{ campaign.category || '-' }}</span>
              <span class="rounded-full bg-white/[.045] px-3 py-1">Budget {{ campaign.budget }}%</span>
            </div>

            <div class="mt-5 flex gap-2">
              <RouterLink :to="`/admin/campaigns/${campaign.id}/edit`" class="inline-flex h-9 items-center gap-2 rounded-lg bg-white/[.055] px-4 text-xs font-semibold text-white/72 hover:bg-white/[.085]">
                <PencilSquareIcon class="h-4 w-4" />
                Edit
              </RouterLink>
              <button class="inline-flex h-9 items-center gap-2 rounded-lg bg-red-400/10 px-4 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="openDeleteModal(campaign)">
                <TrashIcon class="h-4 w-4" />
                Hapus
              </button>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="mt-6 overflow-x-auto">
        <div class="min-w-[920px] space-y-2">
          <table class="w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">Campaign</th>
                <th class="px-4 pb-1 font-medium">Kategori</th>
                <th class="px-4 pb-1 font-medium">Tipe</th>
                <th class="px-4 pb-1 font-medium">Rate</th>
                <th class="px-4 pb-1 font-medium">Budget</th>
                <th class="px-4 pb-1 font-medium">Deadline</th>
                <th class="px-4 pb-1 font-medium">Status</th>
                <th class="px-4 pb-1 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="campaign in campaigns" :key="campaign.slug" class="group text-white/68">
                <td class="rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="text-sm font-semibold text-white/86">{{ campaign.title }}</div>
                  <div class="mt-1 text-[11px] text-white/34">{{ campaign.brand }}</div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ campaign.category }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ campaign.type }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 font-semibold text-gradient-primary transition group-hover:bg-white/[.045]">{{ campaign.rate }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ campaign.budget }}%</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ campaign.deadline || '-' }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-100/82">{{ campaign.status || 'Active' }}</span>
                </td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex gap-2">
                    <RouterLink :to="`/admin/campaigns/${campaign.id}/edit`" class="inline-flex h-8 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/72 hover:bg-white/[.085]">
                      <PencilSquareIcon class="h-4 w-4" />
                      Edit
                    </RouterLink>
                    <button class="inline-flex h-8 items-center gap-2 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="openDeleteModal(campaign)">
                      <TrashIcon class="h-4 w-4" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-if="campaignToDelete" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeDeleteModal">
        <section class="w-full max-w-md rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]">
          <div class="flex items-start justify-between gap-4">
            <div class="flex gap-4">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-100">
                <ExclamationTriangleIcon class="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <h2 class="text-base font-semibold text-white/90">Hapus campaign?</h2>
                <p class="mt-2 text-sm leading-6 text-white/46">Campaign ini akan dihapus dari database beserta data submission yang terhubung.</p>
              </div>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" @click="closeDeleteModal">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 rounded-lg border border-white/[.08] bg-white/[.03] p-4">
            <div class="text-sm font-semibold text-white/86">{{ campaignToDelete.title }}</div>
            <div class="mt-1 text-xs text-white/38">{{ campaignToDelete.brand }} · {{ campaignToDelete.category }}</div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button class="h-10 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" :disabled="deleting" @click="closeDeleteModal">Batal</button>
            <button class="h-10 rounded-lg bg-red-500/85 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60" type="button" :disabled="deleting" @click="confirmDeleteCampaign">
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
