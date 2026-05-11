import { Card, Form, InputNumber, Typography } from 'antd';
import { Category } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../../../http/api';
import { capitalizeFirst } from '../helpers';

type PricingProps = { selectedCategory: string };

const Pricing = ({ selectedCategory }: PricingProps) => {
    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ['category', selectedCategory],
        queryFn: () => getCategory(selectedCategory).then((res) => res.data),
        staleTime: 1000 * 60 * 5,
    });

    if (!fetchedCategory) return null;

    return (
        <Card title={<Typography.Text>Pricing</Typography.Text>} bordered={false} style={{ marginBottom: 16 }}>
            {Object.entries(fetchedCategory.priceConfiguration).map(([configName, config]) => (
                <div key={configName}>
                    <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
                        {configName} ({capitalizeFirst(config.priceType)} price)
                    </Typography.Text>
                    {config.availableOptions.map((option) => (
                        <Form.Item
                            key={option}
                            label={option}
                            name={['priceConfiguration', configName, option]}
                            rules={[{ required: true, message: `Price for ${option} is required` }]}
                        >
                            <InputNumber prefix="₹" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    ))}
                </div>
            ))}
        </Card>
    );
};

export default Pricing;
