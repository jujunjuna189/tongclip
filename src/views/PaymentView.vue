<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  BanknotesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CreditCardIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const withdrawAmount = ref(null)
const submitting = ref(false)
const savingBank = ref(false)
const editingBank = ref(false)
const activeTab = ref('income')
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
const withdrawals = computed(() => store.withdrawals)
const incomeFilters = ['all', 'valid', 'review']
const filteredIncomes = computed(() => incomes.value.filter((item) => {
  if (incomeFilter.value === 'all') return true
  return String(item.status || '').toLowerCase() === incomeFilter.value
}))
const withdrawableBalance = computed(() => store.withdrawableBalance)
const selectedAccount = computed(() => store.selectedAccount)
const isWithdrawOpen = computed(() => {
  const day = new Date().getDate()
  return day === 15 || day === 16
})
const bankInfo = computed(() => {
  if (!selectedAccount.value?.bank_name && !store.user?.bank_name) return 'Rekening belum diatur'
  return [
    selectedAccount.value?.bank_name || store.user?.bank_name,
    selectedAccount.value?.bank_account_number || store.user?.bank_account_number,
  ].filter(Boolean).join(' ')
})
const bankAccountName = computed(() => selectedAccount.value?.bank_account_name || store.user?.bank_account_name || '-')

const withdrawalStatusClass = (status) => {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'paid' || normalized === 'approved') return 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100'
  if (normalized === 'rejected') return 'border-red-300/25 bg-red-400/10 text-red-100'
  return 'border-amber-300/25 bg-amber-400/10 text-amber-100'
}

const syncBankForm = () => {
  bankForm.value = {
    bank_name: selectedAccount.value?.bank_name || store.user?.bank_name || '',
    bank_account_number: selectedAccount.value?.bank_account_number || store.user?.bank_account_number || '',
    bank_account_name: selectedAccount.value?.bank_account_name || store.user?.bank_account_name || '',
  }
}

const openBankModal = () => {
  bankMessage.value = ''
  bankError.value = ''
  syncBankForm()
  editingBank.value = true
}

const closeBankModal = () => {
  if (savingBank.value) return
  editingBank.value = false
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
    await store.updateProfile({
      ...bankForm.value,
      social_account_id: store.selectedSocialAccountId,
    })
    await store.loadMe()
    syncBankForm()
    bankMessage.value = 'Rekening pencairan berhasil diperbarui.'
    editingBank.value = false
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

  if (!withdrawAmount.value || withdrawAmount.value < 1) {
    error.value = 'Nominal pencairan wajib diisi.'
    return
  }

  submitting.value = true

  try {
    await store.requestWithdrawal({
      amount: Number(withdrawAmount.value),
      social_account_id: store.selectedSocialAccountId,
    })
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
  await store.loadDashboard()
  await store.loadIncomes()
  await store.loadWithdrawals()
  syncBankForm()
})

