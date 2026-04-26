import { Link, Outlet, useLocation } from 'umi';
import { Layout, Menu, Typography } from 'antd';
import {
    HomeOutlined,
    BookOutlined,
    TeamOutlined,
    InfoCircleOutlined,
    MessageOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
    const location = useLocation();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Typography.Title level={4} style={{ color: 'white', margin: '0 24px 0 0' }}>
                    🎓 Курсы
                </Typography.Title>

                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    style={{ flex: 1 }}
                    items={[
                        { key: '/', icon: <HomeOutlined />, label: <Link to="/">Главная</Link> },
                        { key: '/courses', icon: <BookOutlined />, label: <Link to="/courses">Курсы</Link> },
                        { key: '/students', icon: <UserOutlined />, label: <Link to="/students">Студенты</Link> },
                        { key: '/teachers', icon: <TeamOutlined />, label: <Link to="/teachers">Преподаватели</Link> },
                        { key: '/about', icon: <InfoCircleOutlined />, label: <Link to="/about">О программе</Link> },
                        { key: '/feedback', icon: <MessageOutlined />, label: <Link to="/feedback">Обратная связь</Link> },
                    ]}
                />
            </Header>

            <Content style={{ padding: 24, background: '#f5f7fa' }}>
                <div
                    style={{
                        background: '#fff',
                        padding: 24,
                        borderRadius: 14,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        minHeight: 'calc(100vh - 160px)',
                    }}
                >
                    <Outlet />
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                © 2026 Каталог курсов и преподавателей
            </Footer>
        </Layout>
    );
}