<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  Bars3Icon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
  UserGroupIcon,
  VideoCameraIcon,
  WalletIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const query = ref('')
const statusFilter = ref('all')
const viewMode = ref('card')
const loading = ref(false)
const deleting = ref(false)
const approvingId = ref(null)
const approvalError = ref('')
const creatorToReject = ref(null)
const rejectionNote = ref('')
const rejecting = ref(false)
const showFilters = ref(false)
const filterPopup = ref(null)
const creatorToDelete = ref(null)
const historyLoading = ref(false)
const historyModal = ref(null)
const previewCreator = ref(null)
const historyTab = ref('income')

const statuses = computed(() => {
  const items = store.adminCreators.map((creator) => creator.status).filter(Boolean)
  return [...new Set(items)]
})
const filteredCreators = computed(() => {
  const keyword = query.value.toLowerCase().trim()

  return store.adminCreators.filter((creator) => {
    const matchesKeyword = !keyword || `${creator.name} ${creator.email} ${creator.handle} ${creator.status}`.toLowerCase().includes(keyword)
    const matchesStatus = statusFilter.value === 'all' || creator.status === statusFilter.value

    return matchesKeyword && matchesStatus
  })
})
const totalIncome = computed(() => store.adminCreators.reduce((total, creator) => total + (creator.income_value || 0), 0))
const totalVideos = computed(() => store.adminCreators.reduce((total, creator) => total + (creator.submissions_count || 0), 0))
const pendingApprovals = computed(() => store.adminCreators.filter((creator) => String(creator.status || '').toLowerCase() === 'review').length)
const activeFilterCount = computed(() => Number(statusFilter.value !== 'all'))
const historyIncomeTotal = computed(() => (historyModal.value?.incomes || []).reduce((total, item) => total + (item.amount_value || 0), 0))
const historyPaidTotal = computed(() => (historyModal.value?.withdrawals || [])
  .filter((item) => String(item.status || '').toLowerCase() === 'paid')
  .reduce((total, item) => total + (item.amount_value || 0), 0))

const rupiah = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(value || 0)

const statusClass = (status) => {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'active') return 'bg-emerald-400/10 text-emerald-100/82'
  if (normalized === 'review') return 'bg-amber-400/10 text-amber-100/82'
  if (normalized === 'rejected' || normalized === 'blocked') return 'bg-red-400/10 text-red-100/82'
  return 'bg-white/[.055] text-white/58'
}

const resetFilters = () => {
  statusFilter.value = 'all'
}

const openHistoryModal = async (creator, tab = 'income') => {
  historyTab.value = tab
  historyLoading.value = true
  historyModal.value = {
    creator,
    incomes: [],
    withdrawals: [],
  }

  try {
    historyModal.value = await store.loadAdminCreatorHistory(creator.id)
  } finally {
    historyLoading.value = false
  }
}

const closeHistoryModal = () => {
  if (historyLoading.value) return
  historyModal.value = null
}

const openDeleteModal = (creator) => {
  creatorToDelete.value = creator
}

const closeDeleteModal = () => {
  if (deleting.value) return
  creatorToDelete.value = null
}

const confirmDeleteCreator = async () => {
  if (!creatorToDelete.value) return
  deleting.value = true

  try {
    await store.deleteAdminCreator(creatorToDelete.value.id)
    creatorToDelete.value = null
  } finally {
    deleting.value = false
  }
}

const approveCreator = async (creator) => {
  approvingId.value = creator.id
  approvalError.value = ''

  try {
    const payload = new FormData()
    payload.append('status', 'active')
    await store.updateAdminCreator(creator.id, payload)
  } catch (exception) {
    approvalError.value = exception?.response?.data?.message || 'Pendaftaran belum berhasil disetujui. Silakan coba lagi.'
  } finally {
    approvingId.value = null
  }
}

const isWaitingApproval = (creator) => String(creator.status || '').toLowerCase() === 'review'

const openRejectModal = (creator) => {
  creatorToReject.value = creator
  rejectionNote.value = ''
  approvalError.value = ''
}

const closeRejectModal = () => {
  if (rejecting.value) return
  creatorToReject.value = null
  rejectionNote.value = ''
}

