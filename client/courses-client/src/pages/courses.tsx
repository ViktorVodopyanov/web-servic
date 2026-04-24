import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    message,
} from 'antd';
import { api, Course, Teacher } from '@/services/api';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [open, setOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [form] = Form.useForm();

    const loadCourses = async () => {
        const response = await api.get<Course[]>('/Courses');
        setCourses(response.data);
    };

    const loadTeachers = async () => {
        const response = await api.get<Teacher[]>('/Teachers');
        setTeachers(response.data);
    };

    useEffect(() => {
        loadCourses();
        loadTeachers();
    }, []);

    const saveCourse = async () => {
        const values = await form.validateFields();

        if (editingCourse) {
            await api.put(`/Courses/${editingCourse.id}`, values);
            message.success('Курс обновлён');
        } else {
            await api.post('/Courses', values);
            message.success('Курс добавлен');
        }

        setOpen(false);
        setEditingCourse(null);
        form.resetFields();
        loadCourses();
    };

    const deleteCourse = async (id: number) => {
        await api.delete(`/Courses/${id}`);
        message.success('Курс удалён');
        loadCourses();
    };

    const getTeacherName = (teacherId: number) => {
        const teacher = teachers.find((t) => t.id === teacherId);
        return teacher ? teacher.name : 'Не найден';
    };

    return (
        <Card
            title="Курсы"
            extra={
                <Button type="primary" onClick={() => setOpen(true)}>
                    Добавить
                </Button>
            }
        >
            <Table
                rowKey="id"
                dataSource={courses}
                columns={[
                    { title: 'ID', dataIndex: 'id' },
                    { title: 'Название', dataIndex: 'title' },
                    { title: 'Длительность', dataIndex: 'duration' },
                    {
                        title: 'Преподаватель',
                        dataIndex: 'teacherId',
                        render: (teacherId: number) => getTeacherName(teacherId),
                    },
                    {
                        title: 'Действия',
                        render: (_, record) => (
                            <Space>
                                <Button
                                    onClick={() => {
                                        setEditingCourse(record);
                                        form.setFieldsValue(record);
                                        setOpen(true);
                                    }}
                                >
                                    Изменить
                                </Button>
                                <Button danger onClick={() => deleteCourse(record.id)}>
                                    Удалить
                                </Button>
                            </Space>
                        ),
                    },
                ]}
            />

            <Modal
                title={editingCourse ? 'Редактировать курс' : 'Добавить курс'}
                open={open}
                onOk={saveCourse}
                onCancel={() => {
                    setOpen(false);
                    setEditingCourse(null);
                    form.resetFields();
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Название курса"
                        rules={[{ required: true, message: 'Введите название курса' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="duration"
                        label="Длительность"
                        rules={[{ required: true, message: 'Введите длительность' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="teacherId"
                        label="Преподаватель"
                        rules={[{ required: true, message: 'Выберите преподавателя' }]}
                    >
                        <Select
                            placeholder="Выберите преподавателя"
                            options={teachers.map((teacher) => ({
                                value: teacher.id,
                                label: teacher.name,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}