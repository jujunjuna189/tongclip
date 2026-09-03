<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import AppShell from '../components/AppShell.vue'
import { useClipperStore } from '../stores/clipper'

const router = useRouter()
const store = useClipperStore()
const sending = ref(false)
const form = ref({
  email: '',
  name: '',
  message: '',
})

const sendInvite = async () => {
  sending.value = true

  try {
    await store.inviteAdminCreator({
      email: form.value.email,
      name: form.value.name || undefined,
      message: form.value.message || undefined,
    })
    router.push('/admin/creators')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <AppShell>
    <form class="mx-auto max-w-[720px] pb-24" @submit.prevent="sendInvite">
      <div class="flex items-center gap-4">
        <RouterLink to="/admin/creators" class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-white/62 transition hover:bg-white/[.075] hover:text-white">
          <ArrowLeftIcon class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-[24px] font-semibold leading-tight tracking-[-.025em] md:text-[28px]">Undang Creator</h1>
          <p class="mt-1 text-sm text-white/42">Kirim undangan agar creator melengkapi akun sendiri.</p>
        </div>
      </div>

      <section class="mt-7 rounded-lg border border-white/[.08] bg-white/[.025] p-5 md:p-6">
        <div class="grid gap-5">
          <label class="block">
            <span class="text-xs font-medium text-white/44">Email Creator</span>
            <input v-model="form.email" required type="email" class="form-control" placeholder="creator@example.com" />
          </label>
          <label class="block">
            <span class="text-xs font-medium text-white/44">Nama</span>
            <input v-model="form.name" class="form-control" placeholder="Opsional" />
          </label>
          <label class="block">
            <span class="text-xs font-medium text-white/44">Pesan Undangan</span>
            <textarea v-model="form.message" rows="6" class="mt-2 w-full resize-y rounded-lg border border-white/[.08] bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/24 focus:border-blue-400/55 focus:bg-black/30" placeholder="Tambahkan catatan singkat untuk creator."></textarea>
          </label>
        </div>
      </section>

      <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#0B0B0D]/92 px-5 py-4 backdrop-blur lg:left-[252px]">
        <div class="mx-auto flex max-w-[720px] items-center justify-end gap-3">
          <RouterLink to="/admin/creators" class="inline-flex h-11 items-center rounded-lg bg-white/[.055] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/[.085]">Batal</RouterLink>
          <button class="h-11 rounded-lg bg-bluebrand px-6 text-sm font-semibold text-white shadow-blue transition hover:bg-[#2D78FF] disabled:opacity-60" type="submit" :disabled="sending">
            {{ sending ? 'Mengirim...' : 'Kirim Undangan' }}
          </button>
        </div>
      </div>
    </form>
  </AppShell>
</template>
