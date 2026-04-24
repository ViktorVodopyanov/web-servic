import { defineConfig } from 'umi';

export default defineConfig({
    npmClient: 'npm',
    routes: [
        { path: '/', component: './index' },
        { path: '/about', component: './about' },
        { path: '/courses', component: './courses' },
        { path: '/teachers', component: './teachers' },
    ],
});