import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true }
      },
      // 病例管理路由
      {
        path: 'cases/register',
        name: 'CaseRegister',
        component: () => import('../views/cases/CaseRegister.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'cases/list',
        name: 'CaseList',
        component: () => import('../views/cases/CaseList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'cases/search',
        name: 'CaseSearch',
        component: () => import('../views/cases/CaseSearch.vue'),
        meta: { requiresAuth: true }
      },
      // 医生管理路由
      {
        path: 'doctors/list',
        name: 'DoctorList',
        component: () => import('../views/doctors/DoctorList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'doctors/add',
        name: 'DoctorAdd',
        component: () => import('../views/doctors/DoctorAdd.vue'),
        meta: { requiresAuth: true }
      },
      // 系统管理路由
      {
        path: 'system/dict',
        name: 'DictManagement',
        component: () => import('../views/system/DictManagement.vue'),
        meta: { requiresAuth: true }
      },
      // 病理管理路由
      {
        path: 'pathology',
        name: 'PathologyManagement',
        component: () => import('../views/pathology/PathologyManagement.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'pathology/collection',
        name: 'SpecimenCollection',
        component: () => import('../views/pathology/SpecimenCollection.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'pathology/diagnosis',
        name: 'PathologyDiagnosis',
        component: () => import('../views/pathology/PathologyDiagnosis.vue'),
        meta: { requiresAuth: true }
      },
      // 数据统计路由
      {
        path: 'statistics/cases',
        name: 'CaseStatistics',
        component: () => import('../views/statistics/CaseStatistics.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'statistics/doctors',
        name: 'DoctorStatistics',
        component: () => import('../views/statistics/DoctorStatistics.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫 - Token验证
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
