<script setup>
import { computed, onMounted, ref } from 'vue'
import { Bars3Icon, Squares2X2Icon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const incomes = computed(() => store.adminPayouts?.items || [])
const totalPayout = computed(() => store.adminPayouts?.total_income || 'Rp0')
const viewMode = ref('card')

const editPayout = async (income) => {
  const status = window.prompt('Status payout', income.status)
  if (!status) return
  await store.updateAdminPayout(income.id, { status: status.toLowerCase() })
}

const deletePayout = async (income) => {
  if (!window.confirm(`Hapus payout "${income.source}"?`)) return
  await store.deleteAdminPayout(income.id)
}

onMounted(() => store.loadAdminPayouts())
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <div class="grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
        <section class="dark-card rounded-lg p-6">
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Payout</h1>
          <p class="mt-2 text-sm text-white/45">Ringkasan payout dan money movement creator.</p>
          <div class="mt-8 rounded-lg border border-emerald-300/15 bg-emerald-400/10 p-5">
            <div class="text-sm font-medium text-white/48">Total payout valid</div>
            <div class="mt-4 text-[34px] font-semibold leading-none tracking-[-.025em] text-emerald-200">{{ totalPayout }}</div>
          </div>
        </section>

        <section class="dark-card rounded-lg p-5">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <h2 class="text-lg font-semibold tracking-[-.01em]">Money Movement</h2>
            <div class="grid h-10 grid-cols-2 rounded-lg border border-white/10 bg-white/[.035] p-1">
              <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'card' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'card'" aria-label="Card view">
                <Squares2X2Icon class="h-4 w-4" />
              </button>
              <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'list'" aria-label="List view">
                <Bars3Icon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div v-if="viewMode === 'card'" class="mt-4 grid gap-3">
            <article v-for="income in incomes" :key="income.id" class="rounded-lg border border-white/[.06] bg-white/[.028] p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-sm font-semibold text-white/86">{{ income.source }}</h3>
                  <p class="mt-1 text-xs text-white/38">{{ income.account || '-' }} · {{ income.date }}</p>
                </div>
                <div class="text-sm font-semibold text-emerald-200/90">{{ income.amount }}</div>
              </div>
              <span class="mt-4 inline-flex rounded-full bg-white/[.055] px-3 py-1 text-[11px] font-medium text-white/64">{{ income.status }}</span>
              <div class="mt-4 flex gap-2">
                <button class="h-9 rounded-lg bg-white/[.055] px-4 text-xs font-semibold text-white/72 hover:bg-white/[.085]" type="button" @click="editPayout(income)">Edit</button>
                <button class="h-9 rounded-lg bg-red-400/10 px-4 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="deletePayout(income)">Hapus</button>
              </div>
            </article>
          </div>

          <div v-else class="mt-4 overflow-x-auto">
            <table class="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
              <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
                <tr>
                  <th class="px-4 pb-1 font-medium">Tanggal</th>
                  <th class="px-4 pb-1 font-medium">Source</th>
                  <th class="px-4 pb-1 font-medium">Akun</th>
                  <th class="px-4 pb-1 font-medium">Amount</th>
                  <th class="px-4 pb-1 font-medium">Status</th>
                  <th class="px-4 pb-1 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="income in incomes" :key="income.id" class="group text-white/68">
                  <td class="whitespace-nowrap rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ income.date }}</td>
                  <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 font-semibold text-white/84 transition group-hover:bg-white/[.045]">{{ income.source }}</td>
                  <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ income.account || '-' }}</td>
                  <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 font-semibold text-emerald-200/90 transition group-hover:bg-white/[.045]">{{ income.amount }}</td>
                  <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                    <span class="rounded-full bg-white/[.055] px-3 py-1 text-[11px] font-medium text-white/64">{{ income.status }}</span>
                  </td>
                  <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                    <div class="flex gap-2">
                      <button class="h-8 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/72 hover:bg-white/[.085]" type="button" @click="editPayout(income)">Edit</button>
                      <button class="h-8 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="deletePayout(income)">Hapus</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
