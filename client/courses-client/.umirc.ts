import { defineConfig } from 'umi';

export default defineConfig({
    npmClient: 'npm',
    routes: [
        { path: '/', component: './index' },
        { path: '/courses', component: './courses' },
        { path: '/teachers', component: './teachers' },
        { path: '/students', component: './students' },
        { path: '/about', component: './about' },
        { path: '/feedback', component: './feedback' },
    ],
});