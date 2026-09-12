<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const loading = ref(true)
const savingId = ref(null)
const deleting = ref(false)
const statusFilter = ref('all')
const payoutToDelete = ref(null)

const requests = computed(() => (store.adminPayouts?.items || []).filter((item) => item.type === 'Withdrawal'))
const totalIncome = computed(() => store.adminPayouts?.total_income || 'Rp0')
const totalRequested = computed(() => store.adminPayouts?.total_requested || 'Rp0')
const normalizeStatus = (status) => String(status || 'requested').toLowerCase().replace(/\s+/g, '_')

const filteredRequests = computed(() => requests.value.filter((request) => statusFilter.value === 'all' || normalizeStatus(request.status) === statusFilter.value))
const stats = computed(() => ({
  total: requests.value.length,
  requested: requests.value.filter((item) => normalizeStatus(item.status) === 'requested').length,
  approved: requests.value.filter((item) => normalizeStatus(item.status) === 'approved').length,
  rejected: requests.value.filter((item) => normalizeStatus(item.status) === 'rejected').length,
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

const updatePayout = async (request, status) => {
  savingId.value = request.id

  try {
    await store.updateAdminPayout(request.id, { status })
  } finally {
    savingId.value = null
  }
}

const openDeleteModal = (request) => {
  payoutToDelete.value = request
}

const closeDeleteModal = () => {
  if (deleting.value) return
  payoutToDelete.value = null
}

const confirmDeletePayout = async () => {
  if (!payoutToDelete.value) return
  deleting.value = true

  try {
    await store.deleteAdminPayout(payoutToDelete.value.id)
    payoutToDelete.value = null
  } finally {
    deleting.value = false
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
        <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="flex items-center gap-3 text-white/38">
              <BanknotesIcon class="h-5 w-5" />
              <span class="text-xs font-medium">Saldo Valid</span>
            </div>
            <div class="mt-3 text-2xl font-semibold text-emerald-200">{{ totalIncome }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="flex items-center gap-3 text-white/38">
              <ClockIcon class="h-5 w-5" />
              <span class="text-xs font-medium">Total Diajukan</span>
            </div>
            <div class="mt-3 text-2xl font-semibold text-white/88">{{ totalRequested }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Menunggu Review</div>
            <div class="mt-3 text-2xl font-semibold text-amber-100">{{ stats.requested }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Total Pengajuan</div>
            <div class="mt-3 text-2xl font-semibold text-white/88">{{ stats.total }}</div>
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

      <section class="mt-5 space-y-3">
        <div v-if="loading" class="grid h-28 place-items-center rounded-lg border border-white/[.08] bg-white/[.025] text-sm text-white/40">
          Memuat pengajuan pencairan...
        </div>
        <div v-else-if="!filteredRequests.length" class="grid h-28 place-items-center rounded-lg border border-dashed border-white/[.1] bg-white/[.02] text-sm text-white/38">
          Belum ada pengajuan pencairan.
        </div>

        <article v-for="request in filteredRequests" :key="request.id" class="rounded-lg border border-white/[.08] bg-white/[.025] p-4 transition hover:bg-white/[.035]">
          <div class="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full border px-3 py-1 text-[11px] font-semibold" :class="statusClass(request.status)">{{ request.status }}</span>
                <span class="text-xs text-white/34">{{ request.date }}</span>
              </div>
              <h2 class="mt-3 text-lg font-semibold text-white/90">{{ request.creator || '-' }}</h2>
              <div class="mt-2 grid gap-2 text-sm text-white/48 md:grid-cols-2">
                <div>
                  <div class="text-xs text-white/30">Rekening Tujuan</div>
                  <div class="mt-1 font-medium text-white/72">{{ request.account || '-' }}</div>
                </div>
                <div>
                  <div class="text-xs text-white/30">Nominal Diajukan</div>
                  <div class="mt-1 font-semibold text-emerald-200">{{ request.amount }}</div>
                </div>
              </div>
            </div>

            <div class="grid gap-2 rounded-lg border border-white/[.08] bg-black/20 p-3 sm:grid-cols-3 xl:grid-cols-2">
              <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-400/12 px-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/18 disabled:opacity-50" type="button" :disabled="savingId === request.id" @click="updatePayout(request, 'approved')">
                <CheckCircleIcon class="h-4 w-4" />
                Setujui
              </button>
              <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-400/12 px-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-400/18 disabled:opacity-50" type="button" :disabled="savingId === request.id" @click="updatePayout(request, 'paid')">
                <BanknotesIcon class="h-4 w-4" />
                Selesai
              </button>
              <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-400/12 px-3 text-sm font-semibold text-red-100 transition hover:bg-red-400/18 disabled:opacity-50" type="button" :disabled="savingId === request.id" @click="updatePayout(request, 'rejected')">
                <XCircleIcon class="h-4 w-4" />
                Tolak
              </button>
              <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white/[.055] px-3 text-sm font-semibold text-white/58 transition hover:bg-white/[.085] hover:text-white" type="button" @click="openDeleteModal(request)">
                <TrashIcon class="h-4 w-4" />
                Hapus
              </button>
            </div>
          </div>
        </article>
      </section>

      <div v-if="payoutToDelete" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeDeleteModal">
        <section class="w-full max-w-md rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]">
          <div class="flex gap-4">
            <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-100">
              <ExclamationTriangleIcon class="h-6 w-6 stroke-[1.8]" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-white/90">Hapus pengajuan?</h2>
              <p class="mt-2 text-sm leading-6 text-white/46">Pengajuan pencairan ini akan dihapus dari database.</p>
            </div>
          </div>
          <div class="mt-5 rounded-lg border border-white/[.08] bg-white/[.03] p-4">
            <div class="text-sm font-semibold text-white/86">{{ payoutToDelete.creator || '-' }}</div>
            <div class="mt-1 text-xs text-white/38">{{ payoutToDelete.amount }} · {{ payoutToDelete.account || '-' }}</div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button class="h-10 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" :disabled="deleting" @click="closeDeleteModal">Batal</button>
            <button class="h-10 rounded-lg bg-red-500/85 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60" type="button" :disabled="deleting" @click="confirmDeletePayout">
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
