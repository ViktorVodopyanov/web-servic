import { defineConfig } from '@umijs/max';

export default defineConfig({
    antd: {},

    request: {
        dataField: '',
    },

    access: {},
    initialState: {},
    model: {},

    npmClient: 'npm',

    routes: [
        { path: '/login', component: './login', layout: false },
        { path: '/register', component: './register', layout: false },

        { path: '/', component: './index' },
        { path: '/about', component: './about' },
        { path: '/courses', component: './courses' },
        { path: '/feedback', component: './feedback' },

        {
            path: '/students',
            component: './students',
            access: 'canAccessProtected',
        },
        {
            path: '/teachers',
            component: './teachers',
            access: 'canAccessProtected',
        },
        {
            path: '/courses/:courseId/students',
            component: './students',
            access: 'canAccessProtected',
        },
    ],
});