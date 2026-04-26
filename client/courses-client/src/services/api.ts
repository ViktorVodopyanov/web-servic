import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5231/api',
});

export interface Teacher {
    id: number;
    name: string;
    department: string;
}

export interface Course {
    id: number;
    title: string;
    duration: number;
    teacherId: number;
}

export interface Student {
    id: number;
    fullName: string;
    courseId: number;
}

export interface Feedback {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}