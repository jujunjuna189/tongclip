export type Account = {
  name: string
  handle: string
  status: string
  balance: string
}

export type Campaign = {
  slug: string
  title: string
  brand: string
  image: string
  rate: string
  category: string
  budget: number
  views: string
  type: string
  exclusive?: boolean
}

export type Income = {
  date: string
  source: string
  account: string
  amount: string
  status: string
}

export const accounts: Account[] = [
  { name: 'Tongkrongan Main', handle: '@tongkrongan.clip', status: 'Aktif', balance: 'Rp18.450.000' },
  { name: 'Clipper Food', handle: '@clipper.foodies', status: 'Review', balance: 'Rp6.280.000' },
  { name: 'Daily Finds', handle: '@dailyfinds.id', status: 'Aktif', balance: 'Rp11.720.000' },
]

export const campaigns: Campaign[] = [
  { slug: 'sulianto-indria-putra', title: 'Sulianto Indria Putra', brand: 'Suli', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80', rate: 'Rp7.500', category: 'EDUCATION', budget: 39, views: '6.821', type: 'CLIPPING', exclusive: true },
  { slug: 'bybit-grand-launch', title: 'Bybit Indonesia Grand Launch Campaign', brand: 'Bybit Indonesia', image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=1000&q=80', rate: 'Rp5.000', category: 'UGC', budget: 99, views: '1.899', type: 'UGC' },
  { slug: 'wardah-color-circuit', title: 'Wardah Color Circuit', brand: 'Wardah', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80', rate: 'Rp3.000', category: 'ENTERTAINMENT', budget: 92, views: '1.823', type: 'CLIPPING' },
  { slug: 'beauty-flash-clip', title: 'Beauty Flash Clip', brand: 'Glowkit', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80', rate: 'Rp4.000', category: 'BEAUTY', budget: 64, views: '2.110', type: 'CLIPPING' },
  { slug: 'gadget-weekly-review', title: 'Gadget Weekly Review', brand: 'TeknoMart', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80', rate: 'Rp6.000', category: 'TECH', budget: 72, views: '4.281', type: 'UGC' },
  { slug: 'foodies-daily-finds', title: 'Foodies Daily Finds', brand: 'Rasa Lokal', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', rate: 'Rp2.500', category: 'FOOD', budget: 84, views: '3.459', type: 'CLIPPING' },
  { slug: 'flash-peak-football', title: 'Game baru - Flash Peak 4v4 Freestyle Football', brand: 'Flash Peak', image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1000&q=80', rate: 'Rp4.000', category: 'GAMING', budget: 1, views: '12.149', type: 'CLIPPING' },
  { slug: 'enhypen-jakarta', title: 'ENHYPEN Jakarta - Last Chance to Get Your Ticket', brand: 'PK Entertainment', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80', rate: 'Rp3.000', category: 'ENTERTAINMENT', budget: 82, views: '3.149', type: 'CLIPPING' },
  { slug: 'skincare-amorgia', title: 'SKINCARE AMORGIA', brand: 'Artha Idt', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80', rate: 'Rp7.000', category: 'LIFESTYLE', budget: 100, views: '432', type: 'UGC' },
  { slug: 'bodycare-artha', title: 'BODYCARE ARTHA LDT', brand: 'Artha Idt', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=1000&q=80', rate: 'Rp7.000', category: 'LIFESTYLE', budget: 63, views: '4.705', type: 'UGC' },
  { slug: 'podcast-raditya-dika', title: 'Podcast Raditya Dika dan Aqeela', brand: 'Emina', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80', rate: 'Rp3.000', category: 'LIFESTYLE', budget: 3, views: '10.030', type: 'CLIPPING' },
  { slug: 'teh-pucuk-milyaran', title: 'Teh Pucuk Berhadiah Milyaran - UGC', brand: 'Teh Pucuk', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=80', rate: 'Rp7.500', category: 'ENTERTAINMENT', budget: 90, views: '11.302', type: 'UGC' },
]

export const incomes: Income[] = [
  { date: '12 Jul 2026', source: 'Sulianto Indria Putra', account: '@tongkrongan.clip', amount: 'Rp4.250.000', status: 'Valid' },
  { date: '10 Jul 2026', source: 'Beauty Flash Clip', account: '@dailyfinds.id', amount: 'Rp2.900.000', status: 'Valid' },
  { date: '08 Jul 2026', source: 'Gadget Weekly Review', account: '@clipper.foodies', amount: 'Rp1.150.000', status: 'Review' },
]

export const users = [
  { name: 'Alya Pramesti', handle: '@alya.clip', income: 'Rp8.750.000' },
  { name: 'Raka Mahendra', handle: '@rakamhd', income: 'Rp6.420.000' },
  { name: 'Nina Saras', handle: '@ninasaras.id', income: 'Rp5.180.000' },
]

export const announcements = [
  { title: 'Jadwal withdraw Juli 2026', body: 'Penarikan dana dibuka tanggal 15 dan 16 Juli 2026 pukul 09.00-18.00 WIB.' },
  { title: 'Campaign beauty buka slot', body: 'Glowkit membuka tambahan 50 slot clipper untuk akun dengan performa video di atas 3%.' },
  { title: 'Update peninjauan akun', body: 'Akun baru wajib melengkapi validasi sosial sebelum mengikuti campaign berbayar.' },
]
