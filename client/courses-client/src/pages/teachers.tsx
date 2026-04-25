import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    Modal,
    Popconfirm,
    Space,
    Table,
    Typography,
    message,
} from 'antd';
import { api, Teacher } from '@/services/api';

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [open, setOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const loadTeachers = async () => {
        try {
            setLoading(true);
            const response = await api.get<Teacher[]>('/Teachers');
            setTeachers(response.data);
        } catch {
            message.error('Ошибка загрузки преподавателей');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeachers();
    }, []);

    const openCreateModal = () => {
        setEditingTeacher(null);
        form.resetFields();
        setOpen(true);
    };

    const openEditModal = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        form.setFieldsValue(teacher);
        setOpen(true);
    };

    const saveTeacher = async () => {
        const values = await form.validateFields();

        try {
            if (editingTeacher) {
                await api.put(`/Teachers/${editingTeacher.id}`, values);
                message.success('Преподаватель обновлён');
            } else {
                await api.post('/Teachers', values);
                message.success('Преподаватель добавлен');
            }

            setOpen(false);
            setEditingTeacher(null);
            form.resetFields();
            loadTeachers();
        } catch {
            message.error('Ошибка сохранения преподавателя');
        }
    };

    const deleteTeacher = async (id: number) => {
        try {
            await api.delete(`/Teachers/${id}`);
            message.success('Преподаватель удалён');
            loadTeachers();
        } catch {
            message.error('Нельзя удалить преподавателя, если у него есть курсы');
        }
    };

    return (
        <Card
            title={
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Преподаватели
                </Typography.Title>
            }
            extra={
                <Button type="primary" onClick={openCreateModal}>
                    Добавить преподавателя
                </Button>
            }
            bordered={false}
        >
            <Table
                rowKey="id"
                bordered
                loading={loading}
                dataSource={teachers}
                pagination={{ pageSize: 5 }}
                columns={[
                    { title: 'ID', dataIndex: 'id', width: 80 },
                    { title: 'ФИО', dataIndex: 'name' },
                    { title: 'Кафедра', dataIndex: 'department' },
                    {
                        title: 'Действия',
                        width: 220,
                        render: (_, record) => (
                            <Space>
                                <Button type="primary" onClick={() => openEditModal(record)}>
                                    Изменить
                                </Button>

                                <Popconfirm
                                    title="Удалить преподавателя?"
                                    description="Вы уверены, что хотите удалить запись?"
                                    okText="Да"
                                    cancelText="Нет"
                                    onConfirm={() => deleteTeacher(record.id)}
                                >
                                    <Button danger>Удалить</Button>
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
            />

            <Modal
                title={editingTeacher ? 'Редактировать преподавателя' : 'Добавить преподавателя'}
                open={open}
                onOk={saveTeacher}
                onCancel={() => {
                    setOpen(false);
                    setEditingTeacher(null);
                    form.resetFields();
                }}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="ФИО"
                        rules={[{ required: true, message: 'Введите ФИО преподавателя' }]}
                    >
                        <Input placeholder="Например: Иванов Иван Иванович" />
                    </Form.Item>

                    <Form.Item
                        name="department"
                        label="Кафедра"
                        rules={[{ required: true, message: 'Введите кафедру' }]}
                    >
                        <Input placeholder="Например: Информатика" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}