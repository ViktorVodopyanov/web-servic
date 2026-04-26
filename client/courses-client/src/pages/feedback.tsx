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

const { TextArea } = Input;

interface Feedback {
    id: number;
    name: string;
    email: string;
    text: string;
}

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [countText, setCountText] = useState('Количество обращений: 0');
    const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setCountText(`Количество обращений: ${feedbacks.length}`);
    }, [feedbacks]);

    const sendFeedback = (values: {
        name: string;
        email: string;
        text: string;
    }) => {
        const newFeedback: Feedback = {
            id: Date.now(),
            name: values.name,
            email: values.email,
            text: values.text,
        };

        setFeedbacks([...feedbacks, newFeedback]);
        setLastFeedback(newFeedback);
        setOpen(true);
        form.resetFields();

        message.success('Обращение добавлено');
    };

    const deleteFeedback = (id: number) => {
        setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
        message.success('Обращение удалено');
    };

    return (
        <Card title="Обратная связь">
            <Typography.Paragraph>
                Данные хранятся только в состоянии клиентского приложения.
            </Typography.Paragraph>

            <Typography.Text strong>{countText}</Typography.Text>

            <Form
                form={form}
                layout="vertical"
                onFinish={sendFeedback}
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    name="name"
                    label="Имя"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Введите email' },
                        { type: 'email', message: 'Введите корректный email' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="text"
                    label="Сообщение"
                    rules={[{ required: true, message: 'Введите сообщение' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Отправить
                    </Button>
                </Form.Item>
            </Form>

            <Table
                style={{ marginTop: 20 }}
                rowKey="id"
                dataSource={feedbacks}
                pagination={{ pageSize: 5 }}
                columns={[
                    { title: 'Имя', dataIndex: 'name' },
                    { title: 'Email', dataIndex: 'email' },
                    { title: 'Сообщение', dataIndex: 'text' },
                    {
                        title: 'Действия',
                        render: (_, record: Feedback) => (
                            <Space>
                                <Popconfirm
                                    title="Удалить обращение?"
                                    okText="Да"
                                    cancelText="Нет"
                                    onConfirm={() => deleteFeedback(record.id)}
                                >
                                    <Button danger>Удалить</Button>
                                </Popconfirm>
                            </Space>
                        ),
                    },
                ]}
            />

            <Modal
                title="Введённые данные"
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
            >
                {lastFeedback && (
                    <>
                        <Typography.Paragraph>
                            <Typography.Text strong>Имя:</Typography.Text> {lastFeedback.name}
                        </Typography.Paragraph>

                        <Typography.Paragraph>
                            <Typography.Text strong>Email:</Typography.Text> {lastFeedback.email}
                        </Typography.Paragraph>

                        <Typography.Paragraph>
                            <Typography.Text strong>Сообщение:</Typography.Text> {lastFeedback.text}
                        </Typography.Paragraph>
                    </>
                )}
            </Modal>
        </Card>
    );
}