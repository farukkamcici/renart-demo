'use client'
import React, { useState } from 'react'
import ProductList from './ProductList'
import styles from './ProductFilter.module.scss'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ProductFilter({ initialProducts }) {
    const router = useRouter()
    const params = useSearchParams()

    // 1) Input olarak kullandığımız state’ler
    const [minPriceInput, setMinPriceInput] = useState(params.get('minPrice') ?? '')
    const [maxPriceInput, setMaxPriceInput] = useState(params.get('maxPrice') ?? '')
    const [minPopularityInput, setMinPopularityInput] = useState(params.get('minPopularity') ?? '0')
    const [colorsInput, setColorsInput] = useState(params.get('color')?.split(',') || [])

    // 2) “Apply” dedikten sonra geçerli olacak filtreler
    const [appliedFilters, setAppliedFilters] = useState({
        minPrice: minPriceInput,
        maxPrice: maxPriceInput,
        minPopularity: minPopularityInput,
        colors: colorsInput,
    })

    // 3) Ürünler state’i
    const [products, setProducts] = useState(initialProducts)

    // Renk toggle (input’u etkiler)
    const toggleColorInput = col =>
        setColorsInput(prev =>
            prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
        )

    // Apply butonu
    // inside components/ProductFilter.jsx

    const handleApply = async () => {
        // build query string
        const qp = new URLSearchParams()
        if (minPriceInput)         qp.set('minPrice', minPriceInput)
        if (maxPriceInput)         qp.set('maxPrice', maxPriceInput)
        if (+minPopularityInput)   qp.set('minPopularity', minPopularityInput)
        if (colorsInput.length)    qp.set('color', colorsInput.join(','))

        const qs = qp.toString()
        const url = `/api/products?${qs}`  // ← make sure the leading slash is here
        console.log('🔍 Fetching products from:', url)

        // update URL bar (optional)
        router.replace(`?${qs}`, { shallow: true })

        try {
            const res = await fetch(url)
            if (!res.ok) {
                // print status code and any error body
                const text = await res.text()
                console.error(`⚠️ API returned ${res.status}:\n`, text)
                // you can show a user‐friendly message here instead of throwing
                return
            }
            const data = await res.json()
            console.log('✅ Fetched products:', data.length)
            setProducts(data)
        } catch (networkError) {
            console.error('🚨 Network error while fetching products:', networkError)
        }
    }


    const defaultColor = appliedFilters.colors[0]


    return (
        <div className={styles.container}>
            <div className={styles.filterBox}>
                {/* Min Price */}
                <div className={styles.group}>
                    <label>Min Price ($)</label>
                    <input
                        type="number"
                        min="0"
                        value={minPriceInput}
                        onChange={e => setMinPriceInput(e.target.value)}
                        placeholder="0"
                    />
                </div>

                {/* Max Price */}
                <div className={styles.group}>
                    <label>Max Price ($)</label>
                    <input
                        type="number"
                        min="0"
                        value={maxPriceInput}
                        onChange={e => setMaxPriceInput(e.target.value)}
                        placeholder="Any"
                    />
                </div>

                {/* Min Popularity */}
                <div className={styles.group}>
                    <label>Min Popularity</label>
                    <select
                        value={minPopularityInput}
                        onChange={e => setMinPopularityInput(e.target.value)}
                    >
                        <option value="0">All</option>
                        {[1,2,3,4,5].map(n => (
                            <option key={n} value={n}>{n}★</option>
                        ))}
                    </select>
                </div>

                {/* Color */}
                <div className={styles.group}>
                    <label>Color</label>
                    <div className={styles.colors}>
                        {['yellow','white','rose'].map(col => (
                            <label key={col} className={styles.colorLabel}>
                                <input
                                    type="checkbox"
                                    checked={colorsInput.includes(col)}
                                    onChange={() => toggleColorInput(col)}
                                />
                                <span className={styles.colorCircle} data-color={col} />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Apply */}
                <button className={styles.applyBtn} onClick={handleApply}>
                    Apply
                </button>
            </div>

            {/* Listeyi Render et */}
            <ProductList
                products={products}
                defaultColor={defaultColor}
            />
        </div>
    )
}
