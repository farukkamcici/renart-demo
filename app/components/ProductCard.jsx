import React, {useEffect, useState} from 'react'
import styles from './ProductCard.module.scss';
import PartialStars from './PartialStars';

const ProductCard = ({product, defaultColor}) => {
    const {id, name, popularityScore, weight, images, price} = product;
    const [color, setColor] = useState(defaultColor ?? 'yellow');
    const colorMap = [
        { key: 'yellow', label: 'Yellow', style: { background: '#E6CA97' } },
        { key: 'white', label: 'White', style: { background: '#D9D9D9' } },
        { key: 'rose', label: 'Rose', style: { background: '#E1A4A9' } },
    ];
    const selectedColor = colorMap.find((c) => c.key === color);

    useEffect(() => {
        if (defaultColor) {
            setColor(defaultColor);
        }

    }, [defaultColor])

    const imageUrl =
        (images && images[color]) ||
        images.yellow ||
        images.rose ||
        images.white ||
        '';


    return (
        <div className={styles.card}>

            <img src={imageUrl} alt={name} />

            <h3>{name}</h3>
            <p className={styles.price}>$ {price.toFixed(2)} USD </p>

            <section className={styles.colorPicker}>
                {colorMap.map((c) => (
                    <button
                    key={c.key}
                    className={`${styles.pickerBtn} ${c.key === color ? styles.btnActive : ''}`}
                    style={c.style}
                    onClick={() => setColor(c.key)}
                    aria-label={c.label}/>
                ))}

                <p className={styles.desc}> {selectedColor.label} Gold</p>
            </section>

            <PartialStars score={popularityScore * 5} outOf={5} />


        </div>
    )
}
export default ProductCard
