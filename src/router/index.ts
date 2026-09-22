import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import RegisterView from '../views/RegisterView.vue'
import PendingApprovalView from '../views/PendingApprovalView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminCampaignsView from '../views/AdminCampaignsView.vue'
import AdminCampaignCreateView from '../views/AdminCampaignCreateView.vue'
import AdminCampaignEditView from '../views/AdminCampaignEditView.vue'
import AdminCreatorsView from '../views/AdminCreatorsView.vue'
import AdminCreatorCreateView from '../views/AdminCreatorCreateView.vue'
import AdminCreatorEditView from '../views/AdminCreatorEditView.vue'
import AdminCreatorInviteView from '../views/AdminCreatorInviteView.vue'
import AdminPayoutsView from '../views/AdminPayoutsView.vue'
import AdminSubmissionsView from '../views/AdminSubmissionsView.vue'
import AdminTicketsView from '../views/AdminTicketsView.vue'
import AdminCoursesView from '../views/AdminCoursesView.vue'
import AdminCourseCreateView from '../views/AdminCourseCreateView.vue'
import AdminCourseEditView from '../views/AdminCourseEditView.vue'
import PaymentView from '../views/PaymentView.vue'
import IncomeView from '../views/IncomeView.vue'
import CampaignsView from '../views/CampaignsView.vue'
import CampaignDetailView from '../views/CampaignDetailView.vue'
import UsersView from '../views/UsersView.vue'
import CoursesView from '../views/CoursesView.vue'
import CourseDetailView from '../views/CourseDetailView.vue'
import CourseWatchView from '../views/CourseWatchView.vue'
import ContactAdminView from '../views/ContactAdminView.vue'
import ProfileView from '../views/ProfileView.vue'
import SocialAccountCreateView from '../views/SocialAccountCreateView.vue'
import AnnouncementsView from '../views/AnnouncementsView.vue'
import LogoutView from '../views/LogoutView.vue'
import TermsOfServiceView from '../views/TermsOfServiceView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import { useClipperStore } from '../stores/clipper'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/auth' },
    { path: '/auth', name: 'auth', component: AuthView, meta: { title: 'Auth' } },
    { path: '/privacy-policy', name: 'privacy-policy', component: PrivacyPolicyView, meta: { title: 'Privacy Policy' } },
    { path: '/terms-of-service', name: 'terms-of-service', component: TermsOfServiceView, meta: { title: 'Terms of Service' } },
    { path: '/daftar', name: 'register', component: RegisterView, meta: { title: 'Daftar' } },
    { path: '/menunggu-persetujuan', name: 'pending-approval', component: PendingApprovalView, meta: { title: 'Status Pendaftaran' } },
    { path: '/lupa-password', name: 'forgot-password', component: ForgotPasswordView, meta: { title: 'Lupa Password' } },
    { path: '/onboarding', name: 'onboarding', component: OnboardingView, meta: { title: 'Setup Akun' } },
    { path: '/peninjauan-akun', redirect: '/onboarding' },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { title: 'Dashboard' } },
    { path: '/dashboard-admin', redirect: '/admin/dashboard' },
    { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboardView, meta: { title: 'Dashboard' } },
    { path: '/admin/campaigns', name: 'admin-campaigns', component: AdminCampaignsView, meta: { title: 'Kelola Campaign' } },
    { path: '/admin/campaigns/create', name: 'admin-campaign-create', component: AdminCampaignCreateView, meta: { title: 'Tambah Campaign' } },
    { path: '/admin/campaigns/:id/edit', name: 'admin-campaign-edit', component: AdminCampaignEditView, meta: { title: 'Edit Campaign' } },
    { path: '/admin/submissions', name: 'admin-submissions', component: AdminSubmissionsView, meta: { title: 'Review Submission' } },
    { path: '/admin/creators', name: 'admin-creators', component: AdminCreatorsView, meta: { title: 'Kelola Creator' } },
    { path: '/admin/creators/create', name: 'admin-creator-create', component: AdminCreatorCreateView, meta: { title: 'Tambah Creator' } },
    { path: '/admin/creators/invite', name: 'admin-creator-invite', component: AdminCreatorInviteView, meta: { title: 'Undang Creator' } },
    { path: '/admin/creators/:id/edit', name: 'admin-creator-edit', component: AdminCreatorEditView, meta: { title: 'Edit Creator' } },
    { path: '/admin/payouts', name: 'admin-payouts', component: AdminPayoutsView, meta: { title: 'Payout' } },
    { path: '/admin/tickets', name: 'admin-tickets', component: AdminTicketsView, meta: { title: 'Log Tiket' } },
    { path: '/admin/courses', name: 'admin-courses', component: AdminCoursesView, meta: { title: 'Kelola Course Gratis' } },
    { path: '/admin/courses/create', name: 'admin-course-create', component: AdminCourseCreateView, meta: { title: 'Tambah Course' } },
    { path: '/admin/courses/:id/edit', name: 'admin-course-edit', component: AdminCourseEditView, meta: { title: 'Edit Course' } },
    { path: '/admin/profile', name: 'admin-profile', component: ProfileView, meta: { title: 'Profile' } },
    { path: '/payment', name: 'payment', component: PaymentView, meta: { title: 'Pendapatan' } },
    { path: '/pendapatan', name: 'income', component: IncomeView, meta: { title: 'Pendapatan' } },
    { path: '/campaigns', name: 'campaigns', component: CampaignsView, meta: { title: 'Campaigns' } },
    { path: '/campaigns/:slug', name: 'campaign-detail', component: CampaignDetailView, meta: { title: 'Campaign Detail' } },
    { path: '/pengguna', redirect: '/top-leaderboard' },
    { path: '/top-leaderboard', name: 'users', component: UsersView, meta: { title: 'Top Leaderboard' } },
    { path: '/course-gratis', name: 'courses', component: CoursesView, meta: { title: 'Course Gratis' } },
    { path: '/course-gratis/:id', name: 'course-detail', component: CourseDetailView, meta: { title: 'Course Detail' } },
    { path: '/course-gratis/:id/watch', name: 'course-watch', component: CourseWatchView, meta: { title: 'Putar Course' } },
    { path: '/hubungi-admin', name: 'contact', component: ContactAdminView, meta: { title: 'Hubungi Admin' } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { title: 'Profile' } },
    { path: '/social-accounts/create', name: 'social-account-create', component: SocialAccountCreateView, meta: { title: 'Tambah Creator' } },
    { path: '/announcement', name: 'announcements', component: AnnouncementsView, meta: { title: 'FAQ & Peraturan' } },
    { path: '/logout', name: 'logout', component: LogoutView, meta: { title: 'Logout' } },
  ],
})

router.beforeEach(async (to) => {
  const publicRoutes = ['auth', 'register', 'forgot-password', 'privacy-policy', 'terms-of-service', 'logout']
  const store = useClipperStore()

  if (!store.token) {
    return publicRoutes.includes(String(to.name)) ? true : { name: 'auth' }
  }

  if (publicRoutes.includes(String(to.name))) {
    return true
  }

  if (!store.user) {
    await store.loadMe()
  }

  const isPendingCreator = store.user?.role === 'creator' && String(store.user.status || '').toLowerCase() !== 'active'

  if (isPendingCreator) {
    return to.name === 'pending-approval' ? true : { name: 'pending-approval' }
  }

  if (to.name === 'pending-approval') {
    return { name: store.user?.role === 'brand' ? 'admin-dashboard' : 'dashboard' }
  }

  if (store.user?.role === 'creator' && !store.user.onboarding_completed && to.name !== 'onboarding') {
    return { name: 'onboarding' }
  }

  if (store.user?.onboarding_completed && to.name === 'onboarding') {
    return { name: 'dashboard' }
  }

  return true
})

export default router
