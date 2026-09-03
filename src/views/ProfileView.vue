<script setup>
import AppShell from '../components/AppShell.vue'
</script>

<template>
  <AppShell>
    <section class="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
      <div class="dark-card rounded-lg p-6">
        <div class="grid h-20 w-20 place-items-center rounded-lg bg-bluebrand text-3xl font-black">A</div>
        <h1 class="mt-5 text-2xl font-black">Alya Pramesti</h1>
        <p class="mt-1 text-white/46">owner@clipper.id</p>
        <p class="mt-5 rounded-lg bg-blue-500/15 px-3 py-2 text-sm font-bold text-blue-200">Base Account Owner</p>
      </div>
      <div class="dark-card rounded-lg p-6">
        <h2 class="text-xl font-black">Informasi Payout</h2>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <input class="rounded-lg border border-white/10 bg-white/[.045] px-4 py-4 outline-none" value="BCA" />
          <input class="rounded-lg border border-white/10 bg-white/[.045] px-4 py-4 outline-none" value="1234567890" />
          <input class="rounded-lg border border-white/10 bg-white/[.045] px-4 py-4 outline-none md:col-span-2" value="Alya Pramesti" />
        </div>
        <button class="btn-blue mt-5 rounded-lg px-5 py-3 font-bold">Simpan Profile</button>
      </div>
    </section>
  </AppShell>
</template>
