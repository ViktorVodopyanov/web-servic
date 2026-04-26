import { history, Link, useModel } from '@umijs/max';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { getCurrentUser, login } from '@/services/auth';

export default function LoginPage() {
    const [form] = Form.useForm();
    const { setInitialState } = useModel('@@initialState');

    const onFinish = async (values: { login: string; password: string }) => {
        try {
            const response = await login(values);

            localStorage.setItem('token', response.token);

            const currentUser = await getCurrentUser();

            setInitialState({
                currentUser,
            });

            message.success('Вы успешно вошли в систему');

            history.push('/students');
        } catch {
            message.error('Неверный логин или пароль');
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f5f7fa',
            }}
        >
            <Card style={{ width: 380 }}>
                <Typography.Title level={3} style={{ textAlign: 'center' }}>
                    Авторизация
                </Typography.Title>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="login"
                        label="Логин"
                        rules={[{ required: true, message: 'Введите логин' }]}
                    >
                        <Input placeholder="Введите логин" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password placeholder="Введите пароль" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Войти
                    </Button>
                </Form>

                <Typography.Paragraph style={{ marginTop: 16, textAlign: 'center' }}>
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </Typography.Paragraph>
            </Card>
        </div>
    );
}