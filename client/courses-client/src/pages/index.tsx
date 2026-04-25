import React from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { BookOutlined, TeamOutlined, MessageOutlined } from '@ant-design/icons';

export default function HomePage() {
    return (
        <>
            <Typography.Title level={2}>Добро пожаловать 👋</Typography.Title>

            <Typography.Paragraph>
                Клиентское приложение для работы с каталогом курсов и преподавателей.
            </Typography.Paragraph>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic title="Раздел" value="Курсы" prefix={<BookOutlined />} />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card>
                        <Statistic title="Раздел" value="Преподаватели" prefix={<TeamOutlined />} />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card>
                        <Statistic title="Раздел" value="Обратная связь" prefix={<MessageOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 24 }} title="О приложении">
                <Typography.Paragraph>
                    Приложение разработано с использованием React, UmiJS и Ant Design.
                </Typography.Paragraph>
            </Card>
        </>
    );
}