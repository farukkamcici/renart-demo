import styles from './PartialStars.module.scss';

export default function PartialStars({ score = 0, outOf = 5 }) {
    const full = Math.floor(score);
    const fraction = score - full;

    return (
        <span className={styles.starWrapper}>
      <span className={styles.starRow}>
        {Array.from({ length: outOf }).map((_, i) => {
            if (i < full) {
                return <span key={i} className={styles.full}>★</span>;
            } else if (i === full && fraction > 0) {
                return (
                    <span key={i} className={styles.starPartial}>
                <span
                    className={styles.full}
                    style={{ width: `${fraction * 100}%` }}
                >★</span>
                <span className={styles.empty}>★</span>
              </span>
                );
            } else {
                return <span key={i} className={styles.empty}>★</span>;
            }
        })}
      </span>
      <span className={styles.scoreText}> {score.toFixed(1)}/5</span>
    </span>
    );
}
