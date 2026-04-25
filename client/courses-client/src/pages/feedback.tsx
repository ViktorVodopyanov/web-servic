import React, { useState } from 'react';
import { Button, Card, Form, Input, Modal, Typography, message } from 'antd';
import { api } from '@/services/api';

const { TextArea } = Input;

export default function FeedbackPage() {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);

            const response = await api.post('/Feedbacks', values);

            setFormData(response.data);
            setOpen(true);
            form.resetFields();

            message.success('Обращение сохранено в базе данных');
        } catch {
            message.error('Ошибка при отправке обращения');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title={
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Обратная связь
                </Typography.Title>
            }
            bordered={false}
            style={{ maxWidth: 700, margin: '0 auto' }}
        >
            <Typography.Paragraph>
                Заполните форму ниже. После отправки данные будут сохранены в базе данных.
            </Typography.Paragraph>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Имя"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <Input placeholder="Введите ваше имя" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Электронная почта"
                    rules={[
                        { required: true, message: 'Введите электронную почту' },
                        { type: 'email', message: 'Введите корректный email' },
                    ]}
                >
                    <Input placeholder="example@mail.com" />
                </Form.Item>

                <Form.Item
                    name="message"
                    label="Сообщение"
                    rules={[{ required: true, message: 'Введите сообщение' }]}
                >
                    <TextArea rows={5} placeholder="Введите сообщение" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Отправить
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title="Обращение сохранено"
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                okText="ОК"
            >
                {formData && (
                    <>
                        <Typography.Paragraph>
                            <strong>Имя:</strong> {formData.name}
                        </Typography.Paragraph>

                        <Typography.Paragraph>
                            <strong>Email:</strong> {formData.email}
                        </Typography.Paragraph>

                        <Typography.Paragraph>
                            <strong>Сообщение:</strong> {formData.message}
                        </Typography.Paragraph>

                        <Typography.Paragraph>
                            <strong>Дата отправки:</strong> {formData.createdAt}
                        </Typography.Paragraph>
                    </>
                )}
            </Modal>
        </Card>
    );
}