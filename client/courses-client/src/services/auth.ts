import { request } from 'umi';

const API = '/api';

export interface LoginData {
    login: string;
    password: string;
}

export interface RegisterData {
    login: string;
    password: string;
    userName: string;
}

export interface LoginResponse {
    token: string;
    userName: string;
}

export interface CurrentUser {
    userName: string;
}

export async function login(data: LoginData) {
    return request<LoginResponse>(`${API}/Auth/login`, {
        method: 'POST',
        data,
    });
}

export async function register(data: RegisterData) {
    return request<LoginResponse>(`${API}/Auth/register`, {
        method: 'POST',
        data,
    });
}

export async function getCurrentUser() {
    return request<CurrentUser>(`${API}/Auth/me`, {
        method: 'GET',
    });
}