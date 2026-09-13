<script setup>
import { computed, onMounted, ref } from 'vue'
import { CheckCircleIcon, ClockIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const sending = ref(false)
const sent = ref(false)
const error = ref('')
const showForm = ref(false)
const form = ref({
  subject: '',
  category: 'Payment / Withdraw',
  message: '',
})

const tickets = computed(() => store.tickets)
const canSubmit = computed(() => form.value.subject.trim() && form.value.message.trim() && !sending.value)

const statusClass = (status) => status === 'resolved'
  ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'
  : 'border-amber-300/25 bg-amber-400/10 text-amber-100'

const openForm = () => {
  sent.value = false
  error.value = ''
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  error.value = ''
}

const submitTicket = async () => {
  if (!canSubmit.value) return

  sending.value = true
  sent.value = false
  error.value = ''

  try {
    await store.contactAdmin({
      subject: `[${form.value.category}] ${form.value.subject.trim()}`,
      message: form.value.message.trim(),
    })
    sent.value = true
    showForm.value = false
    form.value.subject = ''
    form.value.message = ''
  } catch (err) {
    error.value = 'Pesan belum bisa dikirim. Coba lagi sebentar lagi.'
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  store.loadTickets()
})
</script>

<template>
  <AppShell>
    <section class="w-full pb-24">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-3xl font-black">Hubungi Admin</h1>
          <p class="mt-2 text-white/50">Pantau status tiket atau buat tiket baru untuk bantuan admin.</p>
        </div>
        <button class="btn-blue inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold" type="button" @click="openForm">
          <PlusIcon class="h-4 w-4" />
          Buat Tiket
        </button>
      </div>

      <div v-if="sent" class="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-100">
        Tiket terkirim dan sedang diproses admin.
      </div>

      <div class="mt-7">
        <h2 class="text-base font-semibold text-white/86">List Tiket</h2>
        <div class="mt-4 grid gap-3">
          <div v-if="!tickets.length" class="grid h-32 place-items-center rounded-lg border border-dashed border-white/10 bg-white/[.025] text-sm text-white/38">
            Belum ada tiket.
          </div>

          <article v-for="ticket in tickets" :key="ticket.id" class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold" :class="statusClass(ticket.status)">
                    <CheckCircleIcon v-if="ticket.status === 'resolved'" class="h-4 w-4" />
                    <ClockIcon v-else class="h-4 w-4" />
                    {{ ticket.status_label }}
                  </span>
                  <span class="text-xs text-white/34">{{ ticket.created_at || '-' }}</span>
                </div>
                <h3 class="mt-3 text-sm font-semibold text-white/88">{{ ticket.subject }}</h3>
                <p class="mt-2 text-sm leading-6 text-white/48">{{ ticket.message }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Teleport to="body">
        <div
          v-if="showForm"
          class="fixed inset-0 grid place-items-center bg-black/72 px-4 backdrop-blur-sm"
          style="z-index: 2147483647;"
          @click.self="closeForm"
        >
          <form
            class="w-full max-w-xl rounded-lg border border-white/10 p-6 text-white shadow-2xl"
            style="background: linear-gradient(145deg, #17141f 0%, #111113 54%, #141827 100%);"
            @submit.prevent="submitTicket"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-semibold text-white/90">Buat Tiket Baru</h2>
                <p class="mt-1 text-sm text-white/42">Isi detail kendala supaya admin bisa cek lebih cepat.</p>
              </div>
              <button class="grid h-9 w-9 place-items-center rounded-lg bg-[#242428] text-white/55 transition hover:bg-[#2d2d33] hover:text-white" type="button" @click="closeForm" aria-label="Tutup form">
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>

            <div v-if="error" class="mt-5 rounded-lg border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-100">
              {{ error }}
            </div>

            <div class="mt-6 grid gap-4">
              <label class="block">
                <span class="text-xs font-medium text-white/44">Subjek</span>
                <input v-model="form.subject" required class="form-control" placeholder="Contoh: Withdraw belum masuk" />
              </label>
              <label class="block">
                <span class="text-xs font-medium text-white/44">Kategori</span>
                <select v-model="form.category" class="form-control">
                  <option class="bg-black">Payment / Withdraw</option>
                  <option class="bg-black">Peninjauan akun</option>
                  <option class="bg-black">Campaign</option>
                  <option class="bg-black">Lainnya</option>
                </select>
              </label>
              <label class="block">
                <span class="text-xs font-medium text-white/44">Pesan</span>
                <textarea v-model="form.message" required class="mt-2 min-h-36 w-full resize-y rounded-lg border border-white/10 bg-white/[.045] px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-purple-400" placeholder="Tulis detail kendalanya."></textarea>
              </label>
              <div class="flex justify-end gap-3">
                <button class="h-11 rounded-lg bg-[#242428] px-5 text-sm font-semibold text-white/70 transition hover:bg-[#2d2d33]" type="button" @click="closeForm">
                  Batal
                </button>
                <button class="btn-blue h-11 rounded-lg px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-55" type="submit" :disabled="!canSubmit">
                  {{ sending ? 'Mengirim...' : 'Kirim ke Admin' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Teleport>
    </section>
  </AppShell>
</template>
