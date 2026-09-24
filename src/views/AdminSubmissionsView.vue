<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  ArrowTopRightOnSquareIcon,
  BriefcaseIcon,
  CheckIcon,
  ClockIcon,
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
const formatPayout = (value) => {
  const amount = Number(String(value ?? '').replace(/\D/g, '')) || 0
  return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`
}
const payoutValue = (value) => Number(String(value ?? '').replace(/\D/g, '')) || 0
const updatePayoutDraft = (submissionId, event) => {
  reviewDrafts.value[submissionId].estimated_payout = formatPayout(event.target.value)
}
const updateViewsDraft = (submission, event) => {
  const views = Math.max(0, Number(event.target.value) || 0)
  const ratePerThousandViews = Number(submission.campaign_rate_value) || 0
  const payout = Math.floor(views / 1000) * ratePerThousandViews

  reviewDrafts.value[submission.id].views = views
  reviewDrafts.value[submission.id].estimated_payout = formatPayout(payout)
}

const isLocked = (submission) => {
  const status = normalizeStatus(submission.status)
  if (status !== 'approved' && status !== 'rejected') return false
  if (!submission.reviewed_at) return false
  return (Date.now() - new Date(submission.reviewed_at).getTime()) > 24 * 60 * 60 * 1000
}
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
      estimated_payout: formatPayout(submission.estimated_payout_value ?? 0),
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
      estimated_payout: payoutValue(draft.estimated_payout),
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
          <div class="grid gap-3 xl:grid-cols-[1fr_300px]">
            <!-- Info kiri -->
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold" :class="statusClass(submission.status)">{{ statusLabel(submission.status) }}</span>
                <span class="rounded-full border border-white/10 bg-black/20 px-2.5 py-0.5 text-[11px] font-semibold text-white/40">{{ submission.type || '-' }}</span>
              </div>
              <div class="mt-3 rounded-lg border border-purple-300/15 bg-purple-500/[.055] p-3">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.12em] text-purple-100/42">
                      <BriefcaseIcon class="h-3.5 w-3.5" />
                      Campaign
                    </div>
                    <div class="mt-1 truncate text-sm font-semibold text-white/88">{{ submission.campaign || '-' }}</div>
                    <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/42">
                      <span>{{ submission.campaign_brand || '-' }}</span>
                      <span>{{ submission.campaign_category || '-' }}</span>
                      <span>{{ submission.campaign_type || submission.type || '-' }}</span>
                    </div>
                  </div>
                  <div class="grid shrink-0 gap-1 text-right text-[11px] text-white/42">
                    <span class="font-semibold text-purple-100/80">{{ submission.campaign_rate || '-' }} / 1K Views</span>
                    <span class="inline-flex items-center justify-end gap-1">
                      <ClockIcon class="h-3.5 w-3.5" />
                      {{ submission.campaign_deadline || 'Tanpa deadline' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="mt-3 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-white/42">
                <span>Creator: <span class="text-white/70">{{ submission.creator || '-' }}</span></span>
                <span>Akun: <span class="text-white/70">{{ submission.account || '-' }}</span></span>
                <span>{{ submission.submitted_at || '-' }}</span>
              </div>
              <a :href="submission.link" target="_blank" rel="noreferrer" class="mt-2.5 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-purple-300/20 bg-purple-400/10 px-2.5 py-1.5 text-xs font-semibold text-purple-100 transition hover:bg-purple-400/16">
                <ArrowTopRightOnSquareIcon class="h-3.5 w-3.5 shrink-0" />
                <span class="truncate">{{ submission.link || 'Buka video' }}</span>
              </a>
            </div>

            <!-- Panel review kanan -->
            <div class="rounded-lg border border-white/[.07] bg-black/20 p-3">
              <div v-if="reviewDrafts[submission.id]" class="grid grid-cols-2 gap-2">
                <label>
                  <span class="text-[11px] font-medium text-white/34">Views</span>
                  <input
                    :value="reviewDrafts[submission.id].views"
                    min="0"
                    type="number"
                    class="form-control form-number !h-9 !text-sm"
                    :disabled="normalizeStatus(submission.status) === 'approved' || normalizeStatus(submission.status) === 'rejected'"
                    @input="updateViewsDraft(submission, $event)"
                  />
                </label>
                <label>
                  <span class="text-[11px] font-medium text-white/34">Payout</span>
                  <input
                    :value="reviewDrafts[submission.id].estimated_payout"
                    inputmode="numeric"
                    type="text"
                    class="form-control !h-9 !text-sm"
                    :disabled="normalizeStatus(submission.status) === 'approved' || normalizeStatus(submission.status) === 'rejected'"
                    @input="updatePayoutDraft(submission.id, $event)"
                  />
                </label>
              </div>
              <div class="mt-2 flex gap-1.5">
                <template v-if="normalizeStatus(submission.status) === 'approved' || normalizeStatus(submission.status) === 'rejected'">
                  <button
                    class="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                    :class="isLocked(submission) ? 'bg-white/[.03] text-white/28' : 'bg-white/[.055] text-white/65 hover:bg-white/[.085]'"
                    type="button"
                    :disabled="savingId === submission.id || isLocked(submission)"
                    @click="updateSubmissionStatus(submission, 'review')"
                  >
                    <XMarkIcon class="h-3.5 w-3.5" />
                    {{ isLocked(submission) ? 'Terkunci' : 'Batalkan' }}
                  </button>
                </template>
                <template v-else>
                  <button class="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-400/12 px-3 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/18 disabled:opacity-50" type="button" :disabled="savingId === submission.id" @click="updateSubmissionStatus(submission, 'approved')">
                    <CheckIcon class="h-3.5 w-3.5" />
                    Approve
                  </button>
                  <button class="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-400/12 px-3 text-xs font-semibold text-red-100 transition hover:bg-red-400/18 disabled:opacity-50" type="button" :disabled="savingId === submission.id" @click="updateSubmissionStatus(submission, 'rejected')">
                    <XMarkIcon class="h-3.5 w-3.5" />
                    Reject
                  </button>
                </template>
              </div>
              <p v-if="(normalizeStatus(submission.status) === 'approved' || normalizeStatus(submission.status) === 'rejected') && !isLocked(submission)" class="mt-1.5 text-[10px] leading-4 text-white/24">
                Bisa dibatalkan dalam 24 jam setelah review.
              </p>
              <p v-if="isLocked(submission)" class="mt-1.5 text-[10px] leading-4 text-amber-300/45">
                Status sudah terkunci, tidak dapat diubah.
              </p>
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
