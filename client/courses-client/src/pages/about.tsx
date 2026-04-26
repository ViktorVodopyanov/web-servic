import { useState } from 'react';
import { Button, Card, Image, Modal, Typography } from 'antd';

export default function AboutPage() {
    const [open, setOpen] = useState(false);

    return (
        <Card title="О программе">
            <Typography.Paragraph>
                Данное приложение разработано как SPA на React, UmiJS и Ant Design.
            </Typography.Paragraph>

            <Typography.Paragraph>
                Серверная часть в данной практической работе не используется.
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