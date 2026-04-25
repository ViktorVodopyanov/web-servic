import React, { useState } from 'react';
import { Button, Card, Image, Modal, Typography } from 'antd';

export default function AboutPage() {
    const [open, setOpen] = useState(false);

    return (
        <Card title="О программе" bordered={false}>
            <Typography.Title level={3}>Каталог курсов и преподавателей</Typography.Title>

            <Typography.Paragraph>
                Данное приложение является клиентской частью веб-приложения,
                разработанной на React, UmiJS и Ant Design.
            </Typography.Paragraph>

            <Typography.Paragraph>
                В приложении реализованы страницы для просмотра, добавления,
                редактирования и удаления курсов и преподавателей.
            </Typography.Paragraph>

            <Button type="primary" onClick={() => setOpen(true)}>
                Показать фото разработчика
            </Button>

            <Modal
                title="Разработчик"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
            >
                <Image src="/developer.jpg" alt="Фото разработчика" width="100%" />
            </Modal>
        </Card>
    );
}