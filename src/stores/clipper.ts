import { defineStore } from 'pinia'
import { api } from '../services/api'

export type Account = {
  id: number
  name: string
  handle: string
  platform: string
  status: string
  balance: string
  balance_value: number
}

export type Campaign = {
  id: number
  slug: string
  title: string
  brand: string
  image: string
  rate: string
  rate_value: number
  category: string
  budget: number
  deadline?: string | null
  deadline_value?: string | null
  views: string
  views_value: number
  type: string
  status?: string
  exclusive?: boolean
  joined?: boolean
  submission_status?: string | null
  submitted_video_url?: string | null
  submissions?: Array<{
    id: number
    video_url: string
    status: string
    account?: string
    submitted_at?: string
  }>
  brief?: string
  assets?: string[]
  platforms?: string[]
}

export type AdminCampaignPayload = {
  title: string
  brand: string
  image_url?: string
  rate_per_view: number
  category: string
  budget_percent: number
  views_target: number
  type: string
  status: string
  deadline_at?: string
  brief?: string
}

export type Income = {
  id: number
  date: string
  source: string
  account: string
  amount: string
  amount_value: number
  status: string
}

export type IncomeSummary = {
  stats: Array<{ label: string; value: number; suffix: string }>
  total_income: string
  chart: Array<{ label: string; amount: number; amount_label: string }>
}

export type VideoSubmission = {
  id: number
  submitted_at?: string | null
  caption: string
  type: string
  status: string
  link: string
  account?: string | null
}

export type User = {
  id: number
  name: string
  email?: string
  handle: string
  role?: string
  income?: string
  status?: string
  bank_name?: string
  bank_account_number?: string
  bank_account_name?: string
}

export type AdminSubmission = VideoSubmission & {
  campaign?: string | null
  creator?: string | null
  views?: string
  estimated_payout?: string
}

export type AdminCreator = User & {
  accounts_count?: number
  submissions_count?: number
  income?: string
  income_value?: number
}

export type AdminPayout = {
  id: string
  date: string
  source: string
  creator?: string | null
  account: string
  amount: string
  amount_value: number
  status: string
  type: string
}

export type AdminPayoutSummary = {
  total_income: string
  total_requested: string
  items: AdminPayout[]
}

export type Announcement = {
  id: number
  title: string
  body: string
  published_at?: string
}

export type Course = {
  id: number
  title: string
  description: string
  image_url?: string
  duration?: string
  level?: string
  url?: string
  lessons?: Array<{ title: string; duration: string; video_url?: string }>
  resources?: string[]
}

