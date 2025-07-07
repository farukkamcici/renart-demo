import React from 'react';
import ProductList from './components/ProductList';

const Page = async () => {
    let products = [];

    try {
        const res = await fetch(`http://localhost:3000/api/products`);
        if (!res.ok) throw new Error('Products can not be fetched');
        products = await res.json();
    } catch (error) {
        console.error(error.message || 'Error fetching products');
    }

    if (!products.length) {
        return (
            <main>
                <h1>Products</h1>
                <p>No products found</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Products</h1>
            <ProductList products={products} />
        </main>
    );
};

export default Page;
