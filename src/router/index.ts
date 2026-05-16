import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Main',
            component: () => import('../views/Main.vue')
        },
        {
            path: '/settings',
            name: 'Settings',
            component: () => import('../views/Settings.vue')
        },
        {
            path: '/levelSelect',
            name: 'LevelSelect',
            component: () => import('../views/LevelSelect.vue')
        },
        {
            path: '/levels',
            name: 'Levels',
            component: () => import('../views/Levels.vue')
        },
        {
            path: '/about',
            name: 'About',
            component: () => import('../views/About.vue')
        }
    ]
})

export default router;