<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const query = ref('')
const platformFilter = ref('all')

const rankedUsers = computed(() => {
  return store.leaderboard
    .map((item, index) => ({ ...item, rank: index + 1 }))
})

const platforms = computed(() => {
  const items = rankedUsers.value.map((user) => user.platform).filter(Boolean)
  return [...new Set(items)]
})

const filteredUsers = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  return rankedUsers.value.filter((user) => {
    const matchesKeyword = !keyword || `${user.name} ${user.handle} ${user.platform}`.toLowerCase().includes(keyword)
    const matchesPlatform = platformFilter.value === 'all' || user.platform === platformFilter.value

    return matchesKeyword && matchesPlatform
  })
})

const podiumUsers = computed(() => filteredUsers.value.slice(0, 3))
const listUsers = computed(() => filteredUsers.value.slice(3))
const requests = computed(() => store.brandRequests)
const totalIncome = computed(() => rankedUsers.value.reduce((total, user) => total + (Number(user.income_value) || 0), 0))
const topCreator = computed(() => rankedUsers.value[0])

const rupiah = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(value || 0)

const rankClass = (rank) => {
  if (rank === 1) return 'border-amber-300/25 bg-amber-400/10 text-amber-100'
  if (rank === 2) return 'border-slate-200/20 bg-white/[.08] text-white/82'
  if (rank === 3) return 'border-orange-300/20 bg-orange-400/10 text-orange-100'
  return 'border-white/10 bg-white/[.045] text-white/56'
}

const updateRequest = async (request, status) => {
  await store.updateBrandRequest(request.brand_id, request.user_id, status)
}