const rejectCreator = async () => {
  if (!creatorToReject.value || !rejectionNote.value.trim()) return
  rejecting.value = true
  approvalError.value = ''

  try {
    const payload = new FormData()
    payload.append('status', 'rejected')
    payload.append('rejection_note', rejectionNote.value.trim())
    await store.updateAdminCreator(creatorToReject.value.id, payload)
    closeRejectModal()
  } catch (exception) {
    approvalError.value = exception?.response?.data?.message || 'Pendaftaran belum berhasil ditolak. Silakan coba lagi.'
  } finally {
    rejecting.value = false
    if (!approvalError.value) {
      creatorToReject.value = null
      rejectionNote.value = ''
    }
  }
}

const handleOutsidePointerDown = (event) => {
  const target = event.target
  if (!(target instanceof Element)) return
  if (!filterPopup.value?.contains(target)) showFilters.value = false
}

onMounted(async () => {
  document.addEventListener('pointerdown', handleOutsidePointerDown)
  loading.value = true

  try {
    await store.loadAdminCreators()
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsidePointerDown)
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Kelola Creator</h1>
          <p class="mt-2 text-sm text-white/45">Pantau creator, akun sosial, submission, dan pendapatan valid.</p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink to="/admin/creators/create" class="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 text-sm font-semibold text-white shadow-blue">
            <PlusIcon class="h-4 w-4 stroke-[2]" />
            Tambah
          </RouterLink>
        </div>
      </div>

      <p v-if="approvalError" class="mt-5 rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ approvalError }}</p>

      <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-medium text-white/40">Total Creator</div>
              <div class="mt-2 text-2xl font-semibold text-white/90">{{ store.adminCreators.length }}</div>
            </div>
            <UserGroupIcon class="h-7 w-7 text-purple-300" />
          </div>
        </section>
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-medium text-white/40">Total Video</div>
              <div class="mt-2 text-2xl font-semibold text-white/90">{{ totalVideos }}</div>
            </div>
            <VideoCameraIcon class="h-7 w-7 text-purple-300" />
          </div>
        </section>
        <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-medium text-white/40">Pendapatan Valid</div>
              <div class="mt-2 text-2xl font-semibold text-white/90">{{ rupiah(totalIncome) }}</div>
            </div>
            <WalletIcon class="h-7 w-7 text-purple-300" />
          </div>
        </section>
        <section class="rounded-lg border border-amber-300/15 bg-amber-400/[.04] p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-medium text-white/40">Menunggu Persetujuan</div>
              <div class="mt-2 text-2xl font-semibold text-white/90">{{ pendingApprovals }}</div>
            </div>
            <ClockIcon class="h-7 w-7 text-amber-200" />
          </div>
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

          <div ref="filterPopup" class="relative shrink-0">
            <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3.5 text-sm font-semibold text-white/68 transition hover:bg-white/[.055] hover:text-white" type="button" @click="showFilters = !showFilters">
              <FunnelIcon class="h-4 w-4" />
              Filter
              <span v-if="activeFilterCount" class="grid h-5 min-w-5 place-items-center rounded-full bg-purple-500/30 px-1 text-[10px] font-black text-purple-100">{{ activeFilterCount }}</span>
            </button>

            <div v-if="showFilters" class="absolute left-0 top-12 z-30 w-72 rounded-lg border border-white/10 bg-[#111113] p-3 shadow-[0_18px_42px_rgba(0,0,0,.38)]">
              <div class="flex items-center justify-between gap-3">
                <div class="text-sm font-semibold text-white/86">Filter Creator</div>
                <button class="grid h-8 w-8 place-items-center rounded-lg bg-white/[.045] text-white/46 transition hover:bg-white/[.075] hover:text-white" type="button" aria-label="Tutup filter" @click="showFilters = false">
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
              <div class="mt-4">
                <div class="text-[11px] font-semibold uppercase tracking-[.12em] text-white/30">Status</div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <button class="h-8 rounded-lg px-3 text-xs font-semibold transition" :class="statusFilter === 'all' ? 'bg-white/10 text-white' : 'border border-white/10 bg-white/[.035] text-white/52 hover:bg-white/[.065] hover:text-white'" type="button" @click="statusFilter = 'all'">Semua</button>
                  <button v-for="status in statuses" :key="status" class="h-8 rounded-lg px-3 text-xs font-semibold transition" :class="statusFilter === status ? 'bg-white/10 text-white' : 'border border-white/10 bg-white/[.035] text-white/52 hover:bg-white/[.065] hover:text-white'" type="button" @click="statusFilter = status">
                    {{ status }}
                  </button>
                </div>
              </div>
              <button class="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-white/[.055] text-xs font-semibold text-white/68 transition hover:bg-white/[.085] hover:text-white disabled:opacity-40" type="button" :disabled="!activeFilterCount" @click="resetFilters">
                Reset filter
              </button>
            </div>
          </div>

          <div class="ml-auto grid h-10 w-[82px] shrink-0 grid-cols-2 rounded-lg border border-white/10 bg-black/20 p-1">
            <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'card' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'card'" aria-label="Card view">
              <Squares2X2Icon class="h-4 w-4" />
            </button>
            <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'list'" aria-label="List view">
              <Bars3Icon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section v-if="loading" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="index in 6" :key="index" class="h-[220px] animate-pulse rounded-lg border border-white/[.08] bg-white/[.035]"></div>
      </section>

      <section v-else-if="viewMode === 'card'" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div v-if="!filteredCreators.length" class="col-span-full grid h-40 place-items-center rounded-lg border border-dashed border-white/[.1] bg-black/20 text-sm text-white/38">
          Creator tidak ditemukan.
        </div>
        <article v-for="creator in filteredCreators" :key="creator.handle" class="dark-card rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-purple-500/40">
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-purple-500/14 text-base font-black text-purple-100/90">{{ creator.name?.[0] }}</div>
              <div class="min-w-0">
                <h2 class="truncate font-semibold text-white/88">{{ creator.name }}</h2>
                <p class="mt-1 truncate text-xs text-white/38">{{ creator.email || creator.handle }}</p>
              </div>
            </div>
            <span class="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium" :class="statusClass(creator.status)">{{ creator.status || 'Active' }}</span>
          </div>

          <div class="mt-5 flex items-center gap-4 rounded-lg bg-white/[.035] px-4 py-3">
            <div class="flex items-center gap-1.5 text-sm text-white/60">
              <span class="font-semibold text-white/86">{{ creator.accounts_count || 0 }}</span>
              <span class="text-xs text-white/34">Akun</span>
            </div>
            <span class="text-white/14">·</span>
            <div class="flex items-center gap-1.5 text-sm text-white/60">
              <span class="font-semibold text-white/86">{{ creator.submissions_count || 0 }}</span>
              <span class="text-xs text-white/34">Video</span>
            </div>
            <span class="text-white/14">·</span>
            <div class="ml-auto text-sm font-semibold text-gradient-primary">{{ creator.income }}</div>
          </div>

          <div v-if="isWaitingApproval(creator)" class="mt-3">
            <button class="inline-flex h-9 items-center gap-2 rounded-lg border border-purple-300/20 bg-purple-500/[.08] px-3 text-xs font-semibold text-purple-100 transition hover:bg-purple-500/15" type="button" @click="previewCreator = creator">
              <EyeIcon class="h-4 w-4" /> Preview akun sosial
            </button>
          </div>

          <div v-if="isWaitingApproval(creator)" class="mt-5 grid grid-cols-2 gap-2">
            <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-400/12 px-3 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/18 disabled:opacity-50" type="button" :disabled="approvingId === creator.id" @click="approveCreator(creator)">
              <CheckCircleIcon class="h-4 w-4" />
              {{ approvingId === creator.id ? 'Menyetujui...' : 'Setujui' }}
            </button>
            <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100 transition hover:bg-red-400/16" type="button" :disabled="approvingId === creator.id" @click="openRejectModal(creator)">
              <XCircleIcon class="h-4 w-4" />
              Tolak
            </button>
          </div>
          <div v-else class="mt-5 grid grid-cols-2 gap-2">
            <button class="inline-flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-white/[.055] px-2.5 text-xs font-semibold text-emerald-100/82 hover:bg-white/[.085]" type="button" @click="openHistoryModal(creator, 'income')">
              <WalletIcon class="h-4 w-4" />
              Pendapatan
            </button>
            <button class="inline-flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-white/[.055] px-2.5 text-xs font-semibold text-blue-100/82 hover:bg-white/[.085]" type="button" @click="openHistoryModal(creator, 'withdrawal')">
              <BanknotesIcon class="h-4 w-4" />
              Pengajuan
            </button>
            <RouterLink :to="`/admin/creators/${creator.id}/edit`" class="inline-flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-white/[.055] px-2.5 text-xs font-semibold text-white/72 hover:bg-white/[.085]">
              <PencilSquareIcon class="h-4 w-4" />
              Edit
            </RouterLink>
            <button class="inline-flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-red-400/10 px-2.5 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="openDeleteModal(creator)">
              <TrashIcon class="h-4 w-4" />
              Hapus
            </button>
          </div>
        </article>
      </section>

      <section v-else class="mt-6 overflow-x-auto">
        <div class="min-w-[920px] space-y-2">
          <table class="w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">Creator</th>
                <th class="px-4 pb-1 font-medium">Username</th>
                <th class="px-4 pb-1 font-medium">Akun</th>
                <th class="px-4 pb-1 font-medium">Video</th>
                <th class="px-4 pb-1 font-medium">Pendapatan</th>
                <th class="px-4 pb-1 font-medium">Status</th>
                <th class="px-4 pb-1 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredCreators.length">
                <td colspan="7" class="rounded-lg border border-dashed border-white/[.1] bg-black/20 px-4 py-12 text-center text-sm text-white/38">Creator tidak ditemukan.</td>
              </tr>
              <tr v-for="creator in filteredCreators" :key="creator.handle" class="group text-white/68">
                <td class="rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex items-center gap-3">
                    <div class="grid h-10 w-10 place-items-center rounded-lg bg-purple-500/14 text-sm font-black text-purple-100/90">{{ creator.name?.[0] }}</div>
                    <div>
                      <div class="text-sm font-semibold text-white/86">{{ creator.name }}</div>
                      <div class="mt-1 text-[11px] text-white/34">{{ creator.email || '-' }}</div>
                    </div>
                  </div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ creator.handle }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div>{{ creator.accounts_count || 0 }}</div>
                  <button v-if="isWaitingApproval(creator)" class="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-purple-200 hover:text-purple-100" type="button" @click="previewCreator = creator"><EyeIcon class="h-3.5 w-3.5" /> Preview</button>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ creator.submissions_count || 0 }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 font-semibold text-gradient-primary transition group-hover:bg-white/[.045]">{{ creator.income }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <span class="rounded-full px-3 py-1 text-[11px] font-medium" :class="statusClass(creator.status)">{{ creator.status || 'Active' }}</span>
                </td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex flex-wrap justify-end gap-2">
                    <template v-if="isWaitingApproval(creator)">
                      <button class="inline-flex h-8 items-center gap-2 rounded-lg bg-emerald-400/12 px-3 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/18 disabled:opacity-50" type="button" :disabled="approvingId === creator.id" @click="approveCreator(creator)">
                        <CheckCircleIcon class="h-4 w-4" />
                        {{ approvingId === creator.id ? 'Menyetujui...' : 'Setujui' }}
                      </button>
                      <button class="inline-flex h-8 items-center gap-2 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100 transition hover:bg-red-400/16" type="button" :disabled="approvingId === creator.id" @click="openRejectModal(creator)">
                        <XCircleIcon class="h-4 w-4" />
                        Tolak
                      </button>
                    </template>
                    <template v-else>
                      <button class="inline-flex h-8 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-emerald-100/82 hover:bg-white/[.085]" type="button" @click="openHistoryModal(creator, 'income')">
                      <WalletIcon class="h-4 w-4" />
                      Pendapatan
                      </button>
                      <button class="inline-flex h-8 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-blue-100/82 hover:bg-white/[.085]" type="button" @click="openHistoryModal(creator, 'withdrawal')">
                      <BanknotesIcon class="h-4 w-4" />
                      Pengajuan
                      </button>
                      <RouterLink :to="`/admin/creators/${creator.id}/edit`" class="inline-flex h-8 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/72 hover:bg-white/[.085]">
                      <PencilSquareIcon class="h-4 w-4" />
                      Edit
                      </RouterLink>
                      <button class="inline-flex h-8 items-center gap-2 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="openDeleteModal(creator)">
                      <TrashIcon class="h-4 w-4" />
                      Hapus
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-if="creatorToEdit" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeEditModal">
        <form class="w-full max-w-lg rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]" @submit.prevent="saveCreator">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-base font-semibold text-white/90">Edit creator</h2>
              <p class="mt-2 text-sm leading-6 text-white/46">Ubah nama, username, dan status creator.</p>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" @click="closeEditModal">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="block md:col-span-2">
              <span class="text-xs font-medium text-white/44">Nama</span>
              <input v-model="editForm.name" required class="form-control" placeholder="Nama creator" />
            </label>
            <label class="block">
              <span class="text-xs font-medium text-white/44">Username</span>
              <input v-model="editForm.handle" class="form-control" placeholder="@creator" />
            </label>
            <label class="block">
              <span class="text-xs font-medium text-white/44">Status</span>
              <select v-model="editForm.status" class="form-control">
                <option value="active">Active</option>
                <option value="review">Review</option>
                <option value="rejected">Rejected</option>
                <option value="blocked">Blocked</option>
              </select>
            </label>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button class="h-10 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" :disabled="saving" @click="closeEditModal">Batal</button>
            <button class="h-10 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-5 text-sm font-semibold text-white shadow-blue transition hover:opacity-90 disabled:opacity-60" type="submit" :disabled="saving">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>

      <div v-if="previewCreator" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="previewCreator = null">
        <section class="w-full max-w-lg rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]" role="dialog" aria-modal="true" aria-label="Preview akun sosial">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="text-base font-semibold text-white/90">Akun sosial diajukan</h2>
              <p class="mt-1 truncate text-sm text-white/46">{{ previewCreator.name }} · {{ previewCreator.handle }}</p>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" aria-label="Tutup preview" @click="previewCreator = null"><XMarkIcon class="h-4 w-4" /></button>
          </div>
          <div class="mt-5 border-t border-white/10 pt-4 text-sm">
            <span class="text-white/42">WhatsApp</span>
            <span class="ml-3 font-medium text-white/82">{{ previewCreator.whatsapp_number || '-' }}</span>
          </div>
          <div class="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">
            <div v-for="account in previewCreator.submitted_social_accounts || []" :key="account.id" class="flex items-center justify-between gap-3 rounded-lg border border-white/[.08] bg-white/[.025] px-4 py-3">
              <div class="min-w-0">
                <p class="text-xs font-medium text-white/42">{{ account.platform === 'youtube' ? 'YouTube' : account.platform === 'instagram' ? 'Instagram' : account.platform === 'facebook' ? 'Facebook' : 'TikTok' }}</p>
                <p class="mt-1 truncate text-sm font-semibold text-white/82">{{ account.handle }}</p>
              </div>
              <a :href="account.social_url" target="_blank" rel="noopener noreferrer" class="shrink-0 text-xs font-semibold text-purple-200 hover:text-purple-100">Lihat profil</a>
            </div>
            <p v-if="!previewCreator.submitted_social_accounts?.length" class="py-4 text-sm text-white/40">Belum ada link akun sosial.</p>
          </div>
        </section>
      </div>

      <div v-if="creatorToReject" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeRejectModal">
        <form class="w-full max-w-md rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]" @submit.prevent="rejectCreator">
          <div class="flex items-start justify-between gap-4">
            <div class="flex gap-4">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-100">
                <XCircleIcon class="h-6 w-6" />
              </div>
              <div>
                <h2 class="text-base font-semibold text-white/90">Tolak pendaftaran?</h2>
                <p class="mt-2 text-sm leading-6 text-white/46">Berikan alasan yang jelas agar {{ creatorToReject.name }} mengetahui data yang perlu diperbaiki.</p>
              </div>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" @click="closeRejectModal">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <label class="mt-5 block">
            <span class="text-xs font-medium text-white/44">Catatan penolakan</span>
            <textarea v-model="rejectionNote" required maxlength="2000" rows="5" class="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-purple-400/50" placeholder="Contoh: Link akun sosial belum dapat diakses. Mohon perbarui link lalu hubungi admin."></textarea>
          </label>

          <div class="mt-6 flex justify-end gap-3">
            <button class="h-10 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" :disabled="rejecting" @click="closeRejectModal">Batal</button>
            <button class="h-10 rounded-lg bg-red-500/85 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50" type="submit" :disabled="rejecting || !rejectionNote.trim()">
              {{ rejecting ? 'Menolak...' : 'Tolak Pendaftaran' }}
            </button>
          </div>
        </form>
      </div>

      <div v-if="creatorToDelete" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeDeleteModal">
        <section class="w-full max-w-md rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]">
          <div class="flex items-start justify-between gap-4">
            <div class="flex gap-4">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-100">
                <ExclamationTriangleIcon class="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <h2 class="text-base font-semibold text-white/90">Hapus creator?</h2>
                <p class="mt-2 text-sm leading-6 text-white/46">Creator ini akan dihapus dari database beserta data yang terhubung.</p>
              </div>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" @click="closeDeleteModal">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 rounded-lg border border-white/[.08] bg-white/[.03] p-4">
            <div class="text-sm font-semibold text-white/86">{{ creatorToDelete.name }}</div>
            <div class="mt-1 text-xs text-white/38">{{ creatorToDelete.handle }} · {{ creatorToDelete.email || '-' }}</div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button class="h-10 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" :disabled="deleting" @click="closeDeleteModal">Batal</button>
            <button class="h-10 rounded-lg bg-red-500/85 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60" type="button" :disabled="deleting" @click="confirmDeleteCreator">
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </section>
      </div>

      <div v-if="historyModal" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeHistoryModal">
        <section class="w-full max-w-3xl rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-base font-semibold text-white/90">{{ historyModal.creator?.name || 'Creator' }}</h2>
              <p class="mt-1 text-sm text-white/42">{{ historyModal.creator?.handle || '-' }} · {{ historyModal.creator?.email || '-' }}</p>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" @click="closeHistoryModal">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div class="grid h-10 grid-cols-2 rounded-lg border border-white/10 bg-black/20 p-1 sm:w-[360px]">
              <button class="rounded-md text-xs font-semibold transition" :class="historyTab === 'income' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="historyTab = 'income'">
                Riwayat Pendapatan
              </button>
              <button class="rounded-md text-xs font-semibold transition" :class="historyTab === 'withdrawal' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="historyTab = 'withdrawal'">
                Riwayat Pengajuan
              </button>
            </div>
            <div class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-2 text-right">
              <div class="text-[11px] font-medium text-white/34">{{ historyTab === 'income' ? 'Total Pendapatan' : 'Total Dicairkan' }}</div>
              <div class="mt-0.5 text-sm font-semibold" :class="historyTab === 'income' ? 'text-emerald-200' : 'text-gradient-primary'">
                {{ historyTab === 'income' ? rupiah(historyIncomeTotal) : rupiah(historyPaidTotal) }}
              </div>
            </div>
          </div>

          <div v-if="historyLoading" class="mt-5 grid h-28 place-items-center rounded-lg border border-white/[.08] bg-black/20 text-sm text-white/40">
            Memuat riwayat...
          </div>

          <div v-else-if="historyTab === 'income'" class="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1">
            <div v-if="!historyModal.incomes.length" class="grid h-24 place-items-center rounded-lg border border-dashed border-white/[.1] bg-black/20 text-sm text-white/35">
              Belum ada riwayat pendapatan.
            </div>
            <div v-for="item in historyModal.incomes" :key="item.id" class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3">
              <div class="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-white/86">{{ item.source || item.campaign || '-' }}</div>
                  <div class="mt-0.5 text-xs text-white/42">{{ item.date || '-' }} dari {{ item.account || '-' }}</div>
                </div>
                <div class="text-sm font-semibold text-emerald-200 md:text-right">{{ item.amount }}</div>
                <span class="inline-flex w-fit rounded-full border border-white/10 bg-white/[.045] px-3 py-1 text-[11px] font-medium text-white/58">{{ item.status }}</span>
              </div>
            </div>
          </div>

          <div v-else class="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1">
            <div v-if="!historyModal.withdrawals.length" class="grid h-24 place-items-center rounded-lg border border-dashed border-white/[.1] bg-black/20 text-sm text-white/35">
              Belum ada riwayat pengajuan.
            </div>
            <div v-for="item in historyModal.withdrawals" :key="item.id" class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3">
              <div class="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-white/86">{{ item.account || '-' }}</div>
                  <div class="mt-0.5 text-xs text-white/42">{{ item.date || '-' }} · {{ item.social_account || '-' }}</div>
                </div>
                <div class="text-sm font-semibold text-gradient-primary md:text-right">{{ item.amount }}</div>
                <span class="inline-flex w-fit rounded-full border border-white/10 bg-white/[.045] px-3 py-1 text-[11px] font-medium text-white/58">{{ item.status }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
