import { request } from 'umi';

const API = '/api';

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

export const getTeachers = () =>
    request<Teacher[]>(`${API}/Teachers`);

export const createTeacher = (data: Omit<Teacher, 'id'>) =>
    request<Teacher>(`${API}/Teachers`, {
        method: 'POST',
        data,
    });

export const updateTeacher = (id: number, data: Omit<Teacher, 'id'>) =>
    request<Teacher>(`${API}/Teachers/${id}`, {
        method: 'PUT',
        data,
    });

export const deleteTeacher = (id: number) =>
    request(`${API}/Teachers/${id}`, {
        method: 'DELETE',
    });

export const getCourses = () =>
    request<Course[]>(`${API}/Courses`);

export const createCourse = (data: Omit<Course, 'id'>) =>
    request<Course>(`${API}/Courses`, {
        method: 'POST',
        data,
    });

export const updateCourse = (id: number, data: Omit<Course, 'id'>) =>
    request<Course>(`${API}/Courses/${id}`, {
        method: 'PUT',
        data,
    });

export const deleteCourse = (id: number) =>
    request(`${API}/Courses/${id}`, {
        method: 'DELETE',
    });

export const getStudents = () =>
    request<Student[]>(`${API}/Students`);

export const getStudentsByCourse = (courseId: number) =>
    request<Student[]>(`${API}/Students/course/${courseId}`);

export const createStudent = (data: Omit<Student, 'id'>) =>
    request<Student>(`${API}/Students`, {
        method: 'POST',
        data,
    });

export const updateStudent = (id: number, data: Omit<Student, 'id'>) =>
    request<Student>(`${API}/Students/${id}`, {
        method: 'PUT',
        data,
    });

export const deleteStudent = (id: number) =>
    request(`${API}/Students/${id}`, {
        method: 'DELETE',
    });

export const createFeedback = (data: Omit<Feedback, 'id' | 'createdAt'>) =>
    request<Feedback>(`${API}/Feedbacks`, {
        method: 'POST',
        data,
    });