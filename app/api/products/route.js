// app/api/products/route.js
import { getGoldPrice } from "@/lib/goldService";
import productsData from "@/data/products.json";
import { priceCalculator } from "@/lib/priceCalculator";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // Parse numeric query parameters
    const minPrice = searchParams.has("minPrice")
        ? Number(searchParams.get("minPrice"))
        : 0;
    const maxPrice = searchParams.has("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : Infinity;
    const minPopularity = searchParams.has("minPopularity")
        ? Number(searchParams.get("minPopularity"))
        : 0;

    // Parse color list (comma-separated)
    const colorParam = searchParams.get("color");
    const colors = colorParam ? colorParam.split(",") : [];

    // Fetch gold price with fallback
    let goldPrice = 0;
    try {
        const gp = await getGoldPrice();
        goldPrice = gp.price;
    } catch (err) {
        console.warn("GoldAPI fetch failed, using fallback price=0", err);
    }

    // Enrich products with computed price
    const enriched = productsData.map(p => ({
        ...p,
        price: priceCalculator(p.popularityScore, p.weight, goldPrice),
    }));

    console.log(minPopularity)
    console.log(p.popularityScore)
    // Filter products based on criteria
    const filtered = enriched.filter(p => {
        // 1) Price range
        if (p.price < minPrice || p.price > maxPrice) return false;
        // 2) Minimum popularity
        if (p.popularityScore < minPopularity) return false;
        // 3) Color filter: if any colors selected, require at least one match
        if (colors.length > 0) {
            const hasOne = colors.some(col => p.images && p.images[col]);
            if (!hasOne) return false;
        }
        return true;
    });

    return NextResponse.json(filtered);
}
