import React, { useState } from 'react';
import { Button, Card, Modal, Typography, Image } from 'antd';

export default function AboutPage() {
    const [open, setOpen] = useState(false);

    return (
        <Card title="О программе">
            <Typography.Paragraph>
                Данное приложение разработано как клиентская часть SPA на React,
                UmiJS и Ant Design.
            </Typography.Paragraph>

            <Typography.Paragraph>
                Приложение предназначено для работы с каталогом курсов и преподавателей.
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
                <Image
                    src="/developer.jpg"
                    alt="Фото разработчика"
                    width="100%"
                />
            </Modal>
        </Card>
    );
} 