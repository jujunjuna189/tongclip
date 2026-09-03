<script setup>
import { computed, onMounted } from 'vue'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const incomes = computed(() => store.incomes)
const withdrawableBalance = computed(() => store.withdrawableBalance)
const isWithdrawOpen = computed(() => {
  const date = new Date().getDate()
  return date === 15 || date === 16
})

onMounted(async () => {
  if (!store.stats.length) await store.loadDashboard()
  await store.loadIncomes()
})
</script>

<template>
  <AppShell>
    <div class="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section class="dark-card rounded-lg p-6">
        <h1 class="text-3xl font-black">Payment</h1>
        <p class="mt-2 text-white/52">Withdraw dan money balance. Penarikan dana dibuka tanggal 15 & 16 tiap bulan.</p>
        <div class="mt-7 rounded-lg bg-gradient-to-br from-bluebrand/28 to-black p-6">
          <div class="text-sm text-white/50">Saldo bisa dicairkan</div>
          <div class="mt-2 text-4xl font-black">{{ withdrawableBalance }}</div>
        </div>
        <button
          class="mt-5 w-full rounded-lg px-4 py-4 font-black transition"
          :class="isWithdrawOpen ? 'btn-blue' : 'cursor-not-allowed border border-white/10 bg-white/[.045] text-white/36'"
          :disabled="!isWithdrawOpen"
        >
          {{ isWithdrawOpen ? 'Ajukan Withdraw' : 'Withdraw dibuka tanggal 15 & 16' }}
        </button>
      </section>
      <section class="dark-card rounded-lg p-6">
        <h2 class="text-xl font-black">Money Movement</h2>
        <div class="mt-5 space-y-3">
          <div v-for="item in incomes" :key="item.date" class="flex items-center justify-between rounded-lg border border-white/10 bg-white/[.025] p-4">
            <div>
              <div class="font-black">{{ item.source }}</div>
              <div class="text-sm text-white/42">{{ item.date }} dari {{ item.account }}</div>
            </div>
            <div class="font-black text-blue-300">{{ item.amount }}</div>
          </div>
        </div>
      </section>
    </div>
  </AppShell>
</template>
