<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CloudArrowDownIcon,
  LinkIcon,
  PlayCircleIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const route = useRoute()
const store = useClipperStore()
const videoUrl = ref('')
const actionMessage = ref('')
const submitting = ref(false)
const fallbackCampaign = {
  slug: String(route.params.slug),
  title: 'Memuat campaign...',
  brand: '',
  image: '',
  rate: 'Rp0',
  category: '',
  budget: 0,
  views: '0',
  type: '',
  brief: 'Memuat brief campaign.',
  assets: [],
  platforms: [],
}
const campaign = computed(() => store.campaigns.find(item => item.slug === route.params.slug) || store.campaigns[0] || fallbackCampaign)
const activeTab = ref('Brief')
const tabs = ['Brief', 'Rules', 'Assets', 'Submission']
const rules = ['Durasi video minimal 15 detik', 'Hook wajib muncul di 3 detik pertama', 'Tidak boleh mengubah klaim utama brand', 'Caption menyertakan hashtag campaign']
const statusLabel = computed(() => {
  if (campaign.value.submission_status === 'review') return 'Review'
  if (campaign.value.joined) return 'Joined'
  return 'Open'
})
const statusClass = computed(() => {
  if (campaign.value.submission_status === 'review') return 'text-amber-300'
  if (campaign.value.joined) return 'text-purple-300'
  return 'text-emerald-300'
})

const joinCampaign = async () => {
  if (!campaign.value) return
  submitting.value = true
  actionMessage.value = ''

  try {
    await store.joinCampaign(campaign.value.slug)
    actionMessage.value = 'Campaign berhasil diambil.'
  } finally {
    submitting.value = false
  }
}

