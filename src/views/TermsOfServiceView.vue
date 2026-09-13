<script setup>
import LogoMark from '../components/LogoMark.vue'
</script>

<template>
  <main class="min-h-screen bg-[#080808] text-white">
    <section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-8 py-10 lg:px-14">
      <header class="flex items-center justify-between gap-6">
        <RouterLink to="/auth" class="inline-flex">
          <LogoMark />
        </RouterLink>
        <RouterLink
          to="/auth"
          class="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/64 transition hover:border-white/20 hover:bg-white/[.055] hover:text-white"
        >
          Kembali ke Login
        </RouterLink>
      </header>

      <div class="py-14 lg:py-20">
        <p class="text-sm font-medium uppercase tracking-[.18em] text-blueglow">Tongkrongan Clipper</p>
        <h1 class="mt-4 text-[36px] font-semibold leading-tight tracking-[-.035em] sm:text-[48px]">
          Terms of Service
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-7 text-white/52">
          Terakhir diperbarui: 12 September 2026. Dengan menggunakan platform Clipper, kamu menyetujui ketentuan layanan berikut.
        </p>

        <div class="mt-12 space-y-6">
          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">1. Penggunaan Platform</h2>
            <p class="mt-3 leading-7 text-white/58">
              Clipper menyediakan akses untuk creator mengikuti campaign, mengirim submission, memantau performa,
              dan mengelola aktivitas yang berhubungan dengan program Tongkrongan. Kamu wajib menggunakan platform
              secara wajar, legal, dan sesuai instruksi campaign yang tersedia.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">2. Akun dan Keamanan</h2>
            <p class="mt-3 leading-7 text-white/58">
              Kamu bertanggung jawab menjaga kerahasiaan email, handle, password, dan akses akun. Segera hubungi
              admin jika ada aktivitas mencurigakan, akses tidak sah, atau perubahan data yang tidak kamu lakukan.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">3. Konten dan Submission</h2>
            <p class="mt-3 leading-7 text-white/58">
              Setiap konten yang kamu kirim harus orisinal, tidak melanggar hak cipta, tidak mengandung unsur
              penipuan, ujaran kebencian, kekerasan, pornografi, atau materi lain yang bertentangan dengan hukum
              dan kebijakan campaign. Admin berhak menolak submission yang tidak memenuhi ketentuan.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">4. Campaign dan Reward</h2>
            <p class="mt-3 leading-7 text-white/58">
              Syarat campaign, target, periode, metode validasi, dan reward dapat berbeda untuk setiap program.
              Reward hanya diproses untuk submission yang telah diverifikasi dan memenuhi aturan campaign. Keputusan
              validasi dari admin bersifat final sepanjang didasarkan pada data campaign dan bukti yang tersedia.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">5. Pembatasan Akses</h2>
            <p class="mt-3 leading-7 text-white/58">
              Kami dapat membatasi, menangguhkan, atau menutup akun yang terindikasi melakukan kecurangan,
              manipulasi metrik, spam, pelanggaran kebijakan platform sosial, atau penyalahgunaan fitur Clipper.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">6. Perubahan Ketentuan</h2>
            <p class="mt-3 leading-7 text-white/58">
              Ketentuan layanan dapat diperbarui sewaktu-waktu untuk menyesuaikan kebutuhan operasional, hukum,
              atau kebijakan campaign. Versi terbaru akan ditampilkan di halaman ini dan berlaku sejak tanggal
              pembaruan.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">7. Kontak</h2>
            <p class="mt-3 leading-7 text-white/58">
              Jika kamu memiliki pertanyaan terkait Terms of Service ini, silakan hubungi admin melalui menu
              bantuan yang tersedia setelah login.
            </p>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>
