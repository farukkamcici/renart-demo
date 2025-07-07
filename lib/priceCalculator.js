export function priceCalculator(popularityScore, weight, goldPrice) {
    return (popularityScore + 1) * weight * goldPrice;
}