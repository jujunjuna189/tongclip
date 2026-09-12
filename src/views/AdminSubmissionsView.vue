<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const loading = ref(true)
const savingId = ref(null)
const deleting = ref(false)
const query = ref('')
const statusFilter = ref('all')
const submissionToDelete = ref(null)
const reviewDrafts = ref({})

const statusOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Review', value: 'review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const normalizeStatus = (status) => String(status || 'review').toLowerCase().replace(/\s+/g, '_')
const statusLabel = (status) => {
  const normalized = normalizeStatus(status)
  if (normalized === 'approved') return 'Approved'
  if (normalized === 'rejected') return 'Rejected'
  return 'Review'
}
const statusClass = (status) => {
  const normalized = normalizeStatus(status)
  if (normalized === 'approved') return 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'
  if (normalized === 'rejected') return 'border-red-300/25 bg-red-400/10 text-red-100'
  return 'border-amber-300/25 bg-amber-400/10 text-amber-100'
}

const submissions = computed(() => store.adminSubmissions)
const stats = computed(() => ({
  total: submissions.value.length,
  review: submissions.value.filter((item) => normalizeStatus(item.status) === 'review').length,
  approved: submissions.value.filter((item) => normalizeStatus(item.status) === 'approved').length,
  rejected: submissions.value.filter((item) => normalizeStatus(item.status) === 'rejected').length,
}))

const filteredSubmissions = computed(() => {
  const search = query.value.trim().toLowerCase()

  return submissions.value.filter((submission) => {
    const statusMatch = statusFilter.value === 'all' || normalizeStatus(submission.status) === statusFilter.value
    const text = [
      submission.campaign,
      submission.creator,
      submission.account,
      submission.caption,
      submission.type,
      submission.link,
    ].join(' ').toLowerCase()

    return statusMatch && (!search || text.includes(search))
  })
})

const syncDrafts = () => {
  reviewDrafts.value = Object.fromEntries(submissions.value.map((submission) => [
    submission.id,
    {
      views: submission.views_value ?? 0,
      estimated_payout: submission.estimated_payout_value ?? 0,
    },
  ]))
}

const updateSubmissionStatus = async (submission, status) => {
  savingId.value = submission.id

  try {
    const draft = reviewDrafts.value[submission.id] || {}
    await store.updateAdminSubmission(submission.id, {
      status,
      views: Number(draft.views || 0),
      estimated_payout: Number(draft.estimated_payout || 0),
    })
  } finally {
    savingId.value = null
  }
}

const openDeleteModal = (submission) => {
  submissionToDelete.value = submission
}

const closeDeleteModal = () => {
  if (deleting.value) return
  submissionToDelete.value = null
}

const confirmDeleteSubmission = async () => {
  if (!submissionToDelete.value) return

  deleting.value = true

  try {
    await store.deleteAdminSubmission(submissionToDelete.value.id)
    submissionToDelete.value = null
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  try {
    await store.loadAdminSubmissions()
    syncDrafts()
  } finally {
    loading.value = false
  }
})

