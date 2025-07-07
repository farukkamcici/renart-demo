import { getGoldPrice } from "@/lib/goldService";
import productsData from "@/data/products.json";
import { priceCalculator } from "@/lib/priceCalculator";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // 1) Query parametrelerini parse et
    const minPrice = searchParams.has("minPrice")
        ? Number(searchParams.get("minPrice"))
        : 0;
    const maxPrice = searchParams.has("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : Infinity;
    const minPopularity = searchParams.has("minPopularity")
        ? Number(searchParams.get("minPopularity"))
        : 0;

    // 2) Color listesi
    const colorParam = searchParams.get("color");
    const colors = colorParam ? colorParam.split(",") : [];

    // 3) Gold price fetch + fallback
    let goldPrice = 0;
    try {
        const gp = await getGoldPrice();
        goldPrice = gp.price;
    } catch (err) {
        console.warn("GoldAPI fetch failed, fallback goldPrice=0", err);
    }

    // 4) Ürünleri enrich et
    const enriched = productsData.map((p) => ({
        ...p,
        price: priceCalculator(p.popularityScore, p.weight, goldPrice),
    }));

    // 5) Filtre uygula
    const filtered = enriched.filter((p) => {
        // a) Price aralığı
        if (p.price < minPrice || p.price > maxPrice) return false;

        // b) Popularity (0–1) → 0–5 yıldız
        const starRating = p.popularityScore * 5;
        if (starRating < minPopularity) return false;

        // c) Renk
        if (colors.length > 0) {
            const ok = colors.some((col) => p.images && p.images[col]);
            if (!ok) return false;
        }

        return true;
    });

    return NextResponse.json(filtered);
}
