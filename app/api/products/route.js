import { getGoldPrice } from "@/lib/goldService";
import productsData from "@/data/products.json";
import { priceCalculator } from "@/lib/priceCalculator";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const minPrice = searchParams.has("minPrice")
        ? Number(searchParams.get("minPrice"))
        : 0;
    const maxPrice = searchParams.has("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : Infinity;
    const minPopularity = searchParams.has("minPopularity")
        ? Number(searchParams.get("minPopularity"))
        : 0;

    const colorParam = searchParams.get("color");
    const colors = colorParam ? colorParam.split(",") : [];

    let goldPrice = 0;
    try {
        const gp = await getGoldPrice();
        goldPrice = gp.price;
    } catch (err) {
        console.warn("GoldAPI fetch failed, fallback goldPrice=0", err);
    }

    const enriched = productsData.map((p) => ({
        ...p,
        price: priceCalculator(p.popularityScore, p.weight, goldPrice),
    }));

    const filtered = enriched.filter((p) => {
        if (p.price < minPrice || p.price > maxPrice) return false;

        const starRating = p.popularityScore * 5;
        if (starRating < minPopularity) return false;

        if (colors.length > 0) {
            const ok = colors.some((col) => p.images && p.images[col]);
            if (!ok) return false;
        }

        return true;
    });

    return NextResponse.json(filtered);
}
