import AdminComp from '@/components/AdminComp.vue';
import TaskComp from '@/components/TaskComp.vue';
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/tasks',
        component: TaskComp
    },
    {
        path: '/admin-page',
        component: AdminComp
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;