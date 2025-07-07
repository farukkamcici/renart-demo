const API_KEY = process.env.GOLD_API_KEY;
const TTL = 60 * 1000;

let cache = {
    price: null,
    timestamp: 0
};

async function fetchExternalGoldPrice() {
    const res = await fetch('https://www.goldapi.io/api/XAU/USD', {
        headers: { 'x-access-token': API_KEY }
    });

    if (!res.ok) {
        throw new Error(`GoldAPI error: ${res.status}`);
    }

    const data = await res.json();
    return {
        price: data.price_gram_24k,
        timestamp: Date.now()
    };
}

export async function getGoldPrice() {
    const now = Date.now();

    if (cache.price != null && (now - cache.timestamp) < TTL) {
        return cache;
    }

    try {
        // cache = await fetchExternalGoldPrice();
        cache = {
            price: 100,
            timestamp: now
        }
    } catch (err) {
        console.error('Error fetching gold price:', err);

        if (cache.price != null) {
            return cache;
        }

        throw err;
    }

    return cache;
}
