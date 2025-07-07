// components/ProductFilter.jsx
'use client'
import React, { useState } from 'react'
import ProductList from './ProductList'
import styles from './ProductFilter.module.scss'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ProductFilter({ initialProducts }) {
    const router = useRouter()
    const params = useSearchParams()

    // URL’den gelen parametre isimleriyle eşleşiyor
    const [minPrice, setMinPrice]       = useState(params.get('minPrice')        ?? '')
    const [maxPrice, setMaxPrice]       = useState(params.get('maxPrice')        ?? '')
    const [minPopularity, setMinPopularity] = useState(params.get('minPopularity') ?? '0')
    const [colors, setColors]           = useState(params.get('color')?.split(',') || [])

    const [products, setProducts] = useState(initialProducts)

    const toggleColor = col =>
        setColors(prev =>
            prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
        )

    const handleApply = async () => {
        const qp = new URLSearchParams()
        if (minPrice)        qp.set('minPrice', minPrice)
        if (maxPrice)        qp.set('maxPrice', maxPrice)
        if (+minPopularity > 0) qp.set('minPopularity', minPopularity)
        if (colors.length)   qp.set('color', colors.join(','))

        router.replace(`?${qp.toString()}`, { shallow: true })

        try {
            const res = await fetch(`/api/products?${qp.toString()}`)
            if (!res.ok) throw new Error('Fetch error')
            setProducts(await res.json())
        } catch (err) {
            console.error('Filtrelenmiş ürünler çekilemedi:', err)
            setProducts([])
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.filterBox}>
                <div className={styles.group}>
                    <label>Min Price ($)</label>
                    <input
                        type="number" min="0"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div className={styles.group}>
                    <label>Max Price ($)</label>
                    <input
                        type="number" min="0"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        placeholder="Any"
                    />
                </div>
                <div className={styles.group}>
                    <label>Min Popularity</label>
                    <select
                        value={minPopularity}
                        onChange={e => setMinPopularity(e.target.value)}
                    >
                        <option value="0">All</option>
                        {[1,2,3,4,5].map(n => (
                            <option key={n} value={n}>{n}★</option>
                        ))}
                    </select>
                </div>
                <div className={styles.group}>
                    <label>Color</label>
                    <div className={styles.colors}>
                        {['yellow','white','rose'].map(col => (
                            <label key={col} className={styles.colorLabel}>
                                <input
                                    type="checkbox"
                                    checked={colors.includes(col)}
                                    onChange={() => toggleColor(col)}
                                />
                                <span className={styles.colorCircle} data-color={col} />
                            </label>
                        ))}
                    </div>
                </div>
                <button className={styles.applyBtn} onClick={handleApply}>
                    Apply
                </button>
            </div>

            <ProductList products={products} />
        </div>
    )
}
