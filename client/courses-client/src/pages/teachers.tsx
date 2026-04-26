import { useEffect, useState } from 'react';
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

interface Teacher {
    id: number;
    name: string;
    department: string;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [countText, setCountText] = useState('Количество преподавателей: 0');
    const [open, setOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        setCountText(`Количество преподавателей: ${teachers.length}`);
    }, [teachers]);

    const saveTeacher = async () => {
        const values = await form.validateFields();

        if (editingTeacher) {
            setTeachers(
                teachers.map((teacher) =>
                    teacher.id === editingTeacher.id
                        ? { ...teacher, ...values }
                        : teacher,
                ),
            );
            message.success('Преподаватель обновлён');
        } else {
            const newTeacher: Teacher = {
                id: Date.now(),
                name: values.name,
                department: values.department,
            };

            setTeachers([...teachers, newTeacher]);
            message.success('Преподаватель добавлен');
        }

        setOpen(false);
        setEditingTeacher(null);
        form.resetFields();
    };

    const deleteTeacher = (id: number) => {
        setTeachers(teachers.filter((teacher) => teacher.id !== id));
        message.success('Преподаватель удалён');
    };

    return (
        <Card
            title="Преподаватели"
            extra={
                <Button
                    type="primary"
                    onClick={() => {
                        setEditingTeacher(null);
                        form.resetFields();
                        setOpen(true);
                    }}
                >
                    Добавить
                </Button>
            }
        >
            <Typography.Text strong>{countText}</Typography.Text>

            <Table
                style={{ marginTop: 20 }}
                rowKey="id"
                dataSource={teachers}
                pagination={{ pageSize: 5 }}
                columns={[
                    { title: 'ID', dataIndex: 'id' },
                    { title: 'ФИО', dataIndex: 'name' },
                    { title: 'Кафедра', dataIndex: 'department' },
                    {
                        title: 'Действия',
                        render: (_, record: Teacher) => (
                            <Space>
                                <Button
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
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="ФИО"
                        rules={[{ required: true, message: 'Введите ФИО' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="department"
                        label="Кафедра"
                        rules={[{ required: true, message: 'Введите кафедру' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}