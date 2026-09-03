<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  BellIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  HomeIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  TrophyIcon,
  UsersIcon,
  VideoCameraIcon,
  WalletIcon,
} from '@heroicons/vue/24/outline'
import { useClipperStore } from '../stores/clipper'
import LogoMark from './LogoMark.vue'

const route = useRoute()
const store = useClipperStore()
const collapsed = ref(false)
const showDashboardMenu = ref(false)
const accounts = computed(() => store.accounts)
const selectedAccountId = computed({
  get: () => store.selectedAccount?.id,
  set: (id) => id && store.setSelectedAccount(Number(id)),
})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const toggleDashboardMenu = () => {
  showDashboardMenu.value = !showDashboardMenu.value
}

const nav = [
  { label: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { label: 'Campaigns', path: '/campaigns', icon: MegaphoneIcon },
  { label: 'Pendapatan', path: '/payment', icon: BanknotesIcon },
  { label: 'Course Gratis', path: '/course-gratis', icon: TrophyIcon },
  { label: 'Leaderboard', path: '/top-leaderboard', icon: UsersIcon },
]

const adminNav = [
  { label: 'Dashboard Admin', path: '/admin/dashboard', icon: ChartBarIcon },
  { label: 'Kelola Campaign', path: '/admin/campaigns', icon: MegaphoneIcon },
  { label: 'Review Submission', path: '/admin/submissions', icon: VideoCameraIcon },
  { label: 'Kelola Creator', path: '/admin/creators', icon: UsersIcon },
  { label: 'Payout', path: '/admin/payouts', icon: WalletIcon },
]

const isAdminArea = computed(() => route.path.startsWith('/admin'))
const activeNav = computed(() => isAdminArea.value ? adminNav : nav)
const title = computed(() => route.meta?.title || activeNav.value.find(item => item.path === route.path)?.label || (isAdminArea.value ? 'Admin Area' : 'Member Area'))

onMounted(() => {
  if (!store.accounts.length) {
    store.loadDashboard()
  }
})
</script>

<template>
  <main class="dark-bg min-h-screen">
    <aside
      class="fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r border-white/10 bg-black/95 transition-[width] duration-300 ease-out lg:block"
      :class="collapsed ? 'w-[88px]' : 'w-[252px]'"
    >
      <div class="sidebar-scroll flex h-dvh min-h-0 flex-col overflow-y-auto overflow-x-hidden pb-8 pt-5 transition-[padding] duration-300 ease-out" :class="collapsed ? 'px-3' : 'px-3.5'">
        <div class="flex items-center transition-all duration-300 ease-out" :class="collapsed ? 'justify-center' : 'gap-3 px-1'">
          <button
            class="grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition"
            :class="collapsed ? 'border-blue-400 bg-white/[.055] text-white shadow-blue' : 'border-white/10 bg-white/[.055] text-white/62 hover:border-blue-400/50 hover:text-white'"
            type="button"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <span class="flex h-4 w-4 flex-col justify-between">
              <span class="h-0.5 w-full rounded-full bg-current"></span>
              <span class="h-0.5 w-full rounded-full bg-current"></span>
              <span class="h-0.5 w-full rounded-full bg-current"></span>
            </span>
          </button>
          <RouterLink
            to="/"
            class="block origin-left overflow-hidden whitespace-nowrap transition-all duration-300 ease-out"
            :class="collapsed ? 'w-0 translate-x-1 scale-95 opacity-0' : 'w-[132px] translate-x-0 scale-100 opacity-100 delay-75'"
          >
            <LogoMark />
          </RouterLink>
        </div>

        <nav class="space-y-2 transition-[margin] duration-300 ease-out" :class="collapsed ? 'mt-10' : 'mt-7'">
          <RouterLink
            v-for="item in activeNav"
            :key="item.path"
            :to="item.path"
            class="group flex h-11 items-center overflow-hidden rounded-lg text-left text-[13px] font-medium tracking-[-.01em] transition-all duration-300 ease-out"
            :class="[
              collapsed ? 'w-full justify-center px-0' : 'w-full gap-3 px-3',
              route.path === item.path || route.path.startsWith(item.path + '/') ? 'bg-white/[.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]' : 'text-white/43 hover:bg-white/[.045] hover:text-white/86'
            ]"
          >
            <span
              class="grid shrink-0 place-items-center rounded-md border transition-all duration-300 ease-out"
              :class="[
                collapsed ? 'h-10 w-10' : 'h-7 w-7',
                route.path === item.path || route.path.startsWith(item.path + '/') ? 'border-blue-400/35 bg-blue-500/18 text-blue-200' : 'border-white/10 bg-white/[.035] text-white/42 group-hover:text-blue-200'
              ]"
            >
              <component :is="item.icon" :class="collapsed ? 'h-5 w-5' : 'h-4 w-4'" class="stroke-[1.8]" />
            </span>
            <span
              class="block overflow-hidden whitespace-nowrap transition-all duration-300 ease-out"
              :class="collapsed ? 'w-0 translate-x-1 opacity-0' : 'w-36 translate-x-0 opacity-100 delay-75'"
            >
              {{ item.label }}
            </span>
          </RouterLink>
        </nav>

        <div
          class="border-t border-white/10 transition-all duration-300 ease-out"
          :class="collapsed ? 'mt-0 max-h-0 overflow-hidden translate-y-1 border-transparent pt-0 opacity-0' : 'mt-6 max-h-none overflow-visible translate-y-0 pt-5 opacity-100 delay-75'"
        >
          <h3 class="px-1 text-[11px] font-semibold uppercase tracking-[.14em] text-white/72">{{ isAdminArea ? 'Admin Panel' : 'Campaign Aktif' }}</h3>
          <div class="mt-3 rounded-lg border border-white/10 bg-white/[.025] p-3">
            <template v-if="isAdminArea">
              <p class="text-xs leading-5 text-white/42">Kelola campaign, creator, submission, dan payout.</p>
            </template>
            <template v-else>
              <p class="text-xs leading-5 text-white/42">Belum join campaign apapun.</p>
              <RouterLink to="/campaigns" class="mt-3 inline-flex text-xs font-semibold text-blue-400">Jelajahi campaign →</RouterLink>
            </template>
          </div>
        </div>

        <div
          class="border-t border-white/10 transition-all duration-300 ease-out"
          :class="collapsed ? 'mt-0 max-h-0 overflow-hidden translate-y-1 border-transparent pt-0 opacity-0' : 'mt-6 max-h-none overflow-visible translate-y-0 pt-5 opacity-100 delay-100'"
        >
          <h3 class="px-1 text-[11px] font-semibold uppercase tracking-[.14em] text-white/72">Bantuan</h3>
          <RouterLink to="/hubungi-admin" class="mt-3 flex h-8 items-center gap-2.5 px-1 text-xs font-medium text-white/43 hover:text-white/86">
            <span class="grid h-6 w-6 place-items-center rounded-md bg-white/[.035]">
              <ChatBubbleLeftRightIcon class="h-3.5 w-3.5 stroke-[1.8]" />
            </span>
            Hubungi Admin
          </RouterLink>
          <RouterLink to="/announcement" class="mt-2 flex h-8 items-center gap-2.5 px-1 text-xs font-medium text-white/43 hover:text-white/86">
            <span class="grid h-6 w-6 place-items-center rounded-md bg-white/[.035]">
              <QuestionMarkCircleIcon class="h-3.5 w-3.5 stroke-[1.8]" />
            </span>
            FaQ & Peraturan
          </RouterLink>
        </div>

        <RouterLink
          to="/logout"
          class="mt-6 flex shrink-0 border-t border-white/10 text-xs font-medium text-white/38 transition-all duration-300 ease-out hover:text-white/80"
          :class="collapsed ? 'h-14 items-end justify-center px-0 pb-1' : 'h-12 items-center gap-2.5 px-1 pt-5'"
        >
          <span class="grid place-items-center rounded-md bg-white/[.035] transition-all duration-300 ease-out" :class="collapsed ? 'h-10 w-10' : 'h-6 w-6'">
            <ArrowRightOnRectangleIcon :class="collapsed ? 'h-5 w-5' : 'h-3.5 w-3.5'" class="stroke-[1.8]" />
          </span>
          <span
            class="block overflow-hidden whitespace-nowrap transition-all duration-300 ease-out"
            :class="collapsed ? 'w-0 translate-x-1 opacity-0' : 'w-20 translate-x-0 opacity-100 delay-75'"
          >
            Logout
          </span>
        </RouterLink>
      </div>
    </aside>

    <section class="min-h-screen transition-[padding] duration-300 ease-out" :class="collapsed ? 'lg:pl-[88px]' : 'lg:pl-[252px]'">
      <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#0B0B0D]/90 px-5 backdrop-blur md:px-7">
        <div class="text-[15px] font-medium text-white/82">{{ title }}</div>
        <div class="flex items-center gap-4">
          <div class="relative hidden md:block">
            <select v-model="selectedAccountId" class="h-10 min-w-[320px] appearance-none rounded-lg border border-white/10 bg-white/[.045] pl-3.5 pr-9 text-xs font-medium text-white/78 outline-none">
              <option v-for="account in accounts" :key="account.id" :value="account.id" class="bg-black">{{ account.name }} - {{ account.handle }}</option>
            </select>
            <ChevronDownIcon class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/58" />
          </div>
          <RouterLink to="/announcement" class="relative grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[.045] text-sm text-white/70">
            <BellIcon class="h-5 w-5 stroke-[1.8]" />
            <span class="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-bluebrand text-[10px] font-black">1</span>
          </RouterLink>
          <div class="relative">
            <button
              class="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[.045] text-white/70 transition hover:border-blue-400/40 hover:text-white"
              type="button"
              aria-label="Pindah dashboard"
              @click="toggleDashboardMenu"
            >
              <Squares2X2Icon class="h-5 w-5 stroke-[1.8]" />
            </button>

            <div
              v-if="showDashboardMenu"
              class="absolute right-0 top-12 z-30 w-56 rounded-lg border border-white/10 bg-[#111113] p-2 shadow-[0_18px_42px_rgba(0,0,0,.38)]"
            >
              <RouterLink
                to="/dashboard"
                class="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/78 transition hover:bg-white/[.065] hover:text-white"
                @click="showDashboardMenu = false"
              >
                <HomeIcon class="h-5 w-5 stroke-[1.8] text-blue-300" />
                Dashboard Creator
              </RouterLink>
              <RouterLink
                to="/admin/dashboard"
                class="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/78 transition hover:bg-white/[.065] hover:text-white"
                @click="showDashboardMenu = false"
              >
                <ChartBarIcon class="h-5 w-5 stroke-[1.8] text-blue-300" />
                Dashboard Admin
              </RouterLink>
            </div>
          </div>
        </div>
      </header>

      <div class="px-5 py-6 md:px-7">
        <slot />
      </div>
    </section>
  </main>
</template>
