# Clipper Vue

Vue + Tailwind CSS project untuk Clipper, terinspirasi fitur dan pola halaman konten.com dengan aksen biru.

## Stack

- Vue 3
- Vue Router
- Vite
- Tailwind CSS
- TypeScript

## Install & Run

```bash
npm install
npm run dev
```

Jika cache npm global bermasalah, gunakan cache lokal project:

```bash
npm install --cache .npm-cache
npm run dev
```

Build production:

```bash
npm run build
```

## Routes

- `/` Landing page
- `/auth` Auth/login
- `/peninjauan-akun` Peninjauan akun
- `/dashboard` Dashboard
- `/payment` Payment, withdraw, money
- `/pendapatan` Pencatatan pendapatan
- `/campaigns` Campaign explore
- `/campaigns/:slug` Single page campaign
- `/pengguna` Pengguna
- `/course-gratis` Course gratis
- `/hubungi-admin` Hubungi admin
- `/profile` Profile
- `/announcement` Announcement
- `/logout` Logout

## Catatan

Data masih mock di `src/data/mockData.ts`, jadi siap disambungkan ke API/backend nanti.
