import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Space, Table, message } from 'antd';
import { api, Teacher } from '@/services/api';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [form] = Form.useForm();

  const loadTeachers = async () => {
    const response = await api.get<Teacher[]>('/Teachers');
    setTeachers(response.data);
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const saveTeacher = async () => {
    const values = await form.validateFields();

    if (editingTeacher) {
      await api.put(`/Teachers/${editingTeacher.id}`, values);
      message.success('Преподаватель обновлён');
    } else {
      await api.post('/Teachers', values);
      message.success('Преподаватель добавлен');
    }

    setOpen(false);
    setEditingTeacher(null);
    form.resetFields();
    loadTeachers();
  };

  const deleteTeacher = async (id: number) => {
    await api.delete(`/Teachers/${id}`);
    message.success('Преподаватель удалён');
    loadTeachers();
  };

  return (
    <Card
      title="Преподаватели"
      extra={
        <Button type="primary" onClick={() => setOpen(true)}>
          Добавить
        </Button>
      }
    >
      <Table
        rowKey="id"
        dataSource={teachers}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'ФИО', dataIndex: 'name' },
          { title: 'Кафедра', dataIndex: 'department' },
          {
            title: 'Действия',
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() => {
                    setEditingTeacher(record);
                    form.setFieldsValue(record);
                    setOpen(true);
                  }}
                >
                  Изменить
                </Button>
                <Button danger onClick={() => deleteTeacher(record.id)}>
                  Удалить
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingTeacher ? 'Редактировать преподавателя' : 'Добавить преподавателя'}
        open={open}
        onOk={saveTeacher}
        onCancel={() => {
          setOpen(false);
          setEditingTeacher(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="ФИО"
            rules={[{ required: true, message: 'Введите ФИО' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="Кафедра"
            rules={[{ required: true, message: 'Введите кафедру' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}