<script setup>
import { computed, onMounted } from 'vue'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const users = computed(() => {
  const accountIncomes = new Map(store.leaderboard.map((item) => [item.id, item]))

  return store.accounts
    .filter((account) => account.type === 'social_account')
    .map((account) => {
      const leaderboardItem = accountIncomes.get(account.id)

      return {
        id: account.id,
        name: account.name,
        handle: account.handle,
        platform: account.platform,
        income: leaderboardItem?.income || account.balance,
        income_value: leaderboardItem?.income_value ?? account.balance_value,
      }
    })
    .sort((a, b) => b.income_value - a.income_value)
})
const requests = computed(() => store.brandRequests)

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
    <section class="dark-card rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black">Top Leaderboard</h1>
          <p class="mt-2 text-white/50">Akun sosial dengan pendapatan tertinggi bulan ini.</p>
        </div>
      </div>
      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <article v-for="user in users" :key="user.id" class="flex flex-col rounded-lg border border-white/10 bg-white/[.025] p-5">
          <div class="flex items-start justify-between">
            <div>
              <div class="grid h-12 w-12 place-items-center rounded-lg bg-purple-500/20 text-xl font-black text-purple-100">{{ user.name[0] }}</div>
              <h2 class="mt-5 text-xl font-black">{{ user.name }}</h2>
              <p class="mt-1 text-white/46">{{ user.handle }}</p>
              <p v-if="user.platform" class="mt-2 text-xs font-semibold uppercase tracking-wider text-white/32">{{ user.platform }}</p>
            </div>
            <p class="rounded-lg bg-white/[.05] px-3 py-2 text-xl font-bold text-gradient-primary">{{ user.income }}</p>
          </div>
        </article>
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
        <table class="w-full min-w-[720px] text-left text-sm">
          <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
            <tr>
              <th class="pb-3 font-medium">User</th>
              <th class="pb-3 font-medium">Brand</th>
              <th class="pb-3 font-medium">Akses</th>
              <th class="pb-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/[.06]">
            <tr v-for="request in requests" :key="`${request.brand_id}-${request.user_id}`" class="text-white/68">
              <td class="py-4">
                <div class="font-semibold text-white/86">{{ request.user_name }}</div>
                <div class="mt-1 text-xs text-white/38">{{ request.user_handle }} · {{ request.user_email }}</div>
              </td>
              <td class="py-4">
                <div class="font-semibold text-white/82">{{ request.brand_name }}</div>
                <div class="mt-1 text-xs text-white/38">{{ request.brand_handle }}</div>
              </td>
              <td class="py-4">{{ request.access_type }}</td>
              <td class="py-4">
                <div class="flex justify-end gap-2">
                  <button class="h-8 rounded-lg bg-emerald-400/10 px-3 text-xs font-semibold text-emerald-100/82 hover:bg-emerald-400/16" type="button" @click="updateRequest(request, 'active')">Approve</button>
                  <button class="h-8 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="updateRequest(request, 'rejected')">Reject</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AppShell>
</template>
