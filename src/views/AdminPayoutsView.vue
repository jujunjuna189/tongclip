<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const loading = ref(true)
const savingId = ref(null)
const statusFilter = ref('all')

const requests = computed(() => (store.adminPayouts?.items || []).filter((item) => item.type === 'Withdrawal'))
const totalIncome = computed(() => store.adminPayouts?.total_income || 'Rp0')
const totalPaid = computed(() => store.adminPayouts?.total_requested || 'Rp0')
const totalRemaining = computed(() => store.adminPayouts?.total_remaining || 'Rp0')
const normalizeStatus = (status) => String(status || 'requested').toLowerCase().replace(/\s+/g, '_')

const filteredRequests = computed(() => requests.value.filter((request) => statusFilter.value === 'all' || normalizeStatus(request.status) === statusFilter.value))
const stats = computed(() => ({
  total: requests.value.length,
  requested: requests.value.filter((item) => normalizeStatus(item.status) === 'requested').length,
  approved: requests.value.filter((item) => normalizeStatus(item.status) === 'approved').length,
  rejected: requests.value.filter((item) => normalizeStatus(item.status) === 'rejected').length,
  paid: requests.value.filter((item) => normalizeStatus(item.status) === 'paid').length,
}))

const statusOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Requested', value: 'requested' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Paid', value: 'paid' },
]

const statusClass = (status) => {
  const normalized = normalizeStatus(status)
  if (normalized === 'approved') return 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'
  if (normalized === 'paid') return 'border-blue-300/25 bg-blue-400/10 text-blue-100'
  if (normalized === 'rejected') return 'border-red-300/25 bg-red-400/10 text-red-100'
  return 'border-amber-300/25 bg-amber-400/10 text-amber-100'
}
const canReview = (request) => normalizeStatus(request.status) === 'requested'
const canComplete = (request) => normalizeStatus(request.status) === 'approved'
const isFinished = (request) => normalizeStatus(request.status) === 'paid'
const canCancel = (request) => {
  const status = normalizeStatus(request.status)
  if (status !== 'approved') return false
  if (!request.reviewed_at) return true

  return (Date.now() - new Date(request.reviewed_at).getTime()) <= 24 * 60 * 60 * 1000
}

const updatePayout = async (request, status) => {
  savingId.value = request.id

  try {
    await store.updateAdminPayout(request.id, { status })
  } finally {
    savingId.value = null
  }
}

onMounted(async () => {
  try {
    await store.loadAdminPayouts()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="max-w-2xl">
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Pengajuan Pencairan</h1>
          <p class="mt-2 text-sm text-white/45">Review permintaan withdraw creator, cek rekening tujuan, lalu setujui atau tolak pengajuan.</p>
        </div>
        <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="flex items-center gap-3 text-white/38">
              <BanknotesIcon class="h-5 w-5" />
              <span class="text-xs font-medium">Total Valid</span>
            </div>
            <div class="mt-2 text-2xl font-semibold text-emerald-200">{{ totalIncome }}</div>
            <p class="mt-1 text-[11px] leading-4 text-white/30">Semua income yang sudah valid.</p>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="flex items-center gap-3 text-white/38">
              <BanknotesIcon class="h-5 w-5" />
              <span class="text-xs font-medium">Total Tersisa</span>
            </div>
            <div class="mt-2 text-2xl font-semibold text-purple-100">{{ totalRemaining }}</div>
            <p class="mt-1 text-[11px] leading-4 text-white/30">Valid dikurangi withdraw proses.</p>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="flex items-center gap-3 text-white/38">
              <ClockIcon class="h-5 w-5" />
              <span class="text-xs font-medium">Total Dicairkan</span>
            </div>
            <div class="mt-3 text-2xl font-semibold text-white/88">{{ totalPaid }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Menunggu Review</div>
            <div class="mt-3 text-2xl font-semibold text-amber-100">{{ stats.requested }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Selesai Dibayar</div>
            <div class="mt-3 text-2xl font-semibold text-blue-100">{{ stats.paid }}</div>
          </div>
        </div>
      </section>

      <section class="mt-6 rounded-lg border border-white/[.08] bg-white/[.025] p-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in statusOptions"
            :key="option.value"
            class="h-10 rounded-lg px-4 text-sm font-semibold transition"
            :class="statusFilter === option.value ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white shadow-blue' : 'bg-white/[.055] text-white/58 hover:bg-white/[.085] hover:text-white'"
            type="button"
            @click="statusFilter = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </section>

      <section class="mt-5">
        <div v-if="loading" class="grid h-28 place-items-center rounded-lg border border-white/[.08] bg-white/[.025] text-sm text-white/40">
          Memuat pengajuan pencairan...
        </div>
        <div v-else-if="!filteredRequests.length" class="grid h-28 place-items-center rounded-lg border border-dashed border-white/[.1] bg-white/[.02] text-sm text-white/38">
          Belum ada pengajuan pencairan.
        </div>

        <div v-else class="overflow-x-auto rounded-lg border border-white/[.08] bg-white/[.025] p-3">
          <table class="w-full min-w-[980px] border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">Creator</th>
                <th class="px-4 pb-1 font-medium">Rekening</th>
                <th class="px-4 pb-1 text-right font-medium">Nominal</th>
                <th class="px-4 pb-1 font-medium">Status</th>
                <th class="px-4 pb-1 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in filteredRequests" :key="request.id" class="group text-white/68">
                <td class="rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="font-semibold text-white/86">{{ request.creator || '-' }}</div>
                  <div class="mt-1 text-xs text-white/34">{{ request.date || '-' }}</div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="max-w-[320px] truncate font-medium text-white/72">{{ request.account || '-' }}</div>
                  <div v-if="request.social_account" class="mt-1 text-xs text-white/34">{{ request.social_account }}</div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 text-right font-semibold text-emerald-200 transition group-hover:bg-white/[.045]">{{ request.amount }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <span class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold" :class="statusClass(request.status)">{{ request.status }}</span>
                </td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex justify-end gap-2">
                    <template v-if="canReview(request)">
                      <button class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-emerald-100 transition hover:bg-white/[.085] disabled:opacity-50" type="button" :disabled="savingId === request.id" @click="updatePayout(request, 'approved')">
                        <CheckCircleIcon class="h-3.5 w-3.5" />
                        Setujui
                      </button>
                      <button class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-red-100 transition hover:bg-white/[.085] disabled:opacity-50" type="button" :disabled="savingId === request.id" @click="updatePayout(request, 'rejected')">
                        <XCircleIcon class="h-3.5 w-3.5" />
                        Tolak
                      </button>
                    </template>
                    <button v-if="canComplete(request)" class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-blue-100 transition hover:bg-white/[.085] disabled:opacity-50" type="button" :disabled="savingId === request.id" @click="updatePayout(request, 'paid')">
                      <BanknotesIcon class="h-3.5 w-3.5" />
                      Selesaikan
                    </button>
                    <button v-if="!canReview(request) && canCancel(request)" class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/65 transition hover:bg-white/[.085] disabled:opacity-40" type="button" :disabled="savingId === request.id" @click="updatePayout(request, 'requested')">
                      <XCircleIcon class="h-3.5 w-3.5" />
                      Batalkan
                    </button>
                    <span v-if="isFinished(request)" class="text-xs font-medium text-white/28">Selesai</span>
                    <span v-else-if="normalizeStatus(request.status) === 'rejected'" class="text-xs font-medium text-red-100/38">Ditolak</span>
                    <span v-else-if="!canReview(request) && !canComplete(request) && !canCancel(request)" class="text-xs font-medium text-white/28">Terkunci</span>
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
