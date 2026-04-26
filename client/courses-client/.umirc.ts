import { defineConfig } from '@umijs/max';

export default defineConfig({
    antd: {},

    request: {
        dataField: '',
    },

    npmClient: 'npm',

    routes: [
        { path: '/', component: './index' },
        { path: '/courses', component: './courses' },
        { path: '/courses/:courseId/students', component: './students' },
        { path: '/students', component: './students' },
        { path: '/teachers', component: './teachers' },
        { path: '/about', component: './about' },
        { path: '/feedback', component: './feedback' },
    ],
});