export const useClipperStore = defineStore('clipper', {
  state: () => ({
    token: localStorage.getItem('clipper_token') || '',
    user: null as User | null,
    stats: [] as Array<{ label: string; value: string }>,
    accounts: [] as Account[],
    selectedAccountId: (Number(localStorage.getItem('clipper_account_id')) || null) as number | null,
    campaigns: [] as Campaign[],
    submissions: [] as VideoSubmission[],
    campaignFilters: { categories: [] as string[], types: [] as string[] },
    incomes: [] as Income[],
    incomeSummary: null as IncomeSummary | null,
    announcements: [] as Announcement[],
    leaderboard: [] as User[],
    courses: [] as Course[],
    adminCampaigns: [] as Campaign[],
    adminSubmissions: [] as AdminSubmission[],
    adminCreators: [] as AdminCreator[],
    adminPayouts: null as AdminPayoutSummary | null,
    loading: false,
    error: '',
  }),
  getters: {
    selectedAccount(state): Account | null {
      return state.accounts.find((account) => account.id === state.selectedAccountId) || state.accounts[0] || null
    },
    withdrawableBalance(state): string {
      return state.stats.find((item) => item.label === 'Bisa Dicairkan')?.value || 'Rp0'
    },
  },
  actions: {
    setSelectedAccount(id: number, refresh = true) {
      this.selectedAccountId = id
      localStorage.setItem('clipper_account_id', String(id))

      if (refresh) {
        void this.loadDashboard()
      }
    },
    async login(identifier: string, password: string) {
      const { data } = await api.post('/auth/login', {
        identifier: identifier.trim().replace('\\@', '@'),
        password,
      })
      this.token = data.token
      this.user = data.user
      localStorage.setItem('clipper_token', data.token)
      this.selectedAccountId = null
      localStorage.removeItem('clipper_account_id')
      await this.loadDashboard()
    },
    logout() {
      this.token = ''
      this.user = null
      this.selectedAccountId = null
      localStorage.removeItem('clipper_token')
      localStorage.removeItem('clipper_account_id')
    },
    async loadDashboard() {
      this.loading = true
      this.error = ''

      try {
        const { data } = await api.get('/dashboard', {
          params: this.selectedAccountId ? { social_account_id: this.selectedAccountId } : {},
        })
        this.stats = data.stats || []
        this.accounts = data.accounts || []
        this.campaigns = data.campaigns || []
        this.submissions = data.submissions || []
        this.announcements = data.announcements || []

        if (data.selected_account_id) {
          this.selectedAccountId = data.selected_account_id
          localStorage.setItem('clipper_account_id', String(data.selected_account_id))
        } else if (!this.selectedAccountId && this.accounts[0]) {
          this.setSelectedAccount(this.accounts[0].id, false)
        }
      } catch (error) {
        this.error = 'Gagal memuat data dashboard.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async loadCampaigns(params: { search?: string; category?: string; type?: string } = {}) {
      const { data } = await api.get('/campaigns', { params })
      this.campaigns = data.data || data
      this.campaignFilters = data.filters || this.campaignFilters
    },
    async loadCampaign(slug: string) {
      const { data } = await api.get(`/campaigns/${slug}`)
      const index = this.campaigns.findIndex((campaign) => campaign.slug === slug)

      if (index >= 0) {
        this.campaigns[index] = data
      } else {
        this.campaigns.push(data)
      }

      return data as Campaign
    },
    async joinCampaign(slug: string) {
      const { data } = await api.post(`/campaigns/${slug}/join`, {
        social_account_id: this.selectedAccount?.id,
      })
      this.upsertCampaign(data.campaign)
      return data
    },
    async submitCampaign(slug: string, videoUrl: string) {
      const { data } = await api.post(`/campaigns/${slug}/submit`, {
        video_url: videoUrl,
        social_account_id: this.selectedAccount?.id,
      })
      this.upsertCampaign(data.campaign)
      return data
    },
    upsertCampaign(campaign: Campaign) {
      const index = this.campaigns.findIndex((item) => item.slug === campaign.slug)

      if (index >= 0) {
        this.campaigns[index] = campaign
      } else {
        this.campaigns.push(campaign)
      }
    },
    async loadIncomes() {
      const { data } = await api.get('/incomes')
      this.incomes = data
    },
    async loadIncomeSummary() {
      const { data } = await api.get('/income-summary')
      this.incomeSummary = data
    },
    async loadAnnouncements() {
      const { data } = await api.get('/announcements')
      this.announcements = data
    },
    async loadLeaderboard() {
      const { data } = await api.get('/leaderboard')
      this.leaderboard = data
    },
    async loadCourses() {
      const { data } = await api.get('/courses')
      this.courses = data
    },
    async loadCourse(id: string | number) {
      const { data } = await api.get(`/courses/${id}`)
      const index = this.courses.findIndex((course) => course.id === data.id)

      if (index >= 0) {
        this.courses[index] = data
      } else {
        this.courses.push(data)
      }

      return data as Course
    },
    async loadAdminCampaigns() {
      const { data } = await api.get('/admin/campaigns')
      this.adminCampaigns = data
    },
    async loadAdminCampaign(id: string | number) {
      const { data } = await api.get(`/admin/campaigns/${id}`)
      return data as Campaign
    },
    async loadAdminSubmissions() {
      const { data } = await api.get('/admin/submissions')
      this.adminSubmissions = data
    },
    async loadAdminCreators() {
      const { data } = await api.get('/admin/creators')
      this.adminCreators = data
    },
    async loadAdminPayouts() {
      const { data } = await api.get('/admin/payouts')
      this.adminPayouts = data
    },
    async createAdminCampaign(payload: AdminCampaignPayload) {
      await api.post('/admin/campaigns', payload)
      await this.loadAdminCampaigns()
    },
    async updateAdminCampaign(id: number, payload: Partial<AdminCampaignPayload>) {
      await api.patch(`/admin/campaigns/${id}`, payload)
      await this.loadAdminCampaigns()
    },
    async deleteAdminCampaign(id: number) {
      await api.delete(`/admin/campaigns/${id}`)
      await this.loadAdminCampaigns()
    },
    async updateAdminSubmission(id: number, payload: { status: string; views?: number; estimated_payout?: number }) {
      await api.patch(`/admin/submissions/${id}`, payload)
      await this.loadAdminSubmissions()
    },
    async deleteAdminSubmission(id: number) {
      await api.delete(`/admin/submissions/${id}`)
      await this.loadAdminSubmissions()
    },
    async updateAdminCreator(id: number, payload: Partial<{ name: string; handle: string; status: string; role: string }>) {
      await api.patch(`/admin/creators/${id}`, payload)
      await this.loadAdminCreators()
    },
    async createAdminCreator(payload: {
      name: string
      email: string
      handle: string
      password: string
      status: string
      role: string
      bank_name?: string
      bank_account_number?: string
      bank_account_name?: string
    }) {
      await api.post('/admin/creators', payload)
      await this.loadAdminCreators()
    },
    async inviteAdminCreator(payload: { email: string; name?: string; message?: string }) {
      await api.post('/admin/creators/invite', payload)
    },
    async deleteAdminCreator(id: number) {
      await api.delete(`/admin/creators/${id}`)
      await this.loadAdminCreators()
    },
    async updateAdminPayout(id: string, payload: { status: string }) {
      await api.patch(`/admin/payouts/${id}`, payload)
      await this.loadAdminPayouts()
    },
    async deleteAdminPayout(id: string) {
      await api.delete(`/admin/payouts/${id}`)
      await this.loadAdminPayouts()
    },
  },
})