watch(() => store.selectedAccountId, async () => {
  await store.loadWithdrawals()
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
              {{ isWithdrawOpen ? 'Sedang dibuka' : 'Buka tgl 15 & 16' }}
            </div>
          </div>
        </div>
      </section>

      <section class="mt-4 rounded-lg border border-white/[.08] bg-white/[.025] p-4 md:p-5">
        <div class="grid gap-3">
          <div class="grid gap-3 lg:grid-cols-2">
            <div class="rounded-lg border border-emerald-300/15 bg-emerald-400/10 px-4 py-3">
              <div class="flex items-center gap-2 text-sm font-medium text-emerald-100/70">
                <BanknotesIcon class="h-5 w-5" />
                Saldo bisa dicairkan
              </div>
              <div class="mt-1.5 text-[26px] font-semibold leading-none tracking-[-.035em] text-emerald-100 md:text-[30px]">{{ withdrawableBalance }}</div>
              <p class="mt-2 text-xs text-emerald-100/45">{{ isWithdrawOpen ? 'Pencairan sedang dibuka, ajukan sekarang.' : 'Pencairan dibuka tiap tgl 15 & 16.' }}</p>
            </div>

            <div class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3">
              <div class="flex min-h-[62px] items-center justify-between gap-3">
                <div class="flex min-w-0 gap-3">
                  <CreditCardIcon class="mt-0.5 h-5 w-5 shrink-0 text-white/42" />
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-white/82">Rekening Pencairan</div>
                    <div class="mt-1 truncate text-sm font-semibold text-white/72">{{ bankInfo }}</div>
                    <div class="mt-0.5 truncate text-xs text-white/36">a/n {{ bankAccountName }}</div>
                  </div>
                </div>
                <button class="h-9 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/68 transition hover:bg-white/[.085] hover:text-white" type="button" @click="openBankModal">
                  Update
                </button>
              </div>
            </div>
          </div>

          <form class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3" @submit.prevent="submitWithdrawal">
            <div class="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
              <label class="block">
                <span class="text-xs font-medium text-white/42">Nominal Pengajuan</span>
                <input v-model.number="withdrawAmount" min="1" type="number" class="form-control form-number" placeholder="10000" />
              </label>
              <button
                class="h-11 rounded-lg px-6 text-sm font-semibold transition lg:min-w-48"
                :class="isWithdrawOpen ? 'btn-blue' : 'cursor-not-allowed border border-white/10 bg-white/[.045] text-white/36'"
                :disabled="!isWithdrawOpen || submitting"
                type="submit"
              >
                {{ submitting ? 'Mengirim...' : isWithdrawOpen ? 'Ajukan' : 'Belum dibuka' }}
              </button>
            </div>
            <div class="mt-2 min-h-5">
              <p v-if="message" class="text-sm font-medium text-emerald-200">{{ message }}</p>
              <p v-if="error" class="text-sm font-medium text-red-200">{{ error }}</p>
            </div>
          </form>
        </div>
      </section>

      <div class="mt-4 grid h-11 grid-cols-2 rounded-lg border border-white/10 bg-black/20 p-1 sm:w-[420px]">
        <button class="rounded-md text-sm font-semibold transition" :class="activeTab === 'income' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="activeTab = 'income'">
          Riwayat Pendapatan
        </button>
        <button class="rounded-md text-sm font-semibold transition" :class="activeTab === 'withdrawal' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="activeTab = 'withdrawal'">
          Riwayat Pengajuan
        </button>
      </div>

      <section class="mt-3 rounded-lg border border-white/[.08] bg-white/[.025] p-4 md:p-5">
        <div v-if="activeTab === 'income'">
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
        </div>

        <div v-else>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-semibold tracking-[-.01em]">Riwayat Pengajuan</h2>
              <p class="mt-1 text-sm text-white/40">Daftar pengajuan withdraw yang sudah dikirim ke admin.</p>
            </div>
            <div class="rounded-full bg-purple-500/12 px-3 py-1 text-xs font-semibold text-purple-100">{{ withdrawals.length }} Pengajuan</div>
          </div>

          <div class="mt-4 space-y-2">
            <div v-if="!withdrawals.length" class="grid h-24 place-items-center rounded-lg border border-dashed border-white/[.1] bg-black/20 text-sm text-white/35">
              Belum ada riwayat pengajuan.
            </div>
            <div v-for="item in withdrawals" :key="item.id" class="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3">
              <div class="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-white/86">Withdraw ke {{ item.bank_name }} {{ item.bank_account_number }}</div>
                  <div class="mt-0.5 text-xs text-white/42">{{ item.date || '-' }} · a/n {{ item.bank_account_name || '-' }}</div>
                </div>
                <div class="text-sm font-semibold text-gradient-primary md:text-right">{{ item.amount }}</div>
                <span class="inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold" :class="withdrawalStatusClass(item.status)">
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div v-if="editingBank" class="fixed inset-0 z-40 grid place-items-center bg-black/72 px-4 backdrop-blur-sm" @click.self="closeBankModal">
        <form class="w-full max-w-lg rounded-lg border border-white/10 bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,.48)]" @submit.prevent="saveBankAccount">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-base font-semibold text-white/90">Update rekening</h2>
              <p class="mt-2 text-sm leading-6 text-white/46">Rekening ini dipakai untuk pengajuan pencairan saldo.</p>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/48 transition hover:bg-white/[.075] hover:text-white" type="button" aria-label="Tutup modal" @click="closeBankModal">
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 grid gap-4">
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

          <div class="mt-4 min-h-5">
            <p v-if="bankMessage" class="text-sm font-medium text-emerald-200">{{ bankMessage }}</p>
            <p v-if="bankError" class="text-sm font-medium text-red-200">{{ bankError }}</p>
          </div>

          <div class="mt-5 flex justify-end gap-3">
            <button class="h-10 rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" :disabled="savingBank" @click="closeBankModal">Batal</button>
            <button class="h-10 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-5 text-sm font-semibold text-white shadow-blue transition hover:opacity-90 disabled:opacity-60" type="submit" :disabled="savingBank">
              {{ savingBank ? 'Menyimpan...' : 'Simpan Rekening' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </AppShell>
</template>
