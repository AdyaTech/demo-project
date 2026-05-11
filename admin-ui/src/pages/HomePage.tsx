import { Button, Card, Col, List, Row, Skeleton, Space, Statistic, Tag, Typography } from 'antd';
import Icon from '@ant-design/icons';
import { useAuthStore } from '../store';
import { BarChartIcon } from '../components/icons/BarChart';
import BasketIcon from '../components/icons/BasketIcon';
import { Link } from 'react-router-dom';
import { ComponentType } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from './HomePage.helpers';

const { Title, Text } = Typography;

interface CardTitleProps {
    title: string;
    PrefixIcon: ComponentType<unknown>;
}

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => (
    <Space>
        <Icon component={PrefixIcon} />
        {title}
    </Space>
);

const statusColorMap: Record<string, string> = {
    received: 'processing',
    confirmed: 'orange',
    prepared: 'volcano',
    out_for_delivery: 'purple',
    delivered: 'success',
};

function HomePage() {
    const { user } = useAuthStore();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
    });

    const recentOrders = orders?.slice(0, 6) ?? [];
    const totalOrders = orders?.length ?? 0;
    const totalSale = orders?.reduce((sum: number, o: { total: number }) => sum + o.total, 0) ?? 0;

    return (
        <div>
            <Title level={4}>Welcome, {user?.firstName} 😀</Title>
            <Row className="mt-4" gutter={16}>
                <Col span={12}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card bordered={false}>
                                <Statistic title="Total orders" value={totalOrders} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false}>
                                <Statistic title="Total sale" value={totalSale} precision={2} prefix="₹" />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title={<CardTitle title="Sales" PrefixIcon={BarChartIcon} />} bordered={false}>
                                <Text type="secondary">Sales chart coming soon</Text>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Card bordered={false} title={<CardTitle title="Recent orders" PrefixIcon={BasketIcon} />}>
                        <List
                            loading={isLoading}
                            itemLayout="horizontal"
                            dataSource={recentOrders}
                            renderItem={(item: { cart: {name: string}[], address: string, total: number, orderStatus: string, loading?: boolean }) => (
                                <List.Item>
                                    <Skeleton avatar title={false} loading={item.loading} active>
                                        <List.Item.Meta
                                            title={item.cart?.map((c) => c.name).join(', ')}
                                            description={item.address}
                                        />
                                        <Row style={{ flex: 1 }} justify="space-between">
                                            <Col><Text strong>₹{item.total}</Text></Col>
                                            <Col>
                                                <Tag color={statusColorMap[item.orderStatus] ?? 'default'}>
                                                    {item.orderStatus?.replace(/_/g, ' ')}
                                                </Tag>
                                            </Col>
                                        </Row>
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                        <div style={{ marginTop: 20 }}>
                            <Button type="link"><Link to="/orders">See all orders</Link></Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default HomePage;
