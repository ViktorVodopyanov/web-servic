import React from 'react';
import { Card, Typography } from 'antd';

export default function HomePage() {
    return (
        <Card title="Главная">
            <Typography.Paragraph>
                Добро пожаловать в клиентское приложение «Каталог курсов и преподавателей».
            </Typography.Paragraph>
        </Card>
    );
}