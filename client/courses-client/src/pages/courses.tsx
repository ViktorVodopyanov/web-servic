import { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Space,
    Table,
    Typography,
    message,
} from 'antd';

interface Course {
    id: number;
    title: string;
    duration: number;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [countText, setCountText] = useState('Количество курсов: 0');
    const [open, setOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        setCountText(`Количество курсов: ${courses.length}`);
    }, [courses]);

    const saveCourse = async () => {
        const values = await form.validateFields();

        if (editingCourse) {
            setCourses(
                courses.map((course) =>
                    course.id === editingCourse.id
                        ? { ...course, ...values }
                        : course,
                ),
            );
            message.success('Курс обновлён');
        } else {
            const newCourse: Course = {
                id: Date.now(),
                title: values.title,
                duration: values.duration,
            };

            setCourses([...courses, newCourse]);
            message.success('Курс добавлен');
        }

        setOpen(false);
        setEditingCourse(null);
        form.resetFields();
    };

    const deleteCourse = (id: number) => {
        setCourses(courses.filter((course) => course.id !== id));
        message.success('Курс удалён');
    };

    return (
        <Card
            title="Курсы"
            extra={
                <Button
                    type="primary"
                    onClick={() => {
                        setEditingCourse(null);
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
                dataSource={courses}
                pagination={{ pageSize: 5 }}
                columns={[
                    { title: 'ID', dataIndex: 'id' },
                    { title: 'Название', dataIndex: 'title' },
                    {
                        title: 'Длительность',
                        dataIndex: 'duration',
                        render: (duration: number) => `${duration} ч.`,
                    },
                    {
                        title: 'Действия',
                        render: (_, record: Course) => (
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

                                <Popconfirm
                                    title="Удалить курс?"
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
                </Form>
            </Modal>
        </Card>
    );
}