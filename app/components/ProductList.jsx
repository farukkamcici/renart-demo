'use client';
import React, { useRef, useState, useEffect } from 'react';
import styles from './ProductList.module.scss';
import ProductCard from './ProductCard';

export default function ProductList({ products, defaultColor }) {
    const containerRef = useRef(null);
    const [cardStep, setCardStep] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const GAP = 16;

        const firstCard = container.children[0];
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth;
        setCardStep(cardWidth + GAP);

        const onResize = () => {
            const w = firstCard.offsetWidth;
            setCardStep(w + GAP);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [products]);

    const scrollNext = () => {
        const container = containerRef.current;
        if (!container || cardStep === 0) return;
        container.scrollBy({ left: cardStep, behavior: 'smooth' });
    };

    const scrollPrev = () => {
        const container = containerRef.current;
        if (!container || cardStep === 0) return;
        container.scrollBy({ left: -cardStep, behavior: 'smooth' });
    };

    if (!products.length) {
        return <p className={styles.empty}>No products found with this filters.</p>;
    }

    return (
        <div className={styles.wrapper}>
            <button className={styles.nav} onClick={scrollPrev} aria-label="Previous">
                ‹
            </button>
            <div ref={containerRef} className={styles.scrollContainer}>
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} defaultColor={defaultColor}/>
                ))}
            </div>
            <button className={styles.nav} onClick={scrollNext} aria-label="Next">
                ›
            </button>
        </div>
    );
}