onMounted(async () => {
  await store.loadDashboard()
  store.loadLeaderboard()
  store.loadBrandRequests()
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Top Leaderboard</h1>
          <p class="mt-2 text-sm text-white/45">Akun sosial dengan pendapatan valid tertinggi.</p>
        </div>
        <div class="inline-flex h-10 items-center gap-2 rounded-lg border border-purple-300/20 bg-purple-500/10 px-3 text-sm font-semibold text-purple-100/82">
          <TrophyIcon class="h-4 w-4" />
          Bulan ini
        </div>
      </div>

      <div class="mt-5 grid gap-4 md:grid-cols-3">
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="text-xs font-medium text-white/40">Total Creator</div>
          <div class="mt-2 text-2xl font-semibold text-white/90">{{ rankedUsers.length }}</div>
        </section>
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="text-xs font-medium text-white/40">Total Pendapatan</div>
          <div class="mt-2 text-2xl font-semibold text-gradient-primary">{{ rupiah(totalIncome) }}</div>
        </section>
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="text-xs font-medium text-white/40">Top Creator</div>
          <div class="mt-2 truncate text-2xl font-semibold text-white/90">{{ topCreator?.name || '-' }}</div>
        </section>
      </div>

      <section class="mt-6 rounded-lg border border-white/[.08] bg-white/[.025] p-4">
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex h-10 w-full min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3.5 md:w-[360px] xl:w-[420px]">
            <MagnifyingGlassIcon class="h-4 w-4 shrink-0 text-white/42" />
            <input v-model="query" class="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Cari creator..." />
            <button v-if="query" class="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md text-white/38 transition hover:bg-white/[.055] hover:text-white" type="button" aria-label="Hapus pencarian" @click="query = ''">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </label>

          <label class="relative flex h-10 min-w-[190px] items-center rounded-lg border border-white/10 bg-black/20">
            <select v-model="platformFilter" class="h-full w-full appearance-none bg-transparent pl-3.5 pr-9 text-sm font-semibold text-white/70 outline-none">
              <option class="bg-[#111113]" value="all">Semua platform</option>
              <option v-for="platform in platforms" :key="platform" class="bg-[#111113]" :value="platform">{{ platform }}</option>
            </select>
            <ChevronDownIcon class="pointer-events-none absolute right-3 h-4 w-4 text-white/38" />
          </label>
        </div>
      </section>

      <section class="mt-6 grid gap-4 lg:grid-cols-3">
        <article
          v-for="user in podiumUsers"
          :key="user.id"
          class="rounded-lg border border-white/[.08] bg-white/[.025] p-5 transition hover:-translate-y-0.5 hover:border-purple-400/35"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-purple-500/14 text-base font-black text-purple-100/90">{{ user.name?.[0] }}</div>
              <div class="min-w-0">
                <h2 class="truncate font-semibold text-white/88">{{ user.name }}</h2>
                <p class="mt-1 truncate text-xs text-white/38">{{ user.handle }}</p>
              </div>
            </div>
            <span class="rounded-full border px-3 py-1 text-xs font-black" :class="rankClass(user.rank)">#{{ user.rank }}</span>
          </div>
          <div class="mt-5 rounded-lg bg-black/20 p-4">
            <div class="text-[11px] font-medium text-white/34">Pendapatan valid</div>
            <div class="mt-1 text-xl font-semibold text-gradient-primary">{{ user.income }}</div>
          </div>
          <div class="mt-4 inline-flex rounded-full bg-white/[.055] px-3 py-1 text-[11px] font-semibold uppercase tracking-[.12em] text-white/42">
            {{ user.platform || 'Platform' }}
          </div>
        </article>

        <div v-if="!podiumUsers.length" class="col-span-full grid h-40 place-items-center rounded-lg border border-dashed border-white/[.1] bg-black/20 text-sm text-white/38">
          Leaderboard belum ada.
        </div>
      </section>

      <section v-if="listUsers.length" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-4">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">Rank</th>
                <th class="px-4 pb-1 font-medium">Creator</th>
                <th class="px-4 pb-1 font-medium">Platform</th>
                <th class="px-4 pb-1 text-right font-medium">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in listUsers" :key="user.id" class="group text-white/68">
                <td class="rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <span class="rounded-full border px-3 py-1 text-xs font-black" :class="rankClass(user.rank)">#{{ user.rank }}</span>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex items-center gap-3">
                    <div class="grid h-10 w-10 place-items-center rounded-lg bg-purple-500/14 text-sm font-black text-purple-100/90">{{ user.name?.[0] }}</div>
                    <div>
                      <div class="font-semibold text-white/86">{{ user.name }}</div>
                      <div class="mt-1 text-xs text-white/38">{{ user.handle }}</div>
                    </div>
                  </div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ user.platform || '-' }}</td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 text-right font-semibold text-gradient-primary transition group-hover:bg-white/[.045]">{{ user.income }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="requests.length" class="mt-6 rounded-lg border border-white/[.08] bg-white/[.025] p-5">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-semibold text-white/86">Request Join Brand</h2>
            <p class="mt-1 text-sm text-white/42">Approve creator yang ingin join ke brand kamu.</p>
          </div>
          <div class="rounded-full bg-purple-500/12 px-3 py-1 text-xs font-semibold text-purple-100">{{ requests.length }} Pending</div>
        </div>

        <div class="mt-5 overflow-x-auto">
          <table class="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">User</th>
                <th class="px-4 pb-1 font-medium">Brand</th>
                <th class="px-4 pb-1 font-medium">Akses</th>
                <th class="px-4 pb-1 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in requests" :key="`${request.brand_id}-${request.user_id}`" class="group text-white/68">
                <td class="rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="font-semibold text-white/86">{{ request.user_name }}</div>
                  <div class="mt-1 text-xs text-white/38">{{ request.user_handle }} · {{ request.user_email }}</div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="font-semibold text-white/82">{{ request.brand_name }}</div>
                  <div class="mt-1 text-xs text-white/38">{{ request.brand_handle }}</div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ request.access_type }}</td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex justify-end gap-2">
                    <button class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-400/10 px-3 text-xs font-semibold text-emerald-100/82 hover:bg-emerald-400/16" type="button" @click="updateRequest(request, 'active')">
                      <CheckIcon class="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="updateRequest(request, 'rejected')">
                      <XMarkIcon class="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AppShell>
</template>
