import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Typography,
    message,
} from 'antd';
import { api, Course, Teacher } from '@/services/api';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [open, setOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get<Course[]>('/Courses');
            setCourses(response.data);
        } catch {
            message.error('Ошибка загрузки курсов');
        } finally {
            setLoading(false);
        }
    };

    const loadTeachers = async () => {
        try {
            const response = await api.get<Teacher[]>('/Teachers');
            setTeachers(response.data);
        } catch {
            message.error('Ошибка загрузки преподавателей');
        }
    };

    useEffect(() => {
        loadCourses();
        loadTeachers();
    }, []);

    const getTeacherName = (teacherId: number) => {
        const teacher = teachers.find((item) => item.id === teacherId);
        return teacher ? teacher.name : 'Не найден';
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        form.resetFields();
        setOpen(true);
    };

    const openEditModal = (course: Course) => {
        setEditingCourse(course);
        form.setFieldsValue(course);
        setOpen(true);
    };

    const saveCourse = async () => {
        const values = await form.validateFields();

        try {
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
        } catch {
            message.error('Ошибка сохранения курса');
        }
    };

    const deleteCourse = async (id: number) => {
        try {
            await api.delete(`/Courses/${id}`);
            message.success('Курс удалён');
            loadCourses();
        } catch {
            message.error('Ошибка удаления курса');
        }
    };

    return (
        <Card
            title={
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Курсы
                </Typography.Title>
            }
            extra={
                <Button type="primary" onClick={openCreateModal}>
                    Добавить курс
                </Button>
            }
            bordered={false}
        >
            <Table
                rowKey="id"
                bordered
                loading={loading}
                dataSource={courses}
                pagination={{ pageSize: 5 }}
                columns={[
                    { title: 'ID', dataIndex: 'id', width: 80 },
                    { title: 'Название курса', dataIndex: 'title' },
                    {
                        title: 'Длительность',
                        dataIndex: 'duration',
                        render: (duration: number) => `${duration} ч.`,
                    },
                    {
                        title: 'Преподаватель',
                        dataIndex: 'teacherId',
                        render: (teacherId: number) => getTeacherName(teacherId),
                    },
                    {
                        title: 'Действия',
                        width: 220,
                        render: (_, record) => (
                            <Space>
                                <Button type="primary" onClick={() => openEditModal(record)}>
                                    Изменить
                                </Button>

                                <Popconfirm
                                    title="Удалить курс?"
                                    description="Вы уверены, что хотите удалить запись?"
                                    okText="Да"
                                    cancelText="Нет"
                                    onConfirm={() => deleteCourse(record.id)}
                                >
                                    <Button danger>Удалить</Button>
                                </Popconfirm>
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
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Название курса"
                        rules={[{ required: true, message: 'Введите название курса' }]}
                    >
                        <Input placeholder="Например: Основы программирования" />
                    </Form.Item>

                    <Form.Item
                        name="duration"
                        label="Длительность, часов"
                        rules={[{ required: true, message: 'Введите длительность курса' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="Например: 72" />
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