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
  avatar_url?: string
  bank_name?: string
  bank_account_number?: string
  bank_account_name?: string
  type?: 'user' | 'social_account'
  access_type?: string
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
  rules?: string[]
  assets?: Array<string | { title?: string; url?: string }>
  platforms?: string[]
}

export type AdminCampaignPayload = {
  title: string
  brand: string
  image_url?: string
  hero_image?: File | null
  rate_per_view: number
  category: string
  budget_percent: number
  views_target: number
  type: string
  status: string
  exclusive?: boolean
  deadline_at?: string
  brief?: string
  rules?: string[]
  assets?: Array<string | { title?: string; url?: string }>
  platforms?: string[]
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

export type DailyQuest = {
  reward: string
  completed_days: number
  target_days: number
  remaining_days: number
  today_completed: boolean
  claimed_count: number
  days: Array<{
    day: number
    date: string
    label: string
    completed: boolean
    is_today: boolean
  }>
}

export type User = {
  id: number
  name: string
  email?: string
  handle: string
  role?: string
  income?: string
  status?: string
  onboarding_completed?: boolean
  bank_name?: string
  bank_account_number?: string
  bank_account_name?: string
  accounts?: Account[]
}

export type LeaderboardItem = {
  id: number
  name: string
  handle: string
  platform?: string
  income: string
  income_value: number
}

export type BrandOption = {
  id: number
  name: string
  handle: string
}

export type OnboardingState = {
  brands: BrandOption[]
  active_brand: BrandOption | null
  owners: Array<{ id: number; name: string; handle: string }>
}

export type AdminSubmission = VideoSubmission & {
  campaign?: string | null
  creator?: string | null
  views?: string
  views_value?: number
  estimated_payout?: string
  estimated_payout_value?: number
}

export type AdminCreator = User & {
  accounts_count?: number
  submissions_count?: number
  income?: string
  income_value?: number
}

export type BrandRequest = {
  brand_id: number
  brand_name: string
  brand_handle: string
  user_id: number
  user_name: string
  user_email: string
  user_handle: string
  access_type: string
  status: string
  updated_at: string
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

export type NotificationItem = {
  id: number
  type: string
  title: string
  body?: string | null
  data?: Record<string, unknown> | null
  read_at?: string | null
  created_at?: string | null
}

export type SupportTicket = {
  id: number
  subject: string
  message: string
  status: 'processing' | 'resolved'
  status_label: string
  created_at?: string | null
  creator?: string | null
  creator_handle?: string | null
  creator_email?: string | null
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

export type CoursePayload = {
  title: string
  description: string
  image_url?: string
  duration?: string
  level?: string
  url?: string
  lessons?: Array<{ title?: string; duration?: string; video_url?: string }>
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
    dailyQuest: null as DailyQuest | null,
    campaignFilters: { categories: [] as string[], types: [] as string[] },
    incomes: [] as Income[],
    incomeSummary: null as IncomeSummary | null,
    announcements: [] as Announcement[],
    notifications: [] as NotificationItem[],
    tickets: [] as SupportTicket[],
    adminTickets: [] as SupportTicket[],
    unreadNotifications: 0,
    leaderboard: [] as LeaderboardItem[],
    onboarding: null as OnboardingState | null,
    courses: [] as Course[],
    adminCampaigns: [] as Campaign[],
    adminSubmissions: [] as AdminSubmission[],
    adminCreators: [] as AdminCreator[],
    brandRequests: [] as BrandRequest[],
    adminPayouts: null as AdminPayoutSummary | null,
    loading: false,
    error: '',
  }),
  getters: {
    selectedAccount(state): Account | null {
      return state.accounts.find((account) => account.id === state.selectedAccountId) || state.accounts[0] || null
    },
    selectedSocialAccountId(): number | undefined {
      const selected = this.selectedAccount

      return selected?.type === 'social_account' && selected.id > 0 ? selected.id : undefined
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
      const cleanIdentifier = identifier.trim().replace('\\@', '@')
      const { data } = await api.post('/auth/login', {
        identifier: cleanIdentifier,
        password,
      })
      this.token = data.token
      this.user = data.user
      localStorage.setItem('clipper_token', data.token)
      localStorage.setItem('clipper_last_login_identifier', cleanIdentifier)
      this.selectedAccountId = null
      localStorage.removeItem('clipper_account_id')
      await this.loadDashboard()
    },
    async register(payload: { name: string; email: string; password: string; handle?: string }) {
      const handle = payload.handle?.trim().replace(/^@+/, '') || undefined

      const { data } = await api.post('/auth/register', {
        name: payload.name.trim(),
        email: payload.email.trim(),
        password: payload.password,
        handle,
      })
      this.token = data.token
      this.user = data.user
      localStorage.setItem('clipper_token', data.token)
      this.selectedAccountId = null
      localStorage.removeItem('clipper_account_id')
    },
    logout() {
      this.token = ''
      this.user = null
      this.selectedAccountId = null
      localStorage.removeItem('clipper_token')
      localStorage.removeItem('clipper_account_id')
    },
    async loadMe() {
      const { data } = await api.get('/me')
      this.user = data
      return data as User
    },
    async updateProfile(payload: Partial<{
      name: string
      handle: string
      avatar_url: string
      avatar: File
      bank_name: string
      bank_account_number: string
      bank_account_name: string
    }> | FormData) {
      const { data } = payload instanceof FormData
        ? await api.post('/profile', payload)
        : await api.patch('/profile', payload)
      this.user = data
      await this.loadDashboard()
      return data as User
    },
    async loadOnboarding() {
      const { data } = await api.get('/onboarding')
      this.user = data.user
      this.onboarding = {
        brands: data.brands || [],
        active_brand: data.active_brand || null,
        owners: data.owners || [],
      }
      return this.onboarding
    },
    async joinOnboardingBrand(brandId?: number) {
      await api.post('/onboarding/brand', { brand_id: brandId })
      return this.loadOnboarding()
    },
    async completeOnboarding(payload: { mode: 'owner' | 'member'; owner_user_id?: number }) {
      const { data } = await api.post('/onboarding/complete', payload)

      if (data.logout) {
        this.logout()
      } else if (data.user) {
        this.user = data.user
      }

      return data
    },
    async loadDashboard() {
      this.loading = true
      this.error = ''

      try {
        const { data } = await api.get('/dashboard', {
          params: this.selectedAccountId ? { social_account_id: this.selectedAccountId } : {},
        })

        // Enforce user's personal account as default if none is currently selected
        if (!this.selectedAccountId && data.accounts && data.accounts.length > 0) {
          const lastLoginId = localStorage.getItem('clipper_last_login_identifier')?.toLowerCase().replace(/^@+/, '').trim()
          let myAccount = null
          
          if (lastLoginId) {
            myAccount = data.accounts.find((a: Account) => {
              const h = a.handle?.toLowerCase().replace(/^@+/, '').trim()
              const n = a.name?.toLowerCase().trim()
              return h === lastLoginId || n === lastLoginId
            })
          }

          if (!myAccount && this.user) {
            const userHandle = this.user.handle?.toLowerCase().replace(/^@+/, '').trim()
            myAccount = data.accounts.find((a: Account) => a.handle?.toLowerCase().replace(/^@+/, '').trim() === userHandle)
          }
          
          if (!myAccount && this.user) {
            const userName = this.user.name?.toLowerCase().trim()
            myAccount = data.accounts.find((a: Account) => a.name?.toLowerCase().trim() === userName)
          }
          
          if (!myAccount) {
            myAccount = data.accounts.find((a: Account) => a.type === 'user')
          }
          
          if (myAccount && data.selected_account_id !== myAccount.id) {
             this.setSelectedAccount(myAccount.id, true)
             return
          }
        }

        this.stats = data.stats || []
        this.accounts = data.accounts || []
        this.campaigns = data.campaigns || []
        this.submissions = data.submissions || []
        this.dailyQuest = data.daily_quest || null
        this.announcements = data.announcements || []

        if (data.selected_account_id) {
          this.selectedAccountId = data.selected_account_id
          localStorage.setItem('clipper_account_id', String(data.selected_account_id))
        } else if (!this.selectedAccountId && this.accounts.length > 0) {
          const lastLoginId = localStorage.getItem('clipper_last_login_identifier')?.toLowerCase().replace(/^@+/, '').trim()
          let myAccount = null
          
          if (lastLoginId) {
            myAccount = this.accounts.find((a) => {
              const h = a.handle?.toLowerCase().replace(/^@+/, '').trim()
              const n = a.name?.toLowerCase().trim()
              return h === lastLoginId || n === lastLoginId
            })
          }

          if (!myAccount && this.user) {
            const userHandle = this.user.handle?.toLowerCase().replace(/^@+/, '').trim()
            myAccount = this.accounts.find((a) => a.handle?.toLowerCase().replace(/^@+/, '').trim() === userHandle)
          }
          
          if (!myAccount && this.user) {
            const userName = this.user.name?.toLowerCase().trim()
            myAccount = this.accounts.find((a) => a.name?.toLowerCase().trim() === userName)
          }
          
          if (!myAccount) {
            myAccount = this.accounts.find((a) => a.type === 'user')
          }
          
          if (!myAccount) {
            myAccount = this.accounts[0]
          }
          
          this.setSelectedAccount(myAccount.id, false)
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
        social_account_id: this.selectedSocialAccountId,
      })
      this.upsertCampaign(data.campaign)
      return data
    },
    async submitCampaign(slug: string, videoUrl: string) {
      const { data } = await api.post(`/campaigns/${slug}/submit`, {
        video_url: videoUrl,
        social_account_id: this.selectedSocialAccountId,
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
    async requestWithdrawal(payload: { amount: number }) {
      const { data } = await api.post('/withdrawals', payload)
      await this.loadDashboard()
      await this.loadIncomes()
      return data
    },
    async createSocialAccount(payload: {
      name: string
      email?: string
      handle: string
      platform: string
      avatar_url?: string
      bank_name?: string
      bank_account_number?: string
      bank_account_name?: string
    }) {
      const { data } = await api.post('/social-accounts', payload)
      await this.loadDashboard()
      return data
    },
    async contactAdmin(payload: { subject: string; message: string }) {
      const { data } = await api.post('/contact-admin', payload)
      await this.loadTickets()
      return data
    },
    async loadTickets() {
      const { data } = await api.get('/contact-admin')
      this.tickets = data
    },
    async loadAdminTickets() {
      const { data } = await api.get('/admin/tickets')
      this.adminTickets = data
    },
    async updateAdminTicket(id: number, payload: { status: 'processing' | 'resolved' }) {
      await api.patch(`/admin/tickets/${id}`, payload)
      await this.loadAdminTickets()
    },
    async loadAnnouncements() {
      const { data } = await api.get('/announcements')
      this.announcements = data
    },
    async loadNotifications() {
      const { data } = await api.get('/notifications')
      this.notifications = data.items || []
      this.unreadNotifications = data.unread_count || 0
    },
    async markNotificationsRead() {
      await api.post('/notifications/read')
      this.unreadNotifications = 0
      this.notifications = this.notifications.map((notification) => ({
        ...notification,
        read_at: notification.read_at || new Date().toISOString(),
      }))
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
    async loadAdminCourses() {
      const { data } = await api.get('/admin/courses')
      this.courses = data
    },
    async createAdminCourse(payload: CoursePayload | FormData) {
      await api.post('/admin/courses', payload)
      await this.loadAdminCourses()
    },
    async updateAdminCourse(id: number, payload: Partial<CoursePayload> | FormData) {
      if (payload instanceof FormData) {
        payload.append('_method', 'PATCH')
        await api.post(`/admin/courses/${id}`, payload)
      } else {
        await api.patch(`/admin/courses/${id}`, payload)
      }
      await this.loadAdminCourses()
    },
    async deleteAdminCourse(id: number) {
      await api.delete(`/admin/courses/${id}`)
      await this.loadAdminCourses()
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
    async joinBrand(payload: { handle: string }) {
      const { data } = await api.post('/brands/join', payload)
      return data
    },
    async loadBrandRequests() {
      const { data } = await api.get('/brand-requests')
      this.brandRequests = data
    },
    async updateBrandRequest(brandId: number, userId: number, status: 'active' | 'rejected') {
      await api.patch(`/brand-requests/${brandId}/${userId}`, { status })
      await this.loadBrandRequests()
      await this.loadDashboard()
    },
    async loadAdminPayouts() {
      const { data } = await api.get('/admin/payouts')
      this.adminPayouts = data
    },
    async createAdminCampaign(payload: AdminCampaignPayload | FormData) {
      await api.post('/admin/campaigns', payload)
      await this.loadAdminCampaigns()
    },
    async updateAdminCampaign(id: number, payload: Partial<AdminCampaignPayload> | FormData) {
      if (payload instanceof FormData) {
        payload.append('_method', 'PATCH')
        await api.post(`/admin/campaigns/${id}`, payload)
      } else {
        await api.patch(`/admin/campaigns/${id}`, payload)
      }
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
    async updateAdminCreator(id: number, payload: Partial<{ name: string; handle: string; status: string }>) {
      await api.patch(`/admin/creators/${id}`, payload)
      await this.loadAdminCreators()
    },
    async createAdminCreator(payload: FormData | {
      name: string
      email: string
      handle: string
      avatar_url?: string
      password: string
      status: string
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
