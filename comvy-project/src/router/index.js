// Composables
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/:id?',
        props: true,
        name: 'Home Configurator',
        component: () => import('@/views/FeatureModelSoloConfigurator.vue'),
    },
    {
        path: '/configurator/:productLineName',
        name: 'Configurator',
        props: true,
        component: () => import('@/views/FeatureModelConfiguration.vue'),
        meta: {
            title: 'Feature Model Configurator',
        },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
