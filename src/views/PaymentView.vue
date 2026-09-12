<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  BanknotesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CreditCardIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const withdrawAmount = ref(null)
const submitting = ref(false)
const savingBank = ref(false)
const editingBank = ref(false)
const incomeFilter = ref('all')
const message = ref('')
const error = ref('')
const bankMessage = ref('')
const bankError = ref('')
const bankForm = ref({
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
})

const incomes = computed(() => store.incomes)
const incomeFilters = ['all', 'valid', 'review']
const filteredIncomes = computed(() => incomes.value.filter((item) => {
  if (incomeFilter.value === 'all') return true
  return String(item.status || '').toLowerCase() === incomeFilter.value
}))
const withdrawableBalance = computed(() => store.withdrawableBalance)
const selectedAccount = computed(() => store.selectedAccount)
const isWithdrawOpen = computed(() => {
  const date = new Date().getDate()
  return date === 15 || date === 16
})
const bankInfo = computed(() => {
  if (!selectedAccount.value?.bank_name && !store.user?.bank_name) return 'Rekening belum diatur'
  return [
    selectedAccount.value?.bank_name || store.user?.bank_name,
    selectedAccount.value?.bank_account_number || store.user?.bank_account_number,
  ].filter(Boolean).join(' ')
})
const bankAccountName = computed(() => selectedAccount.value?.bank_account_name || store.user?.bank_account_name || '-')

const syncBankForm = () => {
  bankForm.value = {
    bank_name: selectedAccount.value?.bank_name || store.user?.bank_name || '',
    bank_account_number: selectedAccount.value?.bank_account_number || store.user?.bank_account_number || '',
    bank_account_name: selectedAccount.value?.bank_account_name || store.user?.bank_account_name || '',
  }
}

const saveBankAccount = async () => {
  bankMessage.value = ''
  bankError.value = ''

  if (!bankForm.value.bank_name || !bankForm.value.bank_account_number || !bankForm.value.bank_account_name) {
    bankError.value = 'Nama bank, nomor rekening, dan nama pemilik wajib diisi.'
    return
  }

  savingBank.value = true

  try {
    await store.updateProfile(bankForm.value)
    await store.loadMe()
    syncBankForm()
    editingBank.value = false
    bankMessage.value = 'Rekening pencairan berhasil diperbarui.'
  } catch (requestError) {
    bankError.value = requestError?.response?.data?.message
      || Object.values(requestError?.response?.data?.errors || {})?.[0]?.[0]
      || 'Gagal memperbarui rekening pencairan.'
  } finally {
    savingBank.value = false
  }
}

