import { useEffect, useMemo, useState } from 'react';
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
import { Link } from 'umi';
import {
    Course,
    Teacher,
    createCourse,
    deleteCourse,
    getCourses,
    getTeachers,
    updateCourse,
} from '@/services/api';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await getCourses();
            setCourses(data);
        } catch {
            message.error('Ошибка загрузки курсов');
        } finally {
            setLoading(false);
        }
    };

    const loadTeachers = async () => {
        try {
            const data = await getTeachers();
            setTeachers(data);
        } catch {
            message.error('Ошибка загрузки преподавателей');
        }
    };

    useEffect(() => {
        loadCourses();
        loadTeachers();
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) =>
            course.title.toLowerCase().includes(filter.toLowerCase()),
        );
    }, [courses, filter]);

    const getTeacherName = (teacherId: number) => {
        const teacher = teachers.find((item) => item.id === teacherId);
        return teacher ? teacher.name : 'Не найден';
    };

    const saveCourse = async () => {
        const values = await form.validateFields();

        try {
            if (editingCourse) {
                await updateCourse(editingCourse.id, values);
                message.success('Курс обновлён');
            } else {
                await createCourse(values);
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

    const removeCourse = async (id: number) => {
        try {
            await deleteCourse(id);
            message.success('Курс удалён');
            loadCourses();
        } catch {
            message.error('Нельзя удалить курс, если на нём есть студенты');
        }
    };

    return (
        <Card
            title={<Typography.Title level={3} style={{ margin: 0 }}>Курсы</Typography.Title>}
            extra={
                <Button
                    type="primary"
                    onClick={() => {
                        setEditingCourse(null);
                        form.resetFields();
                        setOpen(true);
                    }}
                >
                    Добавить курс
                </Button>
            }
            bordered={false}
        >
            <Input.Search
                placeholder="Фильтр по названию курса"
                allowClear
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ maxWidth: 400, marginBottom: 20 }}
            />

            <Table
                rowKey="id"
                bordered
                loading={loading}
                dataSource={filteredCourses}
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
                        title: 'Студенты',
                        render: (_, record: Course) => (
                            <Link to={`/courses/${record.id}/students`}>
                                Открыть студентов
                            </Link>
                        ),
                    },
                    {
                        title: 'Действия',
                        width: 240,
                        render: (_, record: Course) => (
                            <Space>
                                <Button
                                    type="primary"
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
                                    onConfirm={() => removeCourse(record.id)}
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
                        <Input placeholder="Основы программирования" />
                    </Form.Item>

                    <Form.Item
                        name="duration"
                        label="Длительность, часов"
                        rules={[{ required: true, message: 'Введите длительность курса' }]}
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