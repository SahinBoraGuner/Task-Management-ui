import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import DashboardComp from '@/components/DashboardComp.vue';
import TaskListComp from '@/components/TaskListComp.vue';
import AdminComp from '@/components/AdminComp.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardComp
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: TaskListComp
      },
      {
        path: 'admin-page',
        name: 'admin-page',
        component: AdminComp
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;