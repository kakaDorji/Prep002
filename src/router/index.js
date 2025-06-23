import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// Lazy load the components to optimize bundle size
const DashboardView = () => import('@/views/Dashboard/DashboardView.vue')
const LoginView = () => import('@/views/Auth/LoginView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')
const DashboardComponent = () => import('@/components/Dashboard/DashboardComponent.vue')
const StatsComponent = () => import('@/components/Dashboard/StatsComponent.vue')
const FormsComponent = () => import('@/components/Dashboard/FormsComponent.vue')
const Form1AnalyticsComponent = () => import('@/components/Dashboard/FormOneMonitorComponent.vue')
const Form5AnalyticsComponent = () => import('@/components/Dashboard/FormFiveMonitorComponent.vue')
const AddUserComponent = () => import('@/components/Dashboard/AddUserComponent.vue')
const UpdateUserComponent = () => import('@/components/Dashboard/UpdateUserComponent.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardComponent,
        },
        {
          path: 'stats',
          name: 'dashboard-stats',
          component: StatsComponent,
        },
        {
          path: 'forms',
          name: 'dashboard-forms',
          component: FormsComponent,
        },
        {
          path: 'analytics',
          name: 'dashboard-analytics',
          children: [
            {
              path: 'monitorview',
              name: 'analytics-monitorview',
              component: Form1AnalyticsComponent,
            },
            {
              path: 'unscheduleanalytics',
              name: 'analytics-unscheduleanalytics',
              component: Form5AnalyticsComponent,
            }
          ]
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          children: [
            {
              path: 'add-user',
              name: 'settings-add-user',
              component: AddUserComponent,
            },
            {
              path: 'update-user',
              name: 'settings-update-user',
              component: UpdateUserComponent,
            }
          ]
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

  if (to.meta.requiresAuth && !loggedInUser) {
    next('/login')
  } else if (to.meta.guestOnly && loggedInUser) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
