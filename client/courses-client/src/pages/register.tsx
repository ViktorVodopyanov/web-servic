import { history, Link, useModel } from '@umijs/max';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { getCurrentUser, register } from '@/services/auth';

export default function RegisterPage() {
    const [form] = Form.useForm();
    const { setInitialState } = useModel('@@initialState');

    const onFinish = async (values: {
        userName: string;
        login: string;
        password: string;
    }) => {
        try {
            const response = await register(values);

            localStorage.setItem('token', response.token);

            const currentUser = await getCurrentUser();

            setInitialState({
                currentUser,
            });

            message.success('Регистрация выполнена');

            history.push('/students');
        } catch {
            message.error('Ошибка регистрации');
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f7fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card style={{ width: 400 }}>
                <Typography.Title level={3} style={{ textAlign: 'center' }}>
                    Регистрация
                </Typography.Title>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="userName"
                        label="Имя пользователя"
                        rules={[{ required: true, message: 'Введите имя' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="login"
                        label="Логин"
                        rules={[{ required: true, message: 'Введите логин' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Зарегистрироваться
                    </Button>
                </Form>

                <Typography.Paragraph style={{ marginTop: 16, textAlign: 'center' }}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </Typography.Paragraph>
            </Card>
        </div>
    );
}