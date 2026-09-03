import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import ReviewView from '../views/ReviewView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminCampaignsView from '../views/AdminCampaignsView.vue'
import AdminCampaignCreateView from '../views/AdminCampaignCreateView.vue'
import AdminCampaignEditView from '../views/AdminCampaignEditView.vue'
import AdminCreatorsView from '../views/AdminCreatorsView.vue'
import AdminCreatorCreateView from '../views/AdminCreatorCreateView.vue'
import AdminCreatorInviteView from '../views/AdminCreatorInviteView.vue'
import AdminPayoutsView from '../views/AdminPayoutsView.vue'
import AdminSubmissionsView from '../views/AdminSubmissionsView.vue'
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
import AnnouncementsView from '../views/AnnouncementsView.vue'
import LogoutView from '../views/LogoutView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/auth' },
    { path: '/auth', name: 'auth', component: AuthView, meta: { title: 'Auth' } },
    { path: '/peninjauan-akun', name: 'review', component: ReviewView, meta: { title: 'Peninjauan Akun' } },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { title: 'Dashboard' } },
    { path: '/dashboard-admin', redirect: '/admin/dashboard' },
    { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboardView, meta: { title: 'Dashboard Admin' } },
    { path: '/admin/campaigns', name: 'admin-campaigns', component: AdminCampaignsView, meta: { title: 'Kelola Campaign' } },
    { path: '/admin/campaigns/create', name: 'admin-campaign-create', component: AdminCampaignCreateView, meta: { title: 'Tambah Campaign' } },
    { path: '/admin/campaigns/:id/edit', name: 'admin-campaign-edit', component: AdminCampaignEditView, meta: { title: 'Edit Campaign' } },
    { path: '/admin/submissions', name: 'admin-submissions', component: AdminSubmissionsView, meta: { title: 'Review Submission' } },
    { path: '/admin/creators', name: 'admin-creators', component: AdminCreatorsView, meta: { title: 'Kelola Creator' } },
    { path: '/admin/creators/create', name: 'admin-creator-create', component: AdminCreatorCreateView, meta: { title: 'Tambah Creator' } },
    { path: '/admin/creators/invite', name: 'admin-creator-invite', component: AdminCreatorInviteView, meta: { title: 'Undang Creator' } },
    { path: '/admin/payouts', name: 'admin-payouts', component: AdminPayoutsView, meta: { title: 'Payout' } },
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
    { path: '/announcement', name: 'announcements', component: AnnouncementsView, meta: { title: 'Announcement' } },
    { path: '/logout', name: 'logout', component: LogoutView, meta: { title: 'Logout' } },
  ],
})

export default router
