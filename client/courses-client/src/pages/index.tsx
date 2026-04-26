import { Card, Typography } from 'antd';

export default function HomePage() {
    return (
        <Card title="Главная">
            <Typography.Paragraph>
                Добро пожаловать в клиентское приложение «Каталог курсов и преподавателей».
            </Typography.Paragraph>

            <Typography.Paragraph>
                В данной версии данные хранятся только в состоянии клиентского приложения.
            </Typography.Paragraph>
        </Card>
    );
}