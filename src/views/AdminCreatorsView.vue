<script setup>
import { computed, onMounted, ref } from 'vue'
import { Bars3Icon, PlusIcon, Squares2X2Icon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const store = useClipperStore()
const creators = computed(() => store.adminCreators)
const viewMode = ref('card')

const editCreator = async (creator) => {
  const name = window.prompt('Nama creator', creator.name)
  if (!name) return

  const status = window.prompt('Status', creator.status || 'Active')
  if (!status) return

  await store.updateAdminCreator(creator.id, {
    name,
    status: status.toLowerCase(),
  })
}

const deleteCreator = async (creator) => {
  if (!window.confirm(`Hapus creator "${creator.name}"?`)) return
  await store.deleteAdminCreator(creator.id)
}

onMounted(() => store.loadAdminCreators())
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-[1360px]">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Kelola Creator</h1>
          <p class="mt-2 text-sm text-white/45">Lihat performa creator dan total pendapatan valid.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="grid h-10 grid-cols-2 rounded-lg border border-white/10 bg-white/[.035] p-1">
            <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'card' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'card'" aria-label="Card view">
              <Squares2X2Icon class="h-4 w-4" />
            </button>
            <button class="grid w-9 place-items-center rounded-md transition" :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/42 hover:text-white/78'" type="button" @click="viewMode = 'list'" aria-label="List view">
              <Bars3Icon class="h-4 w-4" />
            </button>
          </div>
          <RouterLink to="/admin/creators/invite" class="inline-flex h-10 items-center rounded-lg bg-white/[.055] px-4 text-sm font-semibold text-white/72 transition hover:bg-white/[.085]">
            Undang
          </RouterLink>
          <RouterLink to="/admin/creators/create" class="inline-flex h-10 items-center gap-2 rounded-lg bg-bluebrand px-4 text-sm font-semibold text-white shadow-blue">
            <PlusIcon class="h-4 w-4 stroke-[2]" />
            Tambah
          </RouterLink>
        </div>
      </div>

      <section v-if="viewMode === 'card'" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="creator in creators" :key="creator.handle" class="dark-card rounded-lg p-5">
          <div class="flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-lg bg-blue-500/14 text-base font-black text-blue-100/90">{{ creator.name?.[0] }}</div>
            <div>
              <h2 class="font-semibold text-white/88">{{ creator.name }}</h2>
              <p class="mt-1 text-xs text-white/38">{{ creator.handle }}</p>
            </div>
          </div>
          <div class="mt-6 rounded-lg bg-white/[.035] p-4">
            <div class="text-xs text-white/34">Pendapatan</div>
            <div class="mt-2 text-xl font-semibold text-blue-200/90">{{ creator.income }}</div>
          </div>
          <div class="mt-5 flex gap-2">
            <button class="h-9 rounded-lg bg-white/[.055] px-4 text-xs font-semibold text-white/72 hover:bg-white/[.085]" type="button" @click="editCreator(creator)">Edit</button>
            <button class="h-9 rounded-lg bg-red-400/10 px-4 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="deleteCreator(creator)">Hapus</button>
          </div>
        </article>
      </section>

      <section v-else class="mt-6 overflow-x-auto">
        <div class="min-w-[760px]">
          <table class="w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead class="text-[11px] uppercase tracking-[.12em] text-white/30">
              <tr>
                <th class="px-4 pb-1 font-medium">Creator</th>
                <th class="px-4 pb-1 font-medium">Handle</th>
                <th class="px-4 pb-1 font-medium">Pendapatan</th>
                <th class="px-4 pb-1 font-medium">Status</th>
                <th class="px-4 pb-1 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="creator in creators" :key="creator.handle" class="group text-white/68">
                <td class="rounded-l-lg border-y border-l border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex items-center gap-3">
                    <div class="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/14 text-sm font-black text-blue-100/90">{{ creator.name?.[0] }}</div>
                    <div class="text-sm font-semibold text-white/86">{{ creator.name }}</div>
                  </div>
                </td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">{{ creator.handle }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 font-semibold text-blue-200/90 transition group-hover:bg-white/[.045]">{{ creator.income }}</td>
                <td class="border-y border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-100/82">{{ creator.status || 'Active' }}</span>
                </td>
                <td class="rounded-r-lg border-y border-r border-white/[.06] bg-white/[.028] px-4 py-4 transition group-hover:bg-white/[.045]">
                  <div class="flex gap-2">
                    <button class="h-8 rounded-lg bg-white/[.055] px-3 text-xs font-semibold text-white/72 hover:bg-white/[.085]" type="button" @click="editCreator(creator)">Edit</button>
                    <button class="h-8 rounded-lg bg-red-400/10 px-3 text-xs font-semibold text-red-100/82 hover:bg-red-400/16" type="button" @click="deleteCreator(creator)">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AppShell>
</template>
