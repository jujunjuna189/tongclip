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
          Privacy Policy
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-7 text-white/52">
          Terakhir diperbarui: 12 September 2026. Kebijakan ini menjelaskan bagaimana Clipper mengumpulkan,
          menggunakan, dan menjaga data kamu saat menggunakan platform.
        </p>

        <div class="mt-12 space-y-6">
          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">1. Data yang Kami Kumpulkan</h2>
            <p class="mt-3 leading-7 text-white/58">
              Kami dapat mengumpulkan data akun seperti nama, email, handle, password terenkripsi, status onboarding,
              role pengguna, dan informasi profil lain yang kamu isi. Kami juga dapat menyimpan data campaign,
              submission, performa, payout, tiket bantuan, dan aktivitas penggunaan platform.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">2. Penggunaan Data</h2>
            <p class="mt-3 leading-7 text-white/58">
              Data digunakan untuk membuat dan mengamankan akun, memverifikasi creator, mengelola campaign,
              memproses submission dan reward, memberikan bantuan, meningkatkan fitur, serta menjalankan kebutuhan
              operasional Tongkrongan Clipper.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">3. Keamanan Akun</h2>
            <p class="mt-3 leading-7 text-white/58">
              Kami menerapkan langkah teknis dan operasional untuk melindungi data pengguna. Meski begitu, kamu
              tetap bertanggung jawab menjaga kerahasiaan password dan memastikan perangkat yang digunakan aman.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">4. Pembagian Data</h2>
            <p class="mt-3 leading-7 text-white/58">
              Kami tidak menjual data pribadi kamu. Data dapat dibagikan kepada pihak yang membantu operasional
              platform, pemrosesan campaign, pembayaran, kepatuhan hukum, atau investigasi pelanggaran, sejauh
              diperlukan dan sesuai konteks layanan.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">5. Penyimpanan Data</h2>
            <p class="mt-3 leading-7 text-white/58">
              Data disimpan selama akun aktif atau selama masih diperlukan untuk administrasi campaign, riwayat
              transaksi, audit, penyelesaian sengketa, dan pemenuhan kewajiban hukum. Data yang tidak lagi diperlukan
              dapat dihapus atau dianonimkan.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">6. Hak Pengguna</h2>
            <p class="mt-3 leading-7 text-white/58">
              Kamu dapat meminta pembaruan, koreksi, atau peninjauan data akun melalui admin. Permintaan tertentu
              mungkin memerlukan verifikasi identitas dan dapat dibatasi jika data masih dibutuhkan untuk kewajiban
              operasional, keamanan, atau hukum.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">7. Perubahan Kebijakan</h2>
            <p class="mt-3 leading-7 text-white/58">
              Privacy Policy dapat diperbarui dari waktu ke waktu. Versi terbaru akan ditampilkan di halaman ini,
              dan penggunaan platform setelah pembaruan berarti kamu memahami kebijakan yang berlaku.
            </p>
          </section>

          <section class="rounded-xl border border-white/10 bg-white/[.035] p-6">
            <h2 class="text-xl font-semibold tracking-[-.02em]">8. Kontak</h2>
            <p class="mt-3 leading-7 text-white/58">
              Jika kamu memiliki pertanyaan tentang privasi atau pengelolaan data, silakan hubungi admin melalui
              menu bantuan yang tersedia setelah login.
            </p>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>
