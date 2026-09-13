<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore, type SupportTicket } from '../stores/clipper'

const store = useClipperStore()
const statusFilter = ref<'all' | 'processing' | 'resolved'>('all')
const query = ref('')
const savingId = ref<number | null>(null)
const loading = ref(true)
const selectedTicket = ref<SupportTicket | null>(null)

const tickets = computed(() => store.adminTickets)
const filteredTickets = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  return tickets.value.filter((ticket) => {
    const matchesStatus = statusFilter.value === 'all' || ticket.status === statusFilter.value
    const text = [
      ticket.subject,
      ticket.message,
      ticket.creator,
      ticket.creator_handle,
      ticket.creator_email,
    ].join(' ').toLowerCase()

    return matchesStatus && (!keyword || text.includes(keyword))
  })
})
const stats = computed(() => ({
  total: tickets.value.length,
  processing: tickets.value.filter((ticket) => ticket.status === 'processing').length,
  resolved: tickets.value.filter((ticket) => ticket.status === 'resolved').length,
}))

const statusOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Proses', value: 'processing' },
  { label: 'Selesai', value: 'resolved' },
] as const

const statusClass = (status: string) => status === 'resolved'
  ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'
  : 'border-amber-300/25 bg-amber-400/10 text-amber-100'

const statusCount = (status: string) => {
  if (status === 'processing') return stats.value.processing
  if (status === 'resolved') return stats.value.resolved
  return stats.value.total
}

const updateStatus = async (ticket: SupportTicket, status: 'processing' | 'resolved') => {
  savingId.value = ticket.id

  try {
    await store.updateAdminTicket(ticket.id, { status })
    // Sync selectedTicket dari store setelah update
    if (selectedTicket.value?.id === ticket.id) {
      selectedTicket.value = store.adminTickets.find((t) => t.id === ticket.id) ?? null
    }
  } finally {
    savingId.value = null
  }
}

const openDetail = (ticket: SupportTicket) => {
  selectedTicket.value = ticket
}

const closeDetail = () => {
  selectedTicket.value = null
}

onMounted(async () => {
  try {
    await store.loadAdminTickets()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px] pb-24">
      <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="max-w-2xl">
            <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Log Tiket</h1>
            <p class="mt-2 text-sm text-white/45">Pantau pesan creator dan ubah status penanganannya.</p>
          </div>
          <div class="inline-flex h-10 items-center gap-2 rounded-lg border border-purple-300/20 bg-purple-500/10 px-3 text-sm font-semibold text-purple-100/82">
            <ChatBubbleLeftRightIcon class="h-4 w-4" />
            Support
          </div>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-3">
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Total Tiket</div>
            <div class="mt-2 text-2xl font-semibold text-white/88">{{ stats.total }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Sedang Diproses</div>
            <div class="mt-2 text-2xl font-semibold text-amber-100">{{ stats.processing }}</div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/38">Terselesaikan</div>
            <div class="mt-2 text-2xl font-semibold text-emerald-100">{{ stats.resolved }}</div>
          </div>
        </div>
      </section>

      <section class="mt-6 rounded-lg border border-white/[.08] bg-white/[.025] p-4">
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex h-10 w-full min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3.5 md:w-[380px] xl:w-[460px]">
            <MagnifyingGlassIcon class="h-4 w-4 shrink-0 text-white/42" />
            <input v-model="query" class="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Cari tiket, creator, atau email..." />
            <button v-if="query" class="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md text-white/38 transition hover:bg-white/[.055] hover:text-white" type="button" aria-label="Hapus pencarian" @click="query = ''">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </label>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in statusOptions"
              :key="option.value"
              class="h-10 rounded-lg px-4 text-sm font-semibold transition"
              :class="statusFilter === option.value ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white shadow-blue' : 'bg-white/[.055] text-white/58 hover:bg-white/[.085] hover:text-white'"
              type="button"
              @click="statusFilter = option.value"
            >
              {{ option.label }} {{ statusCount(option.value) }}
            </button>
          </div>
        </div>
      </section>

      <section class="mt-5">
        <div v-if="loading" class="grid h-28 place-items-center rounded-lg border border-white/[.08] bg-white/[.025] text-sm text-white/40">
          Memuat tiket...
        </div>
        <div v-else-if="!filteredTickets.length" class="grid h-28 place-items-center rounded-lg border border-dashed border-white/[.1] bg-white/[.02] text-sm text-white/38">
          Belum ada tiket yang cocok.
        </div>

        <div v-else class="overflow-x-auto rounded-lg border border-white/[.08] bg-white/[.025] p-3">
          <table class="w-full min-w-[1040px] border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">Tiket</th>
                <th class="px-4 pb-1 font-medium">Creator</th>
                <th class="px-4 pb-1 font-medium">Status</th>
                <th class="px-4 pb-1 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in filteredTickets" :key="ticket.id" class="group text-white/68">
                <td class="rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="max-w-[460px]">
                    <div class="truncate font-semibold text-white/86">{{ ticket.subject }}</div>
                    <div class="mt-1 line-clamp-2 text-xs leading-5 text-white/42">{{ ticket.message }}</div>
                    <div class="mt-1 text-[11px] text-white/30">{{ ticket.created_at || '-' }}</div>
                  </div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="font-semibold text-white/82">{{ ticket.creator || '-' }}</div>
                  <div class="mt-1 text-xs text-white/38">{{ ticket.creator_handle || '-' }}</div>
                  <div class="mt-0.5 text-xs text-white/30">{{ ticket.creator_email || '-' }}</div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <span class="inline-flex whitespace-nowrap items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold" :class="statusClass(ticket.status)">
                    <CheckCircleIcon v-if="ticket.status === 'resolved'" class="h-3.5 w-3.5" />
                    <ClockIcon v-else class="h-3.5 w-3.5" />
                    {{ ticket.status_label }}
                  </span>
                </td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex flex-col items-end gap-1.5">
                    <button class="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/72 transition hover:bg-white/[.085] hover:text-white" type="button" @click="openDetail(ticket)">
                      <ChatBubbleLeftRightIcon class="h-3.5 w-3.5" />
                      Detail
                    </button>
                    <div class="flex gap-1.5">
                      <button class="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-amber-100 transition hover:bg-white/[.085] disabled:cursor-not-allowed disabled:opacity-40" type="button" :disabled="savingId === ticket.id || ticket.status === 'processing'" @click="updateStatus(ticket, 'processing')">
                        <ClockIcon class="h-3.5 w-3.5" />
                        Proses
                      </button>
                      <button class="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-emerald-100 transition hover:bg-white/[.085] disabled:cursor-not-allowed disabled:opacity-40" type="button" :disabled="savingId === ticket.id || ticket.status === 'resolved'" @click="updateStatus(ticket, 'resolved')">
                        <CheckCircleIcon class="h-3.5 w-3.5" />
                        Selesai
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-if="selectedTicket" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeDetail">
        <section class="w-full max-w-2xl rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold" :class="statusClass(selectedTicket.status)">
                  <CheckCircleIcon v-if="selectedTicket.status === 'resolved'" class="h-3.5 w-3.5" />
                  <ClockIcon v-else class="h-3.5 w-3.5" />
                  {{ selectedTicket.status_label }}
                </span>
                <span class="text-xs text-white/34">{{ selectedTicket.created_at || '-' }}</span>
              </div>
              <h2 class="mt-3 text-lg font-semibold text-white/90">{{ selectedTicket.subject }}</h2>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" aria-label="Tutup detail" @click="closeDetail">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/34">Creator</div>
            <div class="mt-1 text-sm font-semibold text-white/84">{{ selectedTicket.creator || '-' }}</div>
            <div class="mt-1 text-xs text-white/38">{{ selectedTicket.creator_handle || '-' }} · {{ selectedTicket.creator_email || '-' }}</div>
          </div>

          <div class="mt-3 rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="text-xs font-medium text-white/34">Pesan</div>
            <p class="mt-2 whitespace-pre-line text-sm leading-6 text-white/62">{{ selectedTicket.message }}</p>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button class="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-amber-100 transition hover:bg-white/[.085] disabled:cursor-not-allowed disabled:opacity-40" type="button" :disabled="savingId === selectedTicket.id || selectedTicket.status === 'processing'" @click="updateStatus(selectedTicket, 'processing')">
              <ClockIcon class="h-3.5 w-3.5" />
              Proses
            </button>
            <button class="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-emerald-100 transition hover:bg-white/[.085] disabled:cursor-not-allowed disabled:opacity-40" type="button" :disabled="savingId === selectedTicket.id || selectedTicket.status === 'resolved'" @click="updateStatus(selectedTicket, 'resolved')">
              <CheckCircleIcon class="h-3.5 w-3.5" />
              Selesai
            </button>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
