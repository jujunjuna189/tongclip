<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const route = useRoute()
const router = useRouter()
const store = useClipperStore()
const saving = ref(false)
const loading = ref(true)
const currentStep = ref(0)
const steps = [
  { title: 'Informasi', description: 'Campaign dan brand' },
  { title: 'Aturan', description: 'Budget dan target' },
  { title: 'Brief', description: 'Media dan arahan' },
]
const form = ref({
  title: '',
  brand: '',
  category: '',
  type: 'CLIPPING',
  rate_per_view: 0,
  budget_percent: 0,
  views_target: 0,
  deadline_at: '',
  image_url: '',
  status: 'active',
  brief: '',
})

const inputClass = 'form-control'
const selectClass = 'form-control form-select'
const numberClass = 'form-control form-number'
const labelClass = 'text-xs font-medium text-white/44'
const campaignId = computed(() => Number(route.params.id))
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

const nextStep = () => {
  if (!canContinue.value || isLastStep.value) return
  currentStep.value += 1
}

const previousStep = () => {
  if (isFirstStep.value) return
  currentStep.value -= 1
}

const updateCampaign = async () => {
  saving.value = true

  try {
    await store.updateAdminCampaign(campaignId.value, {
      ...form.value,
      image_url: form.value.image_url || undefined,
      deadline_at: form.value.deadline_at || undefined,
      brief: form.value.brief || undefined,
    })
    router.push('/admin/campaigns')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const campaign = await store.loadAdminCampaign(campaignId.value)

  form.value = {
    title: campaign.title,
    brand: campaign.brand,
    category: campaign.category,
    type: campaign.type,
    rate_per_view: campaign.rate_value,
    budget_percent: campaign.budget,
    views_target: campaign.views_value,
    deadline_at: campaign.deadline_value || '',
    image_url: campaign.image || '',
    status: campaign.status?.toLowerCase() || 'active',
    brief: campaign.brief || '',
  }

  loading.value = false
})
</script>

<template>
  <AppShell>
    <form class="mx-auto max-w-[960px] pb-24" @submit.prevent="updateCampaign">
      <div class="flex items-center gap-4">
        <RouterLink to="/admin/campaigns" class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/62 transition hover:bg-white/[.075] hover:text-white">
          <ArrowLeftIcon class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Edit Campaign</h1>
          <p class="mt-1 text-sm text-white/42">Perbarui campaign yang sudah tersimpan di database.</p>
        </div>
      </div>

      <div v-if="loading" class="mt-7 rounded-lg border border-white/[.08] bg-white/[.025] p-6 text-sm text-white/45">
        Memuat data campaign...
      </div>

      <template v-else>
        <div class="mt-7 grid gap-3 md:grid-cols-3">
          <button
            v-for="(step, index) in steps"
            :key="step.title"
            class="flex h-16 items-center gap-3 rounded-lg border px-4 text-left transition"
            :class="index === currentStep ? 'border-purple-400/45 bg-purple-500/10' : index < currentStep ? 'border-emerald-300/18 bg-emerald-400/8' : 'border-white/[.07] bg-white/[.025]'"
            type="button"
            @click="currentStep = index"
          >
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold" :class="index === currentStep ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : index < currentStep ? 'bg-emerald-400/14 text-emerald-100' : 'bg-white/[.055] text-white/44'">
              {{ index + 1 }}
            </span>
            <span>
              <span class="block text-sm font-semibold text-white/82">{{ step.title }}</span>
              <span class="mt-0.5 block text-xs text-white/36">{{ step.description }}</span>
            </span>
          </button>
        </div>

        <section v-if="currentStep === 0" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
          <h2 class="text-base font-semibold text-white/86">Informasi Utama</h2>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="block md:col-span-2">
              <span :class="labelClass">Nama Campaign</span>
              <input v-model="form.title" required :class="inputClass" />
            </label>
            <label class="block">
              <span :class="labelClass">Brand</span>
              <input v-model="form.brand" required :class="inputClass" />
            </label>
            <label class="block">
              <span :class="labelClass">Kategori</span>
              <input v-model="form.category" required :class="inputClass" />
            </label>
          </div>
        </section>

        <section v-if="currentStep === 1" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
          <h2 class="text-base font-semibold text-white/86">Aturan Campaign</h2>
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

        <section v-if="currentStep === 2" class="mt-5 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
          <h2 class="text-base font-semibold text-white/86">Media & Brief</h2>
          <div class="mt-5 grid gap-4">
            <label class="block">
              <span :class="labelClass">Image URL</span>
              <input v-model="form.image_url" :class="inputClass" placeholder="https://..." />
            </label>
            <label class="block">
              <span :class="labelClass">Brief</span>
              <textarea v-model="form.brief" rows="7" class="mt-2 w-full resize-y rounded-lg border border-white/[.08] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-purple-400/55 focus:bg-black/30"></textarea>
            </label>
          </div>
        </section>
      </template>

      <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0B0B0D]/92 px-5 py-4 backdrop-blur lg:left-[252px]">
        <div class="mx-auto flex max-w-[960px] items-center justify-between gap-3">
          <RouterLink to="/admin/campaigns" class="inline-flex h-11 items-center rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]">Batal</RouterLink>
          <div class="flex items-center gap-3">
            <button v-if="!isFirstStep && !loading" class="h-11 rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]" type="button" @click="previousStep">Kembali</button>
            <button v-if="!isLastStep && !loading" class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:bg-[#7551e9] disabled:opacity-45" type="button" :disabled="!canContinue" @click="nextStep">
              Lanjut
            </button>
            <button v-else-if="!loading" class="h-11 rounded-lg bg-gradient-to-b from-[#a088ff] to-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:bg-[#7551e9] disabled:opacity-60" type="submit" :disabled="saving">
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </AppShell>
</template>
