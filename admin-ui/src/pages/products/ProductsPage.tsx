import {
    Breadcrumb, Button, Drawer, Flex, Form, Input, Select, Space, Switch, Table, Tag, Typography, Upload, Image,
} from 'antd';
import { RightOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, getCategories, getProducts } from '../../http/api';
import { useState } from 'react';
import { Category, Product } from '../../types';
import Attributes from './forms/Attributes';
import Pricing from './forms/Pricing';

const columns = [
    {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (img: string) => <Image src={img} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 6 }} fallback="https://via.placeholder.com/60" />,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (v: string) => <Typography.Text strong>{v}</Typography.Text>,
    },
    {
        title: 'Category',
        render: (_: unknown, record: Product) => <Tag>{record.category?.name}</Tag>,
    },
    {
        title: 'Status',
        dataIndex: 'isPublish',
        key: 'isPublish',
        render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Published' : 'Draft'}</Tag>,
    },
    {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (v: string) => new Date(v).toLocaleDateString('en-IN'),
    },
];

const ProductsPage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts('').then((res) => res.data),
    });

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories().then((res) => res.data),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => createProduct(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setDrawerOpen(false);
            form.resetFields();
            setSelectedCategory('');
        },
    });

    const onFinish = (values: Record<string, unknown>) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
                formData.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
            }
        });
        mutate(formData);
    };

    const products: Product[] = (productsData as { data: Product[] })?.data ?? [];
    const categories: Category[] = (categoriesData as Category[]) ?? [];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between" align="center">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Products' }]}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
                    Add Product
                </Button>
            </Flex>

            <Table columns={columns} dataSource={products} rowKey="_id" loading={isLoading} />

            <Drawer
                title="Create Product"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                width={600}
                extra={
                    <Button type="primary" loading={isPending} onClick={() => form.submit()}>
                        Create
                    </Button>
                }
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Product Name" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select category"
                            options={categories.map((c) => ({ value: c._id, label: c.name }))}
                            onChange={(val) => setSelectedCategory(val)}
                        />
                    </Form.Item>
                    <Form.Item label="Published" name="isPublish" valuePropName="checked">
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                    <Form.Item label="Image" name="image">
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>

                    {selectedCategory && (
                        <>
                            <Pricing selectedCategory={selectedCategory} />
                            <Attributes selectedCategory={selectedCategory} />
                        </>
                    )}
                </Form>
            </Drawer>
        </Space>
    );
};

export default ProductsPage;
