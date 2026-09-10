<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import LogoMark from '../components/LogoMark.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const mode = ref('owner')
const selectedBrandId = ref(null)
const selectedOwnerId = ref(null)
const brandSearch = ref('')
const ownerSearch = ref('')
const brandDropdownOpen = ref(false)
const ownerDropdownOpen = ref(false)
const generatedCredentials = ref(null)

const onboarding = computed(() => store.onboarding)
const brands = computed(() => onboarding.value?.brands || [])
const activeBrand = computed(() => onboarding.value?.active_brand || null)
const owners = computed(() => onboarding.value?.owners || [])
const hasManyBrands = computed(() => brands.value.length > 1)
const filterOptions = (items, keyword) => {
  const term = keyword.trim().toLowerCase()

  if (!term) return items

  return items.filter((item) => `${item.name} ${item.handle}`.toLowerCase().includes(term))
}
const filteredBrands = computed(() => filterOptions(brands.value, brandSearch.value))
const filteredOwners = computed(() => filterOptions(owners.value, ownerSearch.value))
const selectedBrand = computed(() => brands.value.find((brand) => brand.id === selectedBrandId.value) || null)
const selectedOwner = computed(() => owners.value.find((owner) => owner.id === selectedOwnerId.value) || null)
const canSubmit = computed(() => {
  if (!activeBrand.value) return false
  if (mode.value === 'member') return Boolean(selectedOwnerId.value)

  return true
})

const load = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await store.loadOnboarding()
    selectedBrandId.value = data.active_brand?.id || data.brands[0]?.id || null
  } catch (exception) {
    error.value = axios.isAxiosError(exception)
      ? exception.response?.data?.message || 'Gagal memuat onboarding.'
      : 'Gagal memuat onboarding.'
  } finally {
    loading.value = false
  }
}

const selectBrand = (id) => {
  selectedBrandId.value = id
  brandDropdownOpen.value = false
  brandSearch.value = ''
}

const selectOwner = (id) => {
  selectedOwnerId.value = id
  ownerDropdownOpen.value = false
  ownerSearch.value = ''
}

const chooseBrand = async () => {
  if (!selectedBrandId.value) return
  saving.value = true
  error.value = ''

  try {
    await store.joinOnboardingBrand(Number(selectedBrandId.value))
  } catch (exception) {
    error.value = axios.isAxiosError(exception)
      ? exception.response?.data?.message || 'Gagal menghubungkan brand.'
      : 'Gagal menghubungkan brand.'
  } finally {
    saving.value = false
  }
}

const complete = async () => {
  if (!canSubmit.value) return
  saving.value = true
  error.value = ''

  try {
    const response = await store.completeOnboarding({
      mode: mode.value,
      owner_user_id: mode.value === 'member' ? Number(selectedOwnerId.value) : undefined,
    })

    if (response.logout) {
      generatedCredentials.value = response.credentials
      return
    }

    router.push('/dashboard')
  } catch (exception) {
    const errors = axios.isAxiosError(exception) ? exception.response?.data?.errors : null
    error.value = errors
      ? Object.values(errors).flat().join(' ')
      : axios.isAxiosError(exception)
        ? exception.response?.data?.message || 'Gagal menyelesaikan onboarding.'
        : 'Gagal menyelesaikan onboarding.'
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-10 text-white">
    <section class="w-full max-w-[760px]">
      <LogoMark />

      <div class="mt-10 rounded-lg border border-white/10 bg-white/[.028] p-6 md:p-8">
        <template v-if="generatedCredentials">
          <p class="text-sm font-medium text-emerald-100/72">Akun berhasil digabungkan</p>
          <h1 class="mt-3 text-[30px] font-semibold leading-tight tracking-[-.03em]">Data login kamu</h1>
          <p class="mt-4 text-sm leading-6 text-white/48">Pakai handle dan password ini kalau ingin masuk lagi.</p>

          <div class="mt-7 grid gap-3">
            <div class="rounded-lg border border-white/10 bg-black/24 p-4">
              <div class="text-xs font-medium text-white/38">Email atau handle</div>
              <div class="mt-2 text-base font-semibold text-white/88">{{ generatedCredentials.identifier }}</div>
            </div>
            <div class="rounded-lg border border-white/10 bg-black/24 p-4">
              <div class="text-xs font-medium text-white/38">Password</div>
              <div class="mt-2 text-base font-semibold text-white/88">{{ generatedCredentials.password }}</div>
            </div>
          </div>

          <RouterLink to="/auth" class="mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand text-sm font-semibold text-white">
            Ke Halaman Login
          </RouterLink>
        </template>

        <template v-else>
          <p class="text-sm font-medium text-white/42">Setup akun</p>
          <h1 class="mt-3 text-[30px] font-semibold leading-tight tracking-[-.03em]">Hubungkan akun kamu</h1>

          <div v-if="loading" class="mt-8 text-sm text-white/48">Memuat data...</div>

          <template v-else>
            <div class="mt-8">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <h2 class="text-base font-semibold text-white/86">Brand</h2>
                  <p class="mt-1 text-sm text-white/42">
                    {{ activeBrand ? `${activeBrand.name} - ${activeBrand.handle}` : 'Pilih brand untuk akun ini.' }}
                  </p>
                </div>
                <span v-if="activeBrand" class="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100/82">Terhubung</span>
              </div>

              <div v-if="!activeBrand" class="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <div v-if="hasManyBrands" class="relative">
                  <button class="flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/30 px-4 text-left text-sm text-white outline-none transition hover:border-purple-400/35" type="button" @click="brandDropdownOpen = !brandDropdownOpen">
                    <span class="truncate">{{ selectedBrand ? `${selectedBrand.name} - ${selectedBrand.handle}` : 'Pilih brand' }}</span>
                    <ChevronDownIcon class="h-4 w-4 shrink-0 text-white/48" />
                  </button>

                  <div v-if="brandDropdownOpen" class="absolute left-0 right-0 top-14 z-30 rounded-lg border border-white/10 bg-[#111113] p-2 shadow-[0_18px_42px_rgba(0,0,0,.38)]">
                    <div class="relative">
                      <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                      <input v-model="brandSearch" class="h-10 w-full rounded-md border border-white/10 bg-black/30 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="Cari brand..." />
                    </div>

                    <div class="mt-2 max-h-52 overflow-y-auto">
                      <button v-for="brand in filteredBrands" :key="brand.id" class="flex h-10 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-sm text-white/78 transition hover:bg-white/[.065] hover:text-white" type="button" @click="selectBrand(brand.id)">
                        <span class="truncate">{{ brand.name }} - {{ brand.handle }}</span>
                        <CheckIcon v-if="selectedBrandId === brand.id" class="h-4 w-4 shrink-0 text-purple-200" />
                      </button>
                      <div v-if="!filteredBrands.length" class="px-3 py-4 text-sm text-white/38">Brand tidak ditemukan.</div>
                    </div>
                  </div>
                </div>
                <button class="h-12 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-5 text-sm font-semibold text-white disabled:opacity-55" type="button" :disabled="saving || !selectedBrandId" @click="chooseBrand">
                  {{ saving ? 'Menghubungkan...' : 'Gabung Brand' }}
                </button>
              </div>
            </div>

            <div class="mt-8 border-t border-white/10 pt-7">
              <h2 class="text-base font-semibold text-white/86">Akun ini dipakai sebagai apa?</h2>
              <div class="mt-4 grid gap-3 md:grid-cols-2">
                <button class="rounded-lg border p-4 text-left transition" :class="mode === 'owner' ? 'border-purple-400/50 bg-purple-500/12' : 'border-white/10 bg-white/[.025] hover:bg-white/[.045]'" type="button" @click="mode = 'owner'">
                  <span class="block text-sm font-semibold text-white/86">Saya kelola sendiri</span>
                  <span class="mt-2 block text-xs leading-5 text-white/42">Pilih ini kalau kamu mau login sendiri, upload sendiri, dan mengelola akun ini sendiri.</span>
                </button>
                <button class="rounded-lg border p-4 text-left transition" :class="mode === 'member' ? 'border-purple-400/50 bg-purple-500/12' : 'border-white/10 bg-white/[.025] hover:bg-white/[.045]'" type="button" @click="mode = 'member'">
                  <span class="block text-sm font-semibold text-white/86">Masuk ke akun creator lain</span>
                  <span class="mt-2 block text-xs leading-5 text-white/42">Pilih ini kalau akun kamu akan masuk ke pengelolaan creator yang sudah ada.</span>
                </button>
              </div>

              <label v-if="mode === 'member'" class="mt-5 block">
                <span class="text-xs font-medium text-white/44">Pilih creator yang akan mengelola akun ini</span>
                <div class="relative mt-3">
                  <button class="flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/30 px-4 text-left text-sm text-white outline-none transition hover:border-purple-400/35" type="button" @click="ownerDropdownOpen = !ownerDropdownOpen">
                    <span class="truncate">{{ selectedOwner ? `${selectedOwner.name} - ${selectedOwner.handle}` : 'Pilih creator owner' }}</span>
                    <ChevronDownIcon class="h-4 w-4 shrink-0 text-white/48" />
                  </button>

                  <div v-if="ownerDropdownOpen" class="absolute left-0 right-0 top-14 z-30 rounded-lg border border-white/10 bg-[#111113] p-2 shadow-[0_18px_42px_rgba(0,0,0,.38)]">
                    <div class="relative">
                      <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                      <input v-model="ownerSearch" class="h-10 w-full rounded-md border border-white/10 bg-black/30 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/25" placeholder="Cari nama atau handle..." />
                    </div>

                    <div class="mt-2 max-h-52 overflow-y-auto">
                      <button v-for="owner in filteredOwners" :key="owner.id" class="flex h-10 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-sm text-white/78 transition hover:bg-white/[.065] hover:text-white" type="button" @click="selectOwner(owner.id)">
                        <span class="truncate">{{ owner.name }} - {{ owner.handle }}</span>
                        <CheckIcon v-if="selectedOwnerId === owner.id" class="h-4 w-4 shrink-0 text-purple-200" />
                      </button>
                      <div v-if="!filteredOwners.length" class="px-3 py-4 text-sm text-white/38">Owner tidak ditemukan.</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <p v-if="error" class="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</p>

            <button class="mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand text-sm font-semibold text-white disabled:opacity-55" type="button" :disabled="saving || !canSubmit" @click="complete">
              {{ saving ? 'Menyimpan...' : 'Selanjutnya' }}
            </button>
          </template>
        </template>
      </div>
    </section>
  </main>
</template>
