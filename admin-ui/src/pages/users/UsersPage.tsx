import {
    Breadcrumb, Button, Drawer, Flex, Form, Input, Select, Space, Table, Tag, Typography,
} from 'antd';
import { RightOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getUsers, getTenants } from '../../http/api';
import { User, CreateUserData } from '../../types';
import { useState } from 'react';

const columns = (onEdit: (user: User) => void) => [
    {
        title: 'Name',
        render: (_: unknown, record: User) => (
            <Typography.Text>{record.firstName} {record.lastName}</Typography.Text>
        ),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (role: string) => (
            <Tag color={role === 'admin' ? 'red' : 'blue'}>{role.toUpperCase()}</Tag>
        ),
    },
    {
        title: 'Restaurant',
        render: (_: unknown, record: User) => (
            <Typography.Text>{record.tenant?.name ?? '—'}</Typography.Text>
        ),
    },
    {
        title: 'Actions',
        render: (_: unknown, record: User) => (
            <Button type="link" onClick={() => onEdit(record)}>Edit</Button>
        ),
    },
];

const UsersPage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data: usersData, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers('').then((res) => res.data),
    });

    const { data: tenantsData } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => getTenants('').then((res) => res.data),
    });

    const { mutate: createMutate, isPending } = useMutation({
        mutationFn: (data: CreateUserData) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDrawerOpen(false);
            form.resetFields();
            setEditingUser(null);
        },
    });

    const openCreate = () => {
        setEditingUser(null);
        form.resetFields();
        setDrawerOpen(true);
    };

    const openEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setDrawerOpen(true);
    };

    const tenants = (tenantsData as { data: { _id: string; name: string }[] })?.data ?? [];
    const users = (usersData as { data: User[] })?.data ?? [];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between" align="center">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Users' }]}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                    Add User
                </Button>
            </Flex>

            <Table
                columns={columns(openEdit)}
                dataSource={users}
                rowKey="_id"
                loading={isLoading}
            />

            <Drawer
                title={editingUser ? 'Edit User' : 'Create User'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                width={480}
                extra={
                    <Button type="primary" loading={isPending} onClick={() => form.submit()}>
                        {editingUser ? 'Update' : 'Create'}
                    </Button>
                }
            >
                <Form form={form} layout="vertical" onFinish={(values) => createMutate(values)}>
                    <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: !editingUser, min: 8 }]}>
                        <Input.Password placeholder={editingUser ? 'Leave blank to keep same' : ''} />
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                        <Select options={[{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }]} />
                    </Form.Item>
                    <Form.Item label="Restaurant" name="tenantId">
                        <Select
                            allowClear
                            placeholder="Assign to restaurant"
                            options={tenants.map((t) => ({ value: t._id, label: t.name }))}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </Space>
    );
};

export default UsersPage;