const submitVideo = async () => {
  if (!campaign.value || !videoUrl.value) return
  submitting.value = true
  actionMessage.value = ''

  try {
    await store.submitCampaign(campaign.value.slug, videoUrl.value)
    videoUrl.value = ''
    actionMessage.value = 'Link video masuk peninjauan.'
  } catch (error) {
    actionMessage.value = error?.response?.data?.message || 'Gagal submit link video.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => store.loadCampaign(String(route.params.slug)))
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <RouterLink to="/campaigns" class="inline-flex items-center gap-2 text-sm font-medium text-white/46 hover:text-white">
        <ArrowLeftIcon class="h-4 w-4" />
        Kembali ke semua campaign
      </RouterLink>

      <section class="mt-5 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div class="space-y-6">
          <div class="dark-card overflow-hidden rounded-lg">
            <div class="relative h-[420px] bg-cover bg-center" :style="{ backgroundImage: `url(${campaign.image})` }">
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"></div>
              <div class="absolute left-6 top-6 flex flex-wrap gap-2">
                <span class="rounded-full border border-purple-300/40 bg-purple-500/15 px-4 py-2 text-xs font-medium text-purple-100">{{ campaign.type }}</span>
                <span class="rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-medium text-white/68">{{ campaign.category }}</span>
              </div>
              <button class="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-black/45 text-white/72 backdrop-blur hover:text-white">
                <ArrowTopRightOnSquareIcon class="h-5 w-5" />
              </button>
              <div class="absolute bottom-7 left-7 right-7">
                <p class="text-sm font-medium text-purple-200">{{ campaign.brand }}</p>
                <h1 class="mt-3 max-w-4xl text-[36px] font-semibold leading-tight tracking-[-.03em]">{{ campaign.title }}</h1>
              <p class="mt-3 max-w-2xl text-sm leading-6 text-white/56">{{ campaign.brief }}</p>
              </div>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-4">
            <div class="dark-card rounded-lg p-4">
              <div class="text-xs font-medium text-white/40">Rate</div>
              <div class="mt-2 text-2xl font-semibold text-blueglow">{{ campaign.rate }}</div>
              <div class="mt-1 text-xs text-white/38">Per 1K Views</div>
            </div>
            <div class="dark-card rounded-lg p-4">
              <div class="text-xs font-medium text-white/40">Budget Tersisa</div>
              <div class="mt-2 text-2xl font-semibold">{{ campaign.budget }}%</div>
              <div class="mt-3 h-1 rounded-full bg-white/10"><div class="blue-progress h-full rounded-full" :style="{ width: campaign.budget + '%' }"></div></div>
            </div>
            <div class="dark-card rounded-lg p-4">
              <div class="text-xs font-medium text-white/40">Creator Joined</div>
              <div class="mt-2 text-2xl font-semibold">{{ campaign.views }}</div>
              <div class="mt-1 text-xs text-white/38">Clipper Aktif</div>
            </div>
            <div class="dark-card rounded-lg p-4">
              <div class="text-xs font-medium text-white/40">Status</div>
              <div class="mt-2 text-2xl font-semibold" :class="statusClass">{{ statusLabel }}</div>
              <div class="mt-1 text-xs text-white/38">{{ campaign.joined ? 'Campaign kamu' : 'Slot Tersedia' }}</div>
            </div>
          </div>

          <section class="dark-card rounded-lg p-5">
            <div class="flex flex-wrap gap-2 border-b border-white/8 pb-4">
              <button
                v-for="tab in tabs"
                :key="tab"
                class="rounded-lg px-4 py-2 text-sm font-medium transition"
                :class="activeTab === tab ? 'bg-gradient-to-b from-[#a088ff] to-bluebrand text-white' : 'text-white/42 hover:bg-white/[.045] hover:text-white'"
                @click="activeTab = tab"
              >
                {{ tab }}
              </button>
            </div>

            <div v-if="activeTab === 'Brief'" class="pt-5">
              <h2 class="text-xl font-semibold tracking-[-.015em]">Brief Campaign</h2>
              <p class="mt-3 max-w-3xl text-sm leading-7 text-white/56">Buat clipping dari materi brand. Fokus pada hook kuat, benefit utama, visual produk/brand, dan CTA yang jelas. Konten harus terasa natural seperti rekomendasi creator, bukan hard selling.</p>
              <div class="mt-5 grid gap-3 md:grid-cols-3">
                <div v-for="item in ['Hook cepat', 'Benefit jelas', 'CTA submit']" :key="item" class="rounded-lg border border-white/10 bg-white/[.025] p-4 text-sm font-medium text-white/70">
                  <CheckCircleIcon class="mb-3 h-5 w-5 text-purple-300" />
                  {{ item }}
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'Rules'" class="pt-5">
              <h2 class="text-xl font-semibold tracking-[-.015em]">Aturan Konten</h2>
              <div class="mt-4 space-y-3">
                <div v-for="rule in rules" :key="rule" class="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[.025] p-4 text-sm text-white/62">
                  <CheckCircleIcon class="h-5 w-5 shrink-0 text-purple-300" />
                  {{ rule }}
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'Assets'" class="pt-5">
              <h2 class="text-xl font-semibold tracking-[-.015em]">Asset Kit</h2>
              <div class="mt-4 grid gap-3 md:grid-cols-3">
                <button v-for="asset in campaign.assets || []" :key="asset" class="flex items-center justify-between rounded-lg border border-white/10 bg-white/[.025] p-4 text-sm font-medium text-white/70">
                  {{ asset }}
                  <CloudArrowDownIcon class="h-5 w-5 text-purple-300" />
                </button>
              </div>
            </div>

            <div v-else class="pt-5">
              <h2 class="text-xl font-semibold tracking-[-.015em]">Submit Video</h2>
              <div class="mt-4 flex gap-3 rounded-lg border border-white/10 bg-white/[.025] p-3">
                <LinkIcon class="mt-3 h-5 w-5 shrink-0 text-white/42" />
                <input v-model="videoUrl" class="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-white/30" placeholder="Paste link TikTok / Instagram / YouTube" />
                <button class="btn-blue rounded-lg px-5 text-sm font-semibold disabled:opacity-50" :disabled="submitting || !videoUrl" @click="submitVideo">Submit</button>
              </div>
              <p v-if="actionMessage" class="mt-3 text-sm font-medium text-purple-300">{{ actionMessage }}</p>
              <div v-if="campaign.submissions?.length" class="mt-5 space-y-3">
                <h3 class="text-sm font-semibold text-white/72">Submission Kamu</h3>
                <div
                  v-for="submission in campaign.submissions"
                  :key="submission.id"
                  class="rounded-lg border border-white/10 bg-white/[.025] p-4"
                >
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <a :href="submission.video_url" target="_blank" rel="noreferrer" class="max-w-[680px] truncate text-sm font-medium text-purple-300 hover:text-purple-100">
                      {{ submission.video_url }}
                    </a>
                    <span class="rounded-full border border-amber-300/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100">{{ submission.status }}</span>
                  </div>
                  <div class="mt-2 text-xs text-white/42">{{ submission.submitted_at }} dari {{ submission.account || '-' }}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside class="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <section class="dark-card rounded-lg p-5">
            <h2 class="text-lg font-semibold">Ambil Campaign</h2>
            <p class="mt-2 text-sm leading-6 text-white/48">Gabung campaign ini dan mulai submit video setelah akun sosial kamu terhubung.</p>
            <button class="btn-blue mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold disabled:opacity-50" :disabled="submitting || campaign.joined" @click="joinCampaign">
              {{ submitting ? 'Memproses...' : campaign.joined ? 'Campaign Sudah Diambil' : 'Ambil Campaign' }}
              <ChevronRightIcon class="h-4 w-4" />
            </button>
            <p v-if="store.selectedAccount" class="mt-3 text-xs text-white/42">Akun aktif: {{ store.selectedAccount.name }} - {{ store.selectedAccount.handle }}</p>
            <button class="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[.035] text-sm font-medium text-white/68 hover:text-white">
              <ShareIcon class="h-4 w-4" />
              Bagikan
            </button>
          </section>

          <section class="dark-card rounded-lg p-5">
            <h2 class="text-lg font-semibold">Platform</h2>
            <div class="mt-4 grid grid-cols-3 gap-3">
              <div v-for="platform in campaign.platforms || []" :key="platform" class="grid h-14 place-items-center rounded-lg border border-white/10 bg-white/[.025] text-sm font-medium text-white/64">{{ platform }}</div>
            </div>
          </section>

          <section class="dark-card rounded-lg p-5">
            <h2 class="text-lg font-semibold">Cara Submit</h2>
            <div class="mt-4 space-y-4">
              <div v-for="(step, index) in ['Ambil campaign', 'Posting video', 'Submit link', 'Tunggu approval']" :key="step" class="flex gap-3 text-sm text-white/56">
                <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-purple-500/15 text-xs font-semibold text-gradient-primary">{{ index + 1 }}</span>
                {{ step }}
              </div>
            </div>
          </section>

          <section class="dark-card rounded-lg p-5">
            <div class="flex items-center gap-3">
              <PlayCircleIcon class="h-8 w-8 text-purple-300" />
              <div>
                <h2 class="font-semibold">Course Gratis</h2>
                <p class="text-xs text-white/42">Pelajari cara bikin clip yang cepat approve.</p>
              </div>
            </div>
            <RouterLink to="/course-gratis" class="mt-4 inline-flex text-sm font-medium text-purple-300">Buka course →</RouterLink>
          </section>
        </aside>
      </section>
    </div>
  </AppShell>
</template>