watch(submissions, syncDrafts)
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="max-w-2xl">
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Review Submission</h1>
          <p class="mt-2 text-sm text-white/45">Validasi link video, input views, payout, lalu approve atau reject submission.</p>
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div v-for="item in [
            { label: 'Total', value: stats.total },
            { label: 'Review', value: stats.review },
            { label: 'Approved', value: stats.approved },
            { label: 'Rejected', value: stats.rejected },
          ]" :key="item.label" class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3">
            <div class="text-xs font-medium text-white/38">{{ item.label }}</div>
            <div class="mt-2 text-2xl font-semibold text-white/88">{{ item.value }}</div>
          </div>
        </div>
      </section>

      <section class="mt-6 rounded-lg border border-white/[.08] bg-white/[.025] p-4">
        <div class="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label class="flex h-11 items-center gap-3 rounded-lg border border-white/[.08] bg-black/20 px-3">
            <MagnifyingGlassIcon class="h-4 w-4 text-white/32" />
            <input v-model="query" class="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" placeholder="Cari campaign, creator, akun, atau link video" />
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in statusOptions"
              :key="option.value"
              class="h-11 rounded-lg px-4 text-sm font-semibold transition"
              :class="statusFilter === option.value ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white shadow-blue' : 'bg-white/[.055] text-white/58 hover:bg-white/[.085] hover:text-white'"
              type="button"
              @click="statusFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </section>

      <section class="mt-5 space-y-3">
        <div v-if="loading" class="grid h-28 place-items-center rounded-lg border border-white/[.08] bg-white/[.025] text-sm text-white/40">
          Memuat submission...
        </div>
        <div v-else-if="!filteredSubmissions.length" class="grid h-28 place-items-center rounded-lg border border-dashed border-white/[.1] bg-white/[.02] text-sm text-white/38">
          Tidak ada submission yang cocok.
        </div>

        <article v-for="submission in filteredSubmissions" :key="submission.id" class="rounded-lg border border-white/[.08] bg-white/[.025] p-4 transition hover:bg-white/[.035]">
          <div class="grid gap-4 xl:grid-cols-[1.1fr_340px]">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full border px-3 py-1 text-[11px] font-semibold" :class="statusClass(submission.status)">{{ statusLabel(submission.status) }}</span>
                <span class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/48">{{ submission.type || '-' }}</span>
                <span class="text-xs text-white/34">{{ submission.submitted_at || '-' }}</span>
              </div>
              <h2 class="mt-3 text-base font-semibold text-white/90">{{ submission.campaign || submission.caption || '-' }}</h2>
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/45">
                <span>Creator: <span class="text-white/72">{{ submission.creator || '-' }}</span></span>
                <span>Akun: <span class="text-white/72">{{ submission.account || '-' }}</span></span>
              </div>
              <a :href="submission.link" target="_blank" rel="noreferrer" class="mt-4 inline-flex max-w-full items-center gap-2 rounded-lg border border-purple-300/20 bg-purple-400/10 px-3 py-2 text-sm font-semibold text-purple-100 transition hover:bg-purple-400/16">
                <ArrowTopRightOnSquareIcon class="h-4 w-4 shrink-0" />
                <span class="truncate">{{ submission.link || 'Buka video' }}</span>
              </a>
            </div>

            <div class="rounded-lg border border-white/[.08] bg-black/20 p-3">
              <div v-if="reviewDrafts[submission.id]" class="grid gap-3 sm:grid-cols-2">
                <label>
                  <span class="text-xs font-medium text-white/38">Views Valid</span>
                  <input v-model.number="reviewDrafts[submission.id].views" min="0" type="number" class="form-control form-number" />
                </label>
                <label>
                  <span class="text-xs font-medium text-white/38">Payout Estimasi</span>
                  <input v-model.number="reviewDrafts[submission.id].estimated_payout" min="0" type="number" class="form-control form-number" />
                </label>
              </div>
              <div class="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
                <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-400/12 px-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/18 disabled:opacity-50" type="button" :disabled="savingId === submission.id" @click="updateSubmissionStatus(submission, 'approved')">
                  <CheckIcon class="h-4 w-4" />
                  Approve
                </button>
                <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-400/12 px-3 text-sm font-semibold text-red-100 transition hover:bg-red-400/18 disabled:opacity-50" type="button" :disabled="savingId === submission.id" @click="updateSubmissionStatus(submission, 'rejected')">
                  <XMarkIcon class="h-4 w-4" />
                  Reject
                </button>
                <button class="grid h-10 w-10 place-items-center rounded-lg bg-white/[.055] text-white/50 transition hover:bg-white/[.085] hover:text-white" type="button" @click="openDeleteModal(submission)" aria-label="Hapus submission">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      <div v-if="submissionToDelete" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeDeleteModal">
        <section class="w-full max-w-md rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]">
          <div class="flex items-start justify-between gap-4">
            <div class="flex gap-4">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-100">
                <ExclamationTriangleIcon class="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <h2 class="text-base font-semibold text-white/90">Hapus submission?</h2>
                <p class="mt-2 text-sm leading-6 text-white/46">Submission ini akan dihapus dari database dan tidak tampil lagi di antrian review.</p>
              </div>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" @click="closeDeleteModal">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 rounded-lg border border-white/[.08] bg-white/[.03] p-4">
            <div class="text-sm font-semibold text-white/86">{{ submissionToDelete.campaign || submissionToDelete.caption || '-' }}</div>
            <div class="mt-1 text-xs text-white/38">{{ submissionToDelete.account || '-' }} · {{ submissionToDelete.submitted_at || '-' }}</div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button class="h-10 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" :disabled="deleting" @click="closeDeleteModal">Batal</button>
            <button class="h-10 rounded-lg bg-red-500/85 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60" type="button" :disabled="deleting" @click="confirmDeleteSubmission">
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
