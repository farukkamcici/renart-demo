import React from 'react';
import ProductList from './components/ProductList';
import ProductFilter from './components/ProductFilter';
import '../styles/globals.scss';

const Page = async () => {
    let products = [];

    const API_URL = 'HTTP://localhost:3000/api';


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
            <ProductFilter initialProducts = {products}/>
        </main>
    );
};

export default Page;
