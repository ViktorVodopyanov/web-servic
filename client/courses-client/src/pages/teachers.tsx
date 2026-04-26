import { useEffect, useMemo, useState } from 'react';
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
import {
    Teacher,
    createTeacher,
    deleteTeacher,
    getTeachers,
    updateTeacher,
} from '@/services/api';

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const loadTeachers = async () => {
        try {
            setLoading(true);
            const data = await getTeachers();
            setTeachers(data);
        } catch {
            message.error('Ошибка загрузки преподавателей');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeachers();
    }, []);

    const filteredTeachers = useMemo(() => {
        return teachers.filter((teacher) =>
            teacher.name.toLowerCase().includes(filter.toLowerCase()),
        );
    }, [teachers, filter]);

    const saveTeacher = async () => {
        const values = await form.validateFields();

        try {
            if (editingTeacher) {
                await updateTeacher(editingTeacher.id, values);
                message.success('Преподаватель обновлён');
            } else {
                await createTeacher(values);
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

    const removeTeacher = async (id: number) => {
        try {
            await deleteTeacher(id);
            message.success('Преподаватель удалён');
            loadTeachers();
        } catch {
            message.error('Нельзя удалить преподавателя, если у него есть курсы');
        }
    };

    return (
        <Card
            title={<Typography.Title level={3} style={{ margin: 0 }}>Преподаватели</Typography.Title>}
            extra={
                <Button
                    type="primary"
                    onClick={() => {
                        setEditingTeacher(null);
                        form.resetFields();
                        setOpen(true);
                    }}
                >
                    Добавить преподавателя
                </Button>
            }
            bordered={false}
        >
            <Input.Search
                placeholder="Фильтр по ФИО"
                allowClear
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ maxWidth: 400, marginBottom: 20 }}
            />

            <Table
                rowKey="id"
                bordered
                loading={loading}
                dataSource={filteredTeachers}
                pagination={{ pageSize: 5 }}
                columns={[
                    { title: 'ID', dataIndex: 'id', width: 80 },
                    { title: 'ФИО', dataIndex: 'name' },
                    { title: 'Кафедра', dataIndex: 'department' },
                    {
                        title: 'Действия',
                        width: 240,
                        render: (_, record: Teacher) => (
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setEditingTeacher(record);
                                        form.setFieldsValue(record);
                                        setOpen(true);
                                    }}
                                >
                                    Изменить
                                </Button>

                                <Popconfirm
                                    title="Удалить преподавателя?"
                                    okText="Да"
                                    cancelText="Нет"
                                    onConfirm={() => removeTeacher(record.id)}
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
                        <Input placeholder="Иванов Иван Иванович" />
                    </Form.Item>

                    <Form.Item
                        name="department"
                        label="Кафедра"
                        rules={[{ required: true, message: 'Введите кафедру' }]}
                    >
                        <Input placeholder="Информатика" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}