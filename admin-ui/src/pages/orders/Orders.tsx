import { Breadcrumb, Flex, message, Space, Table, Tag, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Order, OrderEvents, PaymentMode, PaymentStatus } from '../../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrders } from '../../http/api';
import { format } from 'date-fns';
import { colorMapping } from '../../constants';
import { capitalizeFirst } from '../products/helpers';
import React from 'react';
import socket from '../../lib/socket';
import { useAuthStore } from '../../store';

const columns = [
    {
        title: 'Order ID',
        dataIndex: '_id',
        key: '_id',
        render: (_text: string, record: Order) => <Typography.Text>{record._id}</Typography.Text>,
    },
    {
        title: 'Customer',
        render: (_: string, record: Order) =>
            record.customerId ? (
                <Typography.Text>{record.customerId.firstName} {record.customerId.lastName}</Typography.Text>
            ) : null,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: (v: string) => <Typography.Text>{v}</Typography.Text>,
    },
    {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
        render: (v: string) => <Typography.Text>{v}</Typography.Text>,
    },
    {
        title: 'Payment Mode',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
        render: (v: string) => <Typography.Text>{v}</Typography.Text>,
    },
    {
        title: 'Status',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (_: boolean, record: Order) => (
            <Tag bordered={false} color={colorMapping[record.orderStatus]}>
                {capitalizeFirst(record.orderStatus)}
            </Tag>
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (text: string) => <Typography.Text>₹{text}</Typography.Text>,
    },
    {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => <Typography.Text>{format(new Date(text), 'dd/MM/yyyy HH:mm')}</Typography.Text>,
    },
    {
        title: 'Actions',
        render: (_: string, record: Order) => <Link to={`/orders/${record._id}`}>Details</Link>,
    },
];

const Orders = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    React.useEffect(() => {
        if (user?.tenant) {
            socket.on('order-update', (rawData) => {
                const data = rawData as { event_type: string; data: Order & { paymentMode: PaymentMode; paymentStatus: PaymentStatus } };
                if (
                    (data.event_type === OrderEvents.ORDER_CREATE && data.data.paymentMode === PaymentMode.CASH) ||
                    (data.event_type === OrderEvents.PAYMENT_STATUS_UPDATE &&
                        data.data.paymentStatus === PaymentStatus.PAID &&
                        data.data.paymentMode === PaymentMode.CARD)
                ) {
                    queryClient.setQueryData(['orders'], (old: Order[]) => [data.data, ...(old ?? [])]);
                    messageApi.open({ type: 'success', content: 'New Order Received.' });
                }
            });

            socket.on('join', (rawData) => {
                const data = rawData as { roomId: string };
                console.log('User joined in: ', data.roomId);
            });

            socket.emit('join', { tenantId: user.tenant.id });
        }

        return () => {
            socket.off('join');
            socket.off('order-update');
        };
    }, []);

    const { data: orders } = useQuery({
        queryKey: ['orders'],
        queryFn: () => getOrders('').then((res) => res.data as Order[]),
    });

    return (
        <>
            {contextHolder}
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Flex justify="space-between">
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Orders' }]}
                    />
                </Flex>
                <Table columns={columns} rowKey="_id" dataSource={orders ?? []} />
            </Space>
        </>
    );
};

export default Orders;
