import { Breadcrumb, Card, Space, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const PromosPage = () => {
    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Breadcrumb
                separator={<RightOutlined />}
                items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Promos' }]}
            />
            <Card>
                <Typography.Title level={4}>Promos & Coupons</Typography.Title>
                <Typography.Text type="secondary">
                    Promo management coming soon. You'll be able to create discount codes, BOGO offers, and seasonal deals here.
                </Typography.Text>
            </Card>
        </Space>
    );
};

export default PromosPage;
