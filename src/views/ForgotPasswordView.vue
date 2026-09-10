<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import LogoMark from '../components/LogoMark.vue'

const email = ref('')
const sent = ref(false)

const submit = () => {
  sent.value = true
}
</script>

<template>
  <main class="grid min-h-screen bg-[#080808] text-white lg:grid-cols-2">
    <section class="flex min-h-screen flex-col px-8 py-10 lg:px-14">
      <RouterLink to="/" class="inline-flex">
        <LogoMark />
      </RouterLink>

      <div class="mx-auto flex w-full max-w-[530px] grow flex-col justify-center py-10">
        <div class="text-center">
          <h1 class="text-[34px] font-semibold leading-tight tracking-[-.035em]">Lupa password</h1>
          <p class="mt-5 text-base font-normal text-white/48">Masukkan email akun kamu untuk proses pemulihan.</p>
        </div>

        <form class="mt-10" @submit.prevent="submit">
          <label class="block text-sm font-medium text-white/58">Email</label>
          <input
            v-model="email"
            required
            type="email"
            class="mt-3 h-16 w-full rounded-xl border border-white/10 bg-black/20 px-5 text-base font-normal text-white outline-none placeholder:text-white/22 focus:border-purple-500/70"
            placeholder="nama@email.com"
          />

          <p v-if="sent" class="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Permintaan pemulihan diterima. Admin akan membantu proses reset password akun kamu.
          </p>

          <button type="submit" class="mt-10 flex h-16 w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#a088ff] to-bluebrand text-base font-medium text-white shadow-[0_0_26px_rgba(136,107,255,.34)] transition hover:bg-[#7551e9]">
            Kirim Permintaan
          </button>
        </form>

        <p class="mt-8 text-center text-base text-white/45">
          Ingat password?
          <RouterLink to="/auth" class="font-medium text-blueglow">Login</RouterLink>
        </p>
      </div>
    </section>

    <section class="relative hidden min-h-screen overflow-hidden bg-[#030918] lg:block">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(136,107,255,.34),transparent_38%),linear-gradient(120deg,rgba(223,198,255,.14),rgba(0,0,0,.78))]"></div>
      <div class="absolute inset-0 opacity-45" style="background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px); background-size: 18px 18px;"></div>
      <div class="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2">
        <div class="absolute left-4 top-28 h-28 w-[520px] -skew-x-[42deg] rounded-xl bg-gradient-to-r from-blueglow to-bluebrand shadow-[0_0_90px_rgba(136,107,255,.34)]"></div>
        <div class="absolute bottom-16 left-72 h-28 w-[420px] skew-x-[42deg] rounded-xl bg-gradient-to-r from-[#2b106c] to-bluebrand opacity-80"></div>
        <div class="absolute left-[335px] top-[190px] h-32 w-44 rotate-45 rounded-3xl bg-[#030918]"></div>
      </div>
    </section>
  </main>
</template>