const submitWithdrawal = async () => {
  message.value = ''
  error.value = ''

  if (!withdrawAmount.value || withdrawAmount.value < 50000) {
    error.value = 'Minimal pencairan Rp50.000.'
    return
  }

  submitting.value = true

  try {
    await store.requestWithdrawal({ amount: Number(withdrawAmount.value) })
    withdrawAmount.value = null
    message.value = 'Pengajuan pencairan berhasil dikirim ke admin.'
  } catch (requestError) {
    error.value = requestError?.response?.data?.message
      || Object.values(requestError?.response?.data?.errors || {})?.[0]?.[0]
      || 'Gagal mengirim pengajuan pencairan.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!store.user) await store.loadMe()
  if (!store.stats.length) await store.loadDashboard()
  await store.loadIncomes()
  syncBankForm()
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4 md:p-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="max-w-2xl">
            <h1 class="text-[22px] font-semibold leading-tight tracking-[-.025em] md:text-[26px]">Pendapatan</h1>
            <p class="mt-1 text-sm leading-6 text-white/45">Pantau saldo valid dan ajukan pencairan saat jadwal withdraw dibuka.</p>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-2.5">
            <div class="flex items-center gap-2 text-xs font-medium text-white/38">
              <CalendarDaysIcon class="h-4 w-4" />
              Jadwal Withdraw
            </div>
            <div class="mt-1 text-sm font-semibold" :class="isWithdrawOpen ? 'text-emerald-200' : 'text-white/72'">
              {{ isWithdrawOpen ? 'Sedang dibuka' : 'Tanggal 15 & 16 tiap bulan' }}
            </div>
          </div>
        </div>
      </section>

      <section class="mt-4 rounded-lg border border-white/[.08] bg-white/[.025] p-4 md:p-5">
        <div class="grid gap-3 lg:grid-cols-2">
          <div class="rounded-lg border border-emerald-300/15 bg-emerald-400/10 p-4">
            <div class="flex min-h-[82px] items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 text-sm font-medium text-emerald-100/70">
                  <BanknotesIcon class="h-5 w-5" />
                  Saldo bisa dicairkan
                </div>
                <div class="mt-2 text-[28px] font-semibold leading-none tracking-[-.035em] text-emerald-100 md:text-[32px]">{{ withdrawableBalance }}</div>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="flex min-h-[82px] items-center justify-between gap-3">
              <div class="flex min-w-0 gap-3">
                <CreditCardIcon class="mt-0.5 h-5 w-5 shrink-0 text-white/42" />
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-white/82">Rekening Pencairan</div>
                  <div class="mt-1 truncate text-sm font-semibold text-white/72">{{ bankInfo }}</div>
                  <div class="mt-0.5 truncate text-xs text-white/36">a/n {{ bankAccountName }}</div>
                </div>
              </div>
              <button class="h-9 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/68 transition hover:bg-white/[.085] hover:text-white" type="button" @click="editingBank = !editingBank">
                {{ editingBank ? 'Tutup' : 'Update' }}
              </button>
            </div>
          </div>
        </div>

        <form v-if="editingBank" class="mt-3 rounded-lg border border-white/[.08] bg-black/20 p-3" @submit.prevent="saveBankAccount">
          <div class="grid gap-3 md:grid-cols-3">
            <label class="block">
              <span class="text-xs font-medium text-white/42">Nama Bank</span>
              <input v-model="bankForm.bank_name" class="form-control" placeholder="BCA" />
            </label>
            <label class="block">
              <span class="text-xs font-medium text-white/42">Nomor Rekening</span>
              <input v-model="bankForm.bank_account_number" class="form-control" placeholder="1234567890" />
            </label>
            <label class="block">
              <span class="text-xs font-medium text-white/42">Nama Pemilik</span>
              <input v-model="bankForm.bank_account_name" class="form-control" placeholder="Nama sesuai rekening" />
            </label>
          </div>
          <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p v-if="bankMessage" class="text-sm font-medium text-emerald-200">{{ bankMessage }}</p>
              <p v-if="bankError" class="text-sm font-medium text-red-200">{{ bankError }}</p>
            </div>
            <button class="h-10 rounded-lg bg-white/[.08] px-5 text-sm font-semibold text-white/78 transition hover:bg-white/[.12] hover:text-white disabled:opacity-60" type="submit" :disabled="savingBank">
              {{ savingBank ? 'Menyimpan...' : 'Simpan Rekening' }}
            </button>
          </div>
        </form>
      </section>

      <section class="mt-4 rounded-lg border border-white/[.08] bg-white/[.025] p-4 md:p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold tracking-[-.01em]">Ajukan Pencairan</h2>
            <p class="mt-1 text-sm text-white/40">Masukkan nominal yang ingin diajukan ke admin.</p>
          </div>
        </div>
        <form class="mt-3 grid gap-3 rounded-lg border border-white/[.08] bg-black/20 p-3 lg:grid-cols-[1fr_auto]" @submit.prevent="submitWithdrawal">
          <label class="block">
            <span class="text-xs font-medium text-white/42">Nominal Pengajuan</span>
            <input v-model.number="withdrawAmount" min="50000" type="number" class="form-control form-number" placeholder="50000" />
          </label>
          <div class="flex flex-col justify-end">
            <button
              class="h-11 rounded-lg px-6 text-sm font-semibold transition lg:min-w-56"
              :class="isWithdrawOpen ? 'btn-blue' : 'cursor-not-allowed border border-white/10 bg-white/[.045] text-white/36'"
              :disabled="!isWithdrawOpen || submitting"
              type="submit"
            >
              {{ submitting ? 'Mengirim...' : isWithdrawOpen ? 'Ajukan Pencairan' : 'Withdraw dibuka tanggal 15 & 16' }}
            </button>
          </div>
          <div class="lg:col-span-2">
            <p v-if="message" class="text-sm font-medium text-emerald-200">{{ message }}</p>
            <p v-if="error" class="text-sm font-medium text-red-200">{{ error }}</p>
          </div>
        </form>
      </section>

      <section class="mt-4 rounded-lg border border-white/[.08] bg-white/[.025] p-4 md:p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold tracking-[-.01em]">Riwayat Pendapatan</h2>
            <p class="mt-1 text-sm text-white/40">Pendapatan dari submission yang sudah divalidasi.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="filter in incomeFilters"
              :key="filter"
              class="h-9 rounded-lg px-3 text-xs font-semibold capitalize transition"
              :class="incomeFilter === filter ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white shadow-blue' : 'bg-white/[.055] text-white/58 hover:bg-white/[.085] hover:text-white'"
              type="button"
              @click="incomeFilter = filter"
            >
              {{ filter === 'all' ? 'Semua' : filter }}
            </button>
          </div>
        </div>

        <div class="mt-3 space-y-2">
          <div v-if="!filteredIncomes.length" class="grid h-20 place-items-center rounded-lg border border-dashed border-white/[.1] bg-black/20 text-sm text-white/35">
            Belum ada riwayat pendapatan.
          </div>
          <div v-for="item in filteredIncomes" :key="item.id" class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3">
            <div class="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold text-white/86">{{ item.source }}</div>
                <div class="mt-0.5 text-xs text-white/42">{{ item.date }} dari {{ item.account || '-' }}</div>
              </div>
              <div class="text-sm font-semibold text-emerald-200 md:text-right">{{ item.amount }}</div>
              <span class="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/[.045] px-3 py-1 text-[11px] font-medium text-white/58">
                <CheckCircleIcon class="h-3.5 w-3.5" />
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  </AppShell>
</template>
