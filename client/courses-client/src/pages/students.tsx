import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    Popconfirm,
    Space,
    Table,
    Typography,
    message,
} from 'antd';

// 👉 РАСКОММЕНТИРОВАТЬ ЕСЛИ НУЖЕН API
// import { api, Student } from '@/services/api';

interface Student {
    id: number;
    name: string;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [countText, setCountText] = useState('Количество студентов: 0');
    const [form] = Form.useForm();

    // useEffect
    useEffect(() => {
        setCountText(`Количество студентов: ${students.length}`);
    }, [students]);

    const addStudent = (values: { name: string }) => {
        const newStudent: Student = {
            id: Date.now(),
            name: values.name,
        };

        setStudents([...students, newStudent]);
        form.resetFields();
        message.success('Студент добавлен');
    };

    const deleteStudent = (id: number) => {
        setStudents(students.filter((s) => s.id !== id));
        message.success('Студент удалён');
    };

    // API ВЕРСИЯ (НЕ ИСПОЛЬЗУЕТСЯ В ЗАДАНИИ)
    /*
    // загрузка студентов
    const loadStudents = async () => {
      const response = await api.get<Student[]>('/Students');
      setStudents(response.data);
    };
  
    useEffect(() => {
      loadStudents();
    }, []);
  
    // добавление через API
    const addStudent = async (values: { name: string }) => {
      await api.post('/Students', values);
      loadStudents();
    };
  
    // удаление через API
    const deleteStudent = async (id: number) => {
      await api.delete(`/Students/${id}`);
      loadStudents();
    };
    */

    // =========================

    return (
        <Card title="Список студентов" bordered={false}>
            <Typography.Text strong>{countText}</Typography.Text>

            <Form
                form={form}
                layout="inline"
                onFinish={addStudent}
                style={{ marginTop: 20, marginBottom: 20 }}
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <Input placeholder="Имя студента" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Добавить
                    </Button>
                </Form.Item>
            </Form>

            <Table
                rowKey="id"
                dataSource={students}
                pagination={{ pageSize: 5 }}
                columns={[
                    { title: 'ID', dataIndex: 'id' },
                    { title: 'Имя', dataIndex: 'name' },
                    {
                        title: 'Действия',
                        render: (_, record) => (
                            <Space>
                                <Popconfirm
                                    title="Удалить?"
                                    okText="Да"
                                    cancelText="Нет"
                                    onConfirm={() => deleteStudent(record.id)}
                                >
                                    <Button danger>Удалить</Button>
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
            />
        </Card>
    );
}