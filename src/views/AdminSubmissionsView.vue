<script setup>
import { computed, onMounted, ref } from 'vue'
import { Bars3Icon, CheckIcon, ExclamationTriangleIcon, Squares2X2Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const submissions = computed(() => store.adminSubmissions)
const viewMode = ref('card')
const deleting = ref(false)
const submissionToDelete = ref(null)

const updateSubmissionStatus = async (submission, status) => {
  await store.updateAdminSubmission(submission.id, { status })
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

onMounted(() => store.loadAdminSubmissions())
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Review Submission</h1>
          <p class="mt-2 text-sm text-white/45">Validasi link video, status review, dan akun creator.</p>
        </div>
        <div class="grid h-10 grid-cols-2 rounded-lg border border-white/10 bg-white/[.035] p-1">
          <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'card' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'card'" aria-label="Card view">
            <Squares2X2Icon class="h-4 w-4" />
          </button>
          <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'list'" aria-label="List view">
            <Bars3Icon class="h-4 w-4" />
          </button>
        </div>
      </div>

      <section v-if="viewMode === 'card'" class="mt-6 grid gap-4 lg:grid-cols-2">
        <article v-for="submission in submissions" :key="submission.id" class="dark-card rounded-lg p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-base font-semibold text-white/88">{{ submission.caption || '-' }}</h2>
              <p class="mt-1 text-xs text-white/38">{{ submission.account || '-' }} · {{ submission.submitted_at || '-' }}</p>
            </div>
            <span class="rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-100/82">{{ submission.status || 'Review' }}</span>
          </div>
          <div class="mt-5 flex items-center justify-between gap-3">
            <a :href="submission.link" target="_blank" rel="noreferrer" class="text-sm font-medium text-purple-300">Buka video</a>
            <div class="flex gap-2">
              <button class="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400/10 text-emerald-100/82 transition hover:bg-emerald-400/16" type="button" @click="updateSubmissionStatus(submission, 'approved')">
                <CheckIcon class="h-4 w-4" />
              </button>
              <button class="grid h-9 w-9 place-items-center rounded-lg bg-red-400/10 text-red-100/82 transition hover:bg-red-400/16" type="button" @click="updateSubmissionStatus(submission, 'rejected')">
                <XMarkIcon class="h-4 w-4" />
              </button>
              <button class="h-9 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/70 hover:bg-white/[.085]" type="button" @click="openDeleteModal(submission)">Hapus</button>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="mt-6 overflow-x-auto">
        <div class="min-w-[860px]">
          <table class="w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">Tanggal Submit</th>
                <th class="px-4 pb-1 font-medium">Caption</th>
                <th class="px-4 pb-1 font-medium">Akun</th>
                <th class="px-4 pb-1 font-medium">Tipe</th>
                <th class="px-4 pb-1 font-medium">Status</th>
                <th class="px-4 pb-1 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="submission in submissions" :key="submission.id" class="group text-white/68">
                <td class="whitespace-nowrap rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ submission.submitted_at || '-' }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="max-w-[300px] truncate text-sm font-semibold text-white/86">{{ submission.caption || '-' }}</div>
                  <a :href="submission.link" target="_blank" rel="noreferrer" class="mt-1 inline-flex text-[11px] text-purple-300">Buka video</a>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ submission.account || '-' }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ submission.type || '-' }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <span class="rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-100/82">{{ submission.status || 'Review' }}</span>
                </td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex gap-2">
                    <button class="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-100/82 transition hover:bg-emerald-400/16" type="button" @click="updateSubmissionStatus(submission, 'approved')">
                      <CheckIcon class="h-4 w-4" />
                    </button>
                    <button class="grid h-8 w-8 place-items-center rounded-lg bg-red-400/10 text-red-100/82 transition hover:bg-red-400/16" type="button" @click="updateSubmissionStatus(submission, 'rejected')">
                      <XMarkIcon class="h-4 w-4" />
                    </button>
                    <button class="h-8 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/70 hover:bg-white/[.085]" type="button" @click="openDeleteModal(submission)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
            <div class="text-sm font-semibold text-white/86">{{ submissionToDelete.caption || '-' }}</div>
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
