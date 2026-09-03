<script setup>
import AppShell from '../components/AppShell.vue'
</script>

<template>
  <AppShell>
    <section class="dark-card max-w-3xl rounded-lg p-6">
      <h1 class="text-3xl font-black">Hubungi Admin</h1>
      <p class="mt-2 text-white/50">Buat ticket untuk payment, campaign, atau peninjauan akun.</p>
      <div class="mt-6 grid gap-4">
        <input class="rounded-lg border border-white/10 bg-white/[.045] px-4 py-4 outline-none focus:border-blue-400" placeholder="Subjek" />
        <select class="rounded-lg border border-white/10 bg-white/[.045] px-4 py-4 outline-none focus:border-blue-400">
          <option class="bg-black">Payment / Withdraw</option>
          <option class="bg-black">Peninjauan akun</option>
          <option class="bg-black">Campaign</option>
        </select>
        <textarea class="min-h-36 rounded-lg border border-white/10 bg-white/[.045] px-4 py-4 outline-none focus:border-blue-400" placeholder="Tulis pesan"></textarea>
        <button class="btn-blue rounded-lg px-4 py-4 font-black">Kirim ke Admin</button>
      </div>
    </section>
  </AppShell>
</template>
