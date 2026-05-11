import {
    Breadcrumb, Button, Drawer, Flex, Form, Input, Space, Table, Typography,
} from 'antd';
import { RightOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTenant, getTenants } from '../../http/api';

interface Tenant {
    _id: string;
    name: string;
    address: string;
    city: string;
}

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'City', dataIndex: 'city', key: 'city' },
];

const RestaurantsPage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => getTenants('').then((res) => res.data),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (values: { name: string; address: string; city: string }) => createTenant(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setDrawerOpen(false);
            form.resetFields();
        },
    });

    const tenants: Tenant[] = (data as { data: Tenant[] })?.data ?? [];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between" align="center">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Restaurants' }]}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
                    Add Restaurant
                </Button>
            </Flex>

            <Table columns={columns} dataSource={tenants} rowKey="_id" loading={isLoading} />

            <Drawer
                title="Add Restaurant"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                width={420}
                extra={
                    <Button type="primary" loading={isPending} onClick={() => form.submit()}>
                        Create
                    </Button>
                }
            >
                <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
                    <Form.Item label="Restaurant Name" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="City" name="city" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Drawer>
        </Space>
    );
};

import { useState } from 'react';
export default RestaurantsPage;
