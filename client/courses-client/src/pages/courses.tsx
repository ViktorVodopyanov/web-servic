import { useEffect, useMemo, useRef, useState } from 'react';
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
import { Link } from '@umijs/max';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

import {
    Course,
    Teacher,
    Student,
    createCourse,
    deleteCourse,
    getCourses,
    getTeachers,
    getStudents,
    updateCourse,
} from '@/services/api';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    const chartRef = useRef<HTMLDivElement>(null);

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

    const loadStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch {
            message.error('Ошибка загрузки студентов');
        }
    };

    useEffect(() => {
        loadCourses();
        loadTeachers();
        loadStudents();
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

    const getStudentsCount = (courseId: number) => {
        return students.filter((student) => student.courseId === courseId).length;
    };

    const chartData = useMemo(() => {
        return filteredCourses.map((course) => ({
            name: course.title,
            studentsCount: getStudentsCount(course.id),
        }));
    }, [filteredCourses, students]);

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Курсы');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Название курса', key: 'title', width: 30 },
            { header: 'Длительность, часов', key: 'duration', width: 22 },
            { header: 'Преподаватель', key: 'teacher', width: 30 },
            { header: 'Количество студентов', key: 'studentsCount', width: 25 },
        ];

        filteredCourses.forEach((course) => {
            worksheet.addRow({
                id: course.id,
                title: course.title,
                duration: `${course.duration} ч.`,
                teacher: getTeacherName(course.teacherId),
                studentsCount: getStudentsCount(course.id),
            });
        });

        worksheet.getRow(1).font = { bold: true };

        if (chartRef.current) {
            const canvas = await html2canvas(chartRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
            });

            const imageBase64 = canvas.toDataURL('image/png').split(',')[1];

            const imageId = workbook.addImage({
                base64: imageBase64,
                extension: 'png',
            });

            const startRow = filteredCourses.length + 4;

            worksheet.addRow([]);
            worksheet.addRow(['График количества студентов на каждом курсе']);

            worksheet.addImage(imageId, {
                tl: { col: 0, row: startRow },
                ext: { width: 750, height: 350 },
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();

        saveAs(
            new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            'courses.xlsx',
        );

        message.success('Excel-файл с графиком сформирован');
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
            loadStudents();
        } catch {
            message.error('Ошибка сохранения курса');
        }
    };

    const removeCourse = async (id: number) => {
        try {
            await deleteCourse(id);
            message.success('Курс удалён');

            loadCourses();
            loadStudents();
        } catch {
            message.error('Нельзя удалить курс, если на нём есть студенты');
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card
                title={
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Курсы
                    </Typography.Title>
                }
                extra={
                    <Space>
                        <Button onClick={exportToExcel}>
                            Экспорт в Excel
                        </Button>

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
                    </Space>
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
                            title: 'Количество студентов',
                            render: (_, record: Course) => getStudentsCount(record.id),
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
            </Card>

            <Card title="Количество студентов на каждом курсе" bordered={false}>
                <div
                    ref={chartRef}
                    style={{
                        width: '100%',
                        height: 350,
                        background: '#ffffff',
                        padding: 12,
                    }}
                >
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar
                                dataKey="studentsCount"
                                name="Количество студентов"
                                fill="#69c0ff"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

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
        </Space>
    );
}