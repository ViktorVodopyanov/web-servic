import { useEffect, useState } from 'react';
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

interface Student {
    id: number;
    name: string;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [countText, setCountText] = useState('Количество студентов: 0');
    const [form] = Form.useForm();

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
        setStudents(students.filter((student) => student.id !== id));
        message.success('Студент удалён');
    };

    return (
        <Card title="Список студентов">
            <Typography.Paragraph>
                Данные хранятся в состоянии компонента с помощью useState.
            </Typography.Paragraph>

            <Typography.Text strong>{countText}</Typography.Text>

            <Form
                form={form}
                layout="inline"
                onFinish={addStudent}
                style={{ marginTop: 20, marginBottom: 20 }}
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Введите имя студента' }]}
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
                    { title: 'Имя студента', dataIndex: 'name' },
                    {
                        title: 'Действия',
                        render: (_, record: Student) => (
                            <Space>
                                <Popconfirm
                                    title="Удалить студента?"
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