import React from 'react';
import ProductList from './components/ProductList';
import '../styles/globals.scss';

const Page = async () => {
    let products = [];

    const API_URL = 'https://renart-demo.vercel.app/api';

    try {
        const res = await fetch(API_URL + `/products`);
        if (!res.ok) throw new Error('Products can not be fetched');
        products = await res.json();
    } catch (error) {
        console.error(error.message || 'Error fetching products');
    }

    return (
        <main>
            <header>Product List</header>

            <ProductList products={products} />
        </main>
    );
};

export default Page;
