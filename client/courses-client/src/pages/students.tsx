import { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Typography,
    message,
} from 'antd';
import { Link, useParams } from 'umi';
import {
    Course,
    Student,
    createStudent,
    deleteStudent,
    getCourses,
    getStudents,
    getStudentsByCourse,
    updateStudent,
} from '@/services/api';

export default function StudentsPage() {
    const params = useParams();
    const courseId = params.courseId ? Number(params.courseId) : null;

    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const loadStudents = async () => {
        try {
            setLoading(true);

            const data = courseId
                ? await getStudentsByCourse(courseId)
                : await getStudents();

            setStudents(data);
        } catch {
            message.error('Ошибка загрузки студентов');
        } finally {
            setLoading(false);
        }
    };

    const loadCourses = async () => {
        try {
            const data = await getCourses();
            setCourses(data);
        } catch {
            message.error('Ошибка загрузки курсов');
        }
    };

    useEffect(() => {
        loadStudents();
        loadCourses();
    }, [courseId]);

    const filteredStudents = useMemo(() => {
        return students.filter((student) =>
            student.fullName.toLowerCase().includes(filter.toLowerCase()),
        );
    }, [students, filter]);

    const selectedCourse = courses.find((course) => course.id === courseId);

    const getCourseTitle = (currentCourseId: number) => {
        const course = courses.find((item) => item.id === currentCourseId);
        return course ? course.title : 'Курс не найден';
    };

    const saveStudent = async () => {
        const values = await form.validateFields();

        try {
            if (editingStudent) {
                await updateStudent(editingStudent.id, values);
                message.success('Студент обновлён');
            } else {
                await createStudent(values);
                message.success('Студент добавлен');
            }

            setOpen(false);
            setEditingStudent(null);
            form.resetFields();
            loadStudents();
        } catch {
            message.error('Ошибка сохранения студента');
        }
    };

    const removeStudent = async (id: number) => {
        try {
            await deleteStudent(id);
            message.success('Студент удалён');
            loadStudents();
        } catch {
            message.error('Ошибка удаления студента');
        }
    };

    return (
        <Card
            title={
                <Typography.Title level={3} style={{ margin: 0 }}>
                    {courseId ? 'Студенты курса' : 'Все студенты'}
                </Typography.Title>
            }
            extra={
                <Space>
                    {courseId && <Link to="/courses">Назад к курсам</Link>}
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingStudent(null);
                            form.resetFields();

                            if (courseId) {
                                form.setFieldsValue({ courseId });
                            }

                            setOpen(true);
                        }}
                    >
                        Добавить студента
                    </Button>
                </Space>
            }
            bordered={false}
        >
            {courseId && (
                <Typography.Paragraph>
                    Курс: <Typography.Text strong>{selectedCourse ? selectedCourse.title : `ID ${courseId}`}</Typography.Text>
                </Typography.Paragraph>
            )}

            <Typography.Paragraph>
                Количество записей: <Typography.Text strong>{students.length}</Typography.Text>
            </Typography.Paragraph>

            <Input.Search
                placeholder="Фильтр по ФИО студента"
                allowClear
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ maxWidth: 400, marginBottom: 20 }}
            />

            <Table
                rowKey="id"
                bordered
                loading={loading}
                dataSource={filteredStudents}
                pagination={{ pageSize: 5 }}
                columns={[
                    { title: 'ID', dataIndex: 'id', width: 80 },
                    { title: 'ФИО студента', dataIndex: 'fullName' },
                    {
                        title: 'Курс',
                        dataIndex: 'courseId',
                        render: (currentCourseId: number) => getCourseTitle(currentCourseId),
                    },
                    {
                        title: 'Действия',
                        width: 240,
                        render: (_, record: Student) => (
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setEditingStudent(record);
                                        form.setFieldsValue(record);
                                        setOpen(true);
                                    }}
                                >
                                    Изменить
                                </Button>

                                <Popconfirm
                                    title="Удалить студента?"
                                    okText="Да"
                                    cancelText="Нет"
                                    onConfirm={() => removeStudent(record.id)}
                                >
                                    <Button danger>Удалить</Button>
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
            />

            <Modal
                title={editingStudent ? 'Редактировать студента' : 'Добавить студента'}
                open={open}
                onOk={saveStudent}
                onCancel={() => {
                    setOpen(false);
                    setEditingStudent(null);
                    form.resetFields();
                }}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="ФИО студента"
                        rules={[{ required: true, message: 'Введите ФИО студента' }]}
                    >
                        <Input placeholder="Иванов Иван Иванович" />
                    </Form.Item>

                    <Form.Item
                        name="courseId"
                        label="Курс"
                        rules={[{ required: true, message: 'Выберите курс' }]}
                    >
                        <Select
                            disabled={!!courseId}
                            placeholder="Выберите курс"
                            options={courses.map((course) => ({
                                value: course.id,
                                label: course.title,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}