<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const saving = ref(false)
const currentStep = ref(0)
const heroImagePreview = ref('')
const steps = [
  { title: 'Informasi', description: 'Campaign dan brand' },
  { title: 'Aturan', description: 'Budget dan target' },
  { title: 'Brief', description: 'Media dan arahan' },
]
const form = ref({
  title: '',
  brand: '',
  category: 'LIFESTYLE',
  type: 'CLIPPING',
  rate_per_view: 3000,
  budget_percent: 50,
  views_target: 1000,
  deadline_at: '',
  image_url: '',
  hero_image: null,
  status: 'active',
  exclusive: false,
  brief: '',
  rules: [
    'Durasi video minimal 15 detik',
    'Hook wajib muncul di 3 detik pertama',
    'Tidak boleh mengubah klaim utama brand',
  ],
  assets: [
    { title: 'Brand guideline', url: '' },
    { title: 'Referensi YouTube', url: '' },
  ],
  platforms: ['TikTok', 'IG', 'YT'],
})

const inputClass = 'form-control'
const selectClass = 'form-control form-select'
const numberClass = 'form-control form-number'
const labelClass = 'text-xs font-medium text-white/44'
const textareaClass = 'mt-2 w-full resize-y rounded-lg border border-white/[.08] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/24 focus:border-purple-400/55 focus:bg-black/30'
const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
const canContinue = computed(() => {
  if (currentStep.value === 0) {
    return Boolean(form.value.title.trim() && form.value.brand.trim() && form.value.category.trim())
  }

  if (currentStep.value === 1) {
    return form.value.rate_per_view >= 0 && form.value.budget_percent >= 0 && form.value.budget_percent <= 100 && form.value.views_target >= 0
  }

  return true
})

const cleanList = (items) => items
  .map((item) => String(item).trim())
  .filter(Boolean)

const cleanAssets = (items) => items
  .map((item) => ({
    title: String(item.title || '').trim(),
    url: String(item.url || '').trim(),
  }))
  .filter((item) => item.title || item.url)

const buildPayload = () => {
  const payload = new FormData()
  const rules = cleanList(form.value.rules)
  const assets = cleanAssets(form.value.assets)
  const platforms = cleanList(form.value.platforms)

  payload.append('title', form.value.title)
  payload.append('brand', form.value.brand)
  payload.append('category', form.value.category)
  payload.append('type', form.value.type)
  payload.append('status', form.value.status)
  payload.append('exclusive', form.value.exclusive ? '1' : '0')
  payload.append('rate_per_view', String(form.value.rate_per_view))
  payload.append('budget_percent', String(form.value.budget_percent))
  payload.append('views_target', String(form.value.views_target))
  if (form.value.deadline_at) payload.append('deadline_at', form.value.deadline_at)
  if (form.value.image_url) payload.append('image_url', form.value.image_url)
  if (form.value.brief) payload.append('brief', form.value.brief)
  if (form.value.hero_image) payload.append('hero_image', form.value.hero_image)
  rules.forEach((rule) => payload.append('rules[]', rule))
  platforms.forEach((platform) => payload.append('platforms[]', platform))
  assets.forEach((asset, index) => {
    payload.append(`assets[${index}][title]`, asset.title)
    payload.append(`assets[${index}][url]`, asset.url)
  })

  return payload
}

const selectHeroImage = (event) => {
  const file = event.target.files?.[0]
  form.value.hero_image = file || null
  heroImagePreview.value = file ? URL.createObjectURL(file) : ''
}

const addListItem = (key, value = '') => {
  form.value[key].push(value)
}

const addAsset = () => {
  form.value.assets.push({ title: '', url: '' })
}

const removeListItem = (key, index) => {
  if (form.value[key].length <= 1) {
    form.value[key][index] = ''
    return
  }

  form.value[key].splice(index, 1)
}

const listLabel = {
  rules: 'Aturan',
  assets: 'Asset',
  platforms: 'Platform',
}

const nextStep = () => {
  if (!canContinue.value || isLastStep.value) return
  currentStep.value += 1
}

const previousStep = () => {
  if (isFirstStep.value) return
  currentStep.value -= 1
}

const createCampaign = async () => {
  saving.value = true

  try {
    await store.createAdminCampaign(buildPayload())
    router.push('/admin/campaigns')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AppShell>
    <form class="mx-auto max-w-[960px] pb-24" @submit.prevent="createCampaign">
      <div class="flex items-center gap-4">
        <RouterLink to="/admin/campaigns" class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/62 transition hover:bg-white/[.075] hover:text-white">
          <ArrowLeftIcon class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Tambah Campaign</h1>
          <p class="mt-1 text-sm text-white/42">Buat campaign baru dan simpan ke database.</p>
        </div>
      </div>

      <div class="mt-7 grid gap-3 md:grid-cols-3">
        <button
          v-for="(step, index) in steps"
          :key="step.title"
          class="flex h-16 items-center gap-3 rounded-lg border px-4 text-left transition"
          :class="index === currentStep ? 'border-purple-400/45 bg-purple-500/10' : index < currentStep ? 'border-emerald-300/18 bg-emerald-400/8' : 'border-white/[.07] bg-white/[.025]'"
          type="button"
          @click="currentStep = index"
        >
          <span
            class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold"
            :class="index === currentStep ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : index < currentStep ? 'bg-emerald-400/14 text-emerald-100' : 'bg-white/[.055] text-white/44'"
          >
            {{ index + 1 }}
          </span>
          <span>
            <span class="block text-sm font-semibold text-white/82">{{ step.title }}</span>
            <span class="mt-0.5 block text-xs text-white/36">{{ step.description }}</span>
          </span>
        </button>
      </div>

      <section v-if="currentStep === 0" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="max-w-xl">
          <h2 class="text-base font-semibold text-white/86">Informasi Utama</h2>
          <p class="mt-1 text-sm text-white/38">Nama campaign dan brand yang akan tampil ke creator.</p>
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="block md:col-span-2">
            <span :class="labelClass">Nama Campaign</span>
            <input v-model="form.title" required :class="inputClass" placeholder="Contoh: Beauty Flash Clip" />
          </label>
          <label class="block">
            <span :class="labelClass">Brand</span>
            <input v-model="form.brand" required :class="inputClass" placeholder="Contoh: Glowkit" />
          </label>
          <label class="block">
            <span :class="labelClass">Kategori</span>
            <input v-model="form.category" required :class="inputClass" />
          </label>
        </div>
      </section>

      <section v-if="currentStep === 1" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="max-w-xl">
          <h2 class="text-base font-semibold text-white/86">Aturan Campaign</h2>
          <p class="mt-1 text-sm text-white/38">Tentukan tipe, status, budget, target, dan deadline.</p>
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label class="block">
            <span :class="labelClass">Tipe</span>
            <select v-model="form.type" :class="selectClass">
              <option class="bg-black" value="CLIPPING">CLIPPING</option>
              <option class="bg-black" value="UGC">UGC</option>
            </select>
          </label>
          <label class="block">
            <span :class="labelClass">Status</span>
            <select v-model="form.status" :class="selectClass">
              <option class="bg-black" value="active">Active</option>
              <option class="bg-black" value="draft">Draft</option>
              <option class="bg-black" value="closed">Closed</option>
            </select>
          </label>
          <label class="block">
            <span :class="labelClass">Deadline</span>
            <input v-model="form.deadline_at" type="date" :class="inputClass" />
          </label>
          <label class="flex min-h-[78px] cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-3 transition lg:col-span-3" :class="form.exclusive ? 'border-purple-300/35 bg-purple-500/10' : 'border-white/[.08] bg-black/20 hover:bg-white/[.035]'">
            <span>
              <span class="block text-sm font-semibold text-white/80">Campaign Exclusive</span>
              <span class="mt-1 block text-xs leading-5 text-white/38">Tandai campaign ini sebagai prioritas/exclusive di listing creator.</span>
            </span>
            <input v-model="form.exclusive" type="checkbox" class="sr-only" />
            <span class="relative h-7 w-12 shrink-0 rounded-full border transition" :class="form.exclusive ? 'border-purple-300/40 bg-purple-500/70' : 'border-white/10 bg-white/[.08]'">
              <span class="absolute left-1 top-1 h-5 w-5 rounded-full shadow-sm transition" :class="form.exclusive ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white/70'"></span>
            </span>
          </label>
          <label class="block">
            <span :class="labelClass">Rate per View</span>
            <input v-model.number="form.rate_per_view" required min="0" type="number" :class="numberClass" />
          </label>
          <label class="block">
            <span :class="labelClass">Budget Percent</span>
            <input v-model.number="form.budget_percent" required max="100" min="0" type="number" :class="numberClass" />
          </label>
          <label class="block">
            <span :class="labelClass">Target Views</span>
            <input v-model.number="form.views_target" required min="0" type="number" :class="numberClass" />
          </label>
        </div>
      </section>

      <section v-if="currentStep === 2" class="mt-5 lg:rounded-lg lg:border lg:border-white/[.08] lg:bg-white/[.025] lg:p-5 lg:p-6">
        <div class="max-w-xl">
          <h2 class="text-base font-semibold text-white/86">Media & Brief</h2>
          <p class="mt-1 text-sm text-white/38">Tambahkan gambar dan arahan singkat untuk creator.</p>
        </div>

        <div class="mt-5 space-y-5">
          <div class="rounded-lg border border-white/[.08] bg-black/20 p-4">
            <div class="grid gap-4 lg:grid-cols-[280px_1fr]">
              <div>
                <p class="text-xs font-semibold uppercase text-purple-200/80">1. Hero</p>
                <h3 class="mt-2 text-sm font-semibold text-white/84">Gambar Utama Campaign</h3>
                <p class="mt-1 text-xs leading-5 text-white/38">Gambar ini tampil di card dan header detail campaign.</p>
              </div>
              <div class="grid gap-3">
                <input accept="image/*" type="file" class="block w-full cursor-pointer rounded-lg border border-white/[.08] bg-black/20 text-sm text-white/60 outline-none file:mr-4 file:h-11 file:border-0 file:bg-white/[.08] file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-white/[.12]" @change="selectHeroImage" />
                <div v-if="heroImagePreview" class="overflow-hidden rounded-lg border border-white/[.08] bg-black/20">
                  <img :src="heroImagePreview" alt="Preview hero campaign" class="h-48 w-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          <div class="lg:rounded-lg lg:border lg:border-white/[.08] lg:bg-black/20 lg:p-4">
            <div>
              <p class="text-xs font-semibold uppercase text-purple-200/80">2. Brief & Rules</p>
              <h3 class="mt-2 text-sm font-semibold text-white/84">Arahan untuk Creator</h3>
              <p class="mt-1 text-xs leading-5 text-white/38">Brief untuk gambaran umum, rules untuk aturan wajib yang harus diikuti.</p>
            </div>

            <div class="mt-4 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
              <label class="block">
                <span :class="labelClass">Brief Campaign</span>
                <textarea v-model="form.brief" rows="12" :class="textareaClass" placeholder="Contoh: Buat video clipping dengan hook cepat, highlight benefit utama produk, visual brand jelas, dan CTA submit yang natural."></textarea>
            </label>

              <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.07] pb-4">
                  <div>
                    <h4 class="text-sm font-semibold text-white/80">Rules / Aturan Konten</h4>
                    <p class="mt-1 text-xs leading-5 text-white/36">Tulis aturan satu per satu supaya mudah dibaca creator.</p>
                  </div>
                  <button class="inline-flex h-9 items-center gap-2 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/68 transition hover:bg-white/[.085] hover:text-white" type="button" @click="addListItem('rules')">
                    <PlusIcon class="h-4 w-4" />
                    Tambah
                  </button>
                </div>
                <div class="mt-4 space-y-2">
                  <div v-for="(_, index) in form.rules" :key="`rules-${index}`" class="flex items-center gap-3 rounded-lg border border-white/[.07] bg-black/20 p-2">
                    <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-purple-500/15 text-xs font-semibold text-purple-100">{{ index + 1 }}</span>
                    <input v-model="form.rules[index]" :class="inputClass" :placeholder="`Aturan ${index + 1}`" />
                    <button class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/[.08] bg-white/[.035] text-white/44 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200" type="button" @click="removeListItem('rules', index)">
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div class="lg:rounded-lg lg:border lg:border-white/[.08] lg:bg-black/20 lg:p-4">
            <div>
              <p class="text-xs font-semibold uppercase text-purple-200/80">3. Asset & Platform</p>
              <h3 class="mt-2 text-sm font-semibold text-white/84">Materi Pendukung</h3>
              <p class="mt-1 text-xs leading-5 text-white/38">Asset berisi bahan/link download, platform berisi channel tayang.</p>
            </div>

            <div class="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-white/80">Asset Kit</h3>
                  <p class="mt-1 text-xs text-white/36">Isi judul dan link download / YouTube.</p>
                </div>
                <button class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[.055] text-white/64 transition hover:bg-white/[.085] hover:text-white" type="button" @click="addAsset">
                  <PlusIcon class="h-4 w-4" />
                </button>
              </div>
              <div class="mt-4 space-y-3">
                <div v-for="(_, index) in form.assets" :key="`asset-${index}`" class="grid gap-2 rounded-lg border border-white/[.07] bg-white/[.025] p-3">
                  <div class="flex gap-2">
                    <input v-model="form.assets[index].title" :class="inputClass" :placeholder="`Judul asset ${index + 1}`" />
                    <button class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/[.08] bg-white/[.035] text-white/44 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200" type="button" @click="removeListItem('assets', index)">
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                  <input v-model="form.assets[index].url" :class="inputClass" placeholder="https://youtube.com/... atau link download asset" />
                </div>
              </div>
              </section>

              <section class="rounded-lg border border-white/[.08] bg-white/[.025] p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-white/80">Platform Tayang</h3>
                  <p class="mt-1 text-xs text-white/36">Muncul di sidebar Platform.</p>
                </div>
                <button class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[.055] text-white/64 transition hover:bg-white/[.085] hover:text-white" type="button" @click="addListItem('platforms')">
                  <PlusIcon class="h-4 w-4" />
                </button>
              </div>
              <div class="mt-4 space-y-3">
                <div v-for="(_, index) in form.platforms" :key="`platforms-${index}`" class="flex gap-2">
                  <input v-model="form.platforms[index]" :class="inputClass" :placeholder="`Platform ${index + 1}`" />
                  <button class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/[.08] bg-white/[.035] text-white/44 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200" type="button" @click="removeListItem('platforms', index)">
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0B0B0D]/92 px-5 py-4 backdrop-blur lg:left-[252px]">
        <div class="mx-auto flex max-w-[960px] items-center justify-between gap-3">
          <RouterLink to="/admin/campaigns" class="inline-flex h-11 items-center rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]">Batal</RouterLink>
          <div class="flex items-center gap-3">
            <button v-if="!isFirstStep" class="h-11 rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" @click="previousStep">Kembali</button>
            <button v-if="!isLastStep" class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:bg-[#7551e9] disabled:opacity-45" type="button" :disabled="!canContinue" @click="nextStep">
              Lanjut
            </button>
            <button v-else class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:bg-[#7551e9] disabled:opacity-60" type="submit" :disabled="saving">
              {{ saving ? 'Menyimpan...' : 'Simpan Campaign' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </AppShell>
</template>
