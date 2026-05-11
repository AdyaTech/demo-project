import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import ProductCard from './product-card';
import { Category, Product } from '@/lib/types';

const ProductList = async ({ searchParams }: { searchParams: { restaurantId: string } }) => {
    const backendUrl = process.env.BACKEND_URL;

    const [categoryResponse, productsResponse] = await Promise.all([
        fetch(`${backendUrl}/api/catalog/categories`, { cache: 'no-store' }),
        fetch(
            `${backendUrl}/api/catalog/products?perPage=100&limit=100${searchParams.restaurantId ? `&tenantId=${searchParams.restaurantId}` : ''}`,
            { cache: 'no-store' }
        ),
    ]);

    const categories: Category[] = categoryResponse.ok ? await categoryResponse.json() : [];
    const productsData: { data: Product[] } = productsResponse.ok
        ? await productsResponse.json()
        : { data: [] };

    if (!categories.length) {
        return (
            <section>
                <div className="container py-12">
                    <p className="text-gray-500">No categories found. Please select a restaurant.</p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="container py-12">
                <Tabs defaultValue={categories[0]._id}>
                    <TabsList>
                        {categories.map((category) => (
                            <TabsTrigger key={category._id} value={category._id} className="text-md">
                                {category.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {categories.map((category) => (
                        <TabsContent key={category._id} value={category._id}>
                            <div className="grid grid-cols-4 gap-6 mt-6">
                                {productsData.data
                                    .filter((product) => product.category._id === category._id)
                                    .map((product) => (
                                        <ProductCard product={product} key={product._id} />
                                    ))}
                            </div>
                            {productsData.data.filter((p) => p.category._id === category._id).length === 0 && (
                                <p className="text-gray-400 mt-4">No products in this category for the selected restaurant.</p>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
};

export default ProductList;
