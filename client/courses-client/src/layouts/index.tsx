import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={[
                        { key: '/', label: <Link to="/">Главная</Link> },
                        { key: '/courses', label: <Link to="/courses">Курсы</Link> },
                        { key: '/teachers', label: <Link to="/teachers">Преподаватели</Link> },
                        { key: '/students', label: <Link to="/students">Список студентов</Link> },
                        { key: '/feedback', label: <Link to="/feedback">Обратная связь</Link> },
                        { key: '/about', label: <Link to="/about">О программе</Link> },
                    ]}
                />
            </Header>

            <Content style={{ padding: 24 }}>
                <Outlet />
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                <Typography.Text>
                    Каталог курсов и преподавателей © 2026
                </Typography.Text>
            </Footer>
        </Layout>
    );
}