'use client'
import React, { useState } from "react";
import ProductList from "./ProductList";
import styles from "./ProductFilter.module.scss";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilter({ initialProducts }) {
    const router = useRouter();
    const params = useSearchParams();

    // 1) Input state
    const [minPriceInput, setMinPriceInput] = useState(params.get("minPrice") ?? "");
    const [maxPriceInput, setMaxPriceInput] = useState(params.get("maxPrice") ?? "");
    const [minPopularityInput, setMinPopularityInput] = useState(
        params.get("minPopularity") ?? "0"
    );
    const [colorsInput, setColorsInput] = useState(
        params.get("color")?.split(",") || []
    );

    // 2) Applied filters + defaultColor state
    const [appliedFilters, setAppliedFilters] = useState({
        minPrice: minPriceInput,
        maxPrice: maxPriceInput,
        minPopularity: minPopularityInput,
        colors: colorsInput,
    });
    const [defaultColor, setDefaultColor] = useState(colorsInput[0] ?? "yellow");


    // 3) Products state
    const [products, setProducts] = useState(initialProducts);

    // toggle for input colors only
    const toggleColorInput = (col) =>
        setColorsInput((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
        );

    const handleApply = async () => {
        // update appliedFilters & defaultColor
        setAppliedFilters({
            minPrice: minPriceInput,
            maxPrice: maxPriceInput,
            minPopularity: minPopularityInput,
            colors: colorsInput,
        });
        setDefaultColor(colorsInput[0] ?? "yellow");


        // build query string & update URL
        const qp = new URLSearchParams();
        if (minPriceInput) qp.set("minPrice", minPriceInput);
        if (maxPriceInput) qp.set("maxPrice", maxPriceInput);
        if (+minPopularityInput)
            qp.set("minPopularity", minPopularityInput);
        if (colorsInput.length) qp.set("color", colorsInput.join(","));

        const qs = qp.toString();
        router.replace(`?${qs}`, { shallow: true });

        // fetch filtered products
        try {
            const res = await fetch(`/api/products?${qs}`);
            if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setProducts([]);
        }
    };

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
                        onChange={(e) => setMinPriceInput(e.target.value)}
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
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        placeholder="Any"
                    />
                </div>

                {/* Min Popularity */}
                <div className={styles.group}>
                    <label>Min Popularity</label>
                    <select
                        value={minPopularityInput}
                        onChange={(e) => setMinPopularityInput(e.target.value)}
                    >
                        <option value="0">All</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {n}★
                            </option>
                        ))}
                    </select>
                </div>

                {/* Color */}
                <div className={styles.group}>
                    <label>Color</label>
                    <div className={styles.colors}>
                        {["yellow", "white", "rose"].map((col) => (
                            <label key={col} className={styles.colorLabel}>
                                <input
                                    type="checkbox"
                                    checked={colorsInput.includes(col)}
                                    onChange={() => toggleColorInput(col)}
                                />
                                <span
                                    className={styles.colorCircle}
                                    data-color={col}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Apply */}
                <button
                    className={styles.applyBtn}
                    onClick={handleApply}
                >
                    Apply
                </button>
            </div>

            <ProductList
                products={products}
                defaultColor={defaultColor}
            />
        </div>
    );
}
