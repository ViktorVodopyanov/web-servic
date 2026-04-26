import { history } from '@umijs/max';
import { getCurrentUser } from '@/services/auth';

export async function getInitialState(): Promise<{
    currentUser?: {
        userName: string;
    };
}> {
    const token = localStorage.getItem('token');

    if (!token) {
        return {};
    }

    try {
        const currentUser = await getCurrentUser();

        return {
            currentUser,
        };
    } catch {
        localStorage.removeItem('token');
        return {};
    }
}

export function onRouteChange({ location }: any) {
    const token = localStorage.getItem('token');

    const protectedPages = [
        '/students',
        '/teachers',
    ];

    const isStudentsByCourse =
        location.pathname.startsWith('/courses/') &&
        location.pathname.endsWith('/students');

    const isProtected =
        protectedPages.includes(location.pathname) || isStudentsByCourse;

    if (isProtected && !token) {
        history.push('/login');
    }
}

export const request = {
    requestInterceptors: [
        (config: any) => {
            const token = localStorage.getItem('token');

            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }

            return config;
        },
    ],

    errorConfig: {
        errorHandler(error: any) {
            if (error?.response?.status === 401) {
                localStorage.removeItem('token');
                history.push('/login');
            }

            throw error;
        },
    },
};