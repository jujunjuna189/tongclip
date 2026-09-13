<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore, type SupportTicket } from '../stores/clipper'

const store = useClipperStore()
const statusFilter = ref<'all' | 'processing' | 'resolved'>('all')
const savingId = ref<number | null>(null)

const tickets = computed(() => store.adminTickets)
const filteredTickets = computed(() => {
  if (statusFilter.value === 'all') return tickets.value
  return tickets.value.filter((ticket) => ticket.status === statusFilter.value)
})
const stats = computed(() => ({
  total: tickets.value.length,
  processing: tickets.value.filter((ticket) => ticket.status === 'processing').length,
  resolved: tickets.value.filter((ticket) => ticket.status === 'resolved').length,
}))

const statusClass = (status: string) => status === 'resolved'
  ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'
  : 'border-amber-300/25 bg-amber-400/10 text-amber-100'

const updateStatus = async (ticket: SupportTicket, status: 'processing' | 'resolved') => {
  savingId.value = ticket.id

  try {
    await store.updateAdminTicket(ticket.id, { status })
  } finally {
    savingId.value = null
  }
}

onMounted(() => {
  store.loadAdminTickets()
})
</script>

<template>
  <AppShell>
    <section class="pb-24">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[.16em] text-gradient-primary">Support</p>
          <h1 class="mt-2 text-[28px] font-semibold leading-tight tracking-[-.03em]">Log Tiket</h1>
          <p class="mt-2 text-sm text-white/45">Pantau pesan creator dan ubah status penanganannya.</p>
        </div>
        <div class="grid grid-cols-3 gap-2 rounded-lg border border-white/[.08] bg-white/[.025] p-2 text-center">
          <button class="rounded-md px-3 py-2 text-xs font-semibold transition" :class="statusFilter === 'all' ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white'" type="button" @click="statusFilter = 'all'">Semua {{ stats.total }}</button>
          <button class="rounded-md px-3 py-2 text-xs font-semibold transition" :class="statusFilter === 'processing' ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white'" type="button" @click="statusFilter = 'processing'">Proses {{ stats.processing }}</button>
          <button class="rounded-md px-3 py-2 text-xs font-semibold transition" :class="statusFilter === 'resolved' ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white'" type="button" @click="statusFilter = 'resolved'">Selesai {{ stats.resolved }}</button>
        </div>
      </div>

      <div class="mt-7 grid gap-4">
        <div v-if="!filteredTickets.length" class="grid h-40 place-items-center rounded-lg border border-dashed border-white/10 bg-white/[.025] text-sm text-white/38">
          Belum ada tiket.
        </div>

        <article v-for="ticket in filteredTickets" :key="ticket.id" class="rounded-lg border border-white/[.08] bg-white/[.025] p-5">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold" :class="statusClass(ticket.status)">
                  <CheckCircleIcon v-if="ticket.status === 'resolved'" class="h-4 w-4" />
                  <ClockIcon v-else class="h-4 w-4" />
                  {{ ticket.status_label }}
                </span>
                <span class="text-xs text-white/34">{{ ticket.created_at || '-' }}</span>
              </div>
              <h2 class="mt-3 text-base font-semibold text-white/90">{{ ticket.subject }}</h2>
              <p class="mt-2 text-sm leading-6 text-white/52">{{ ticket.message }}</p>
              <div class="mt-4 flex flex-wrap gap-2 text-xs text-white/38">
                <span>{{ ticket.creator || '-' }}</span>
                <span>{{ ticket.creator_handle || '-' }}</span>
                <span>{{ ticket.creator_email || '-' }}</span>
              </div>
            </div>

            <div class="flex shrink-0 gap-2">
              <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-400/10 px-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/16 disabled:opacity-50" type="button" :disabled="savingId === ticket.id || ticket.status === 'processing'" @click="updateStatus(ticket, 'processing')">
                <ClockIcon class="h-4 w-4" />
                Proses
              </button>
              <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-400/10 px-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/16 disabled:opacity-50" type="button" :disabled="savingId === ticket.id || ticket.status === 'resolved'" @click="updateStatus(ticket, 'resolved')">
                <CheckCircleIcon class="h-4 w-4" />
                Selesai
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </AppShell>
</template>
