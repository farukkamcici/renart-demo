'use client'

import React from 'react';

export default function ProductList({ products }) {
    return (
        <div>
            {products.map(p => (
                <div key={p.id}>{p.name} – {p.price}</div>
            ))}
        </div>
    );
}
