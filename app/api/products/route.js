import {getGoldPrice} from "@/lib/goldService";
import products from "@/data/products.json";
import {priceCalculator} from "@/lib/priceCalculator";
import {NextResponse} from "next/server";

export async function  GET (request) {
    const { price: goldPrice } = await getGoldPrice();

    const url = new URL(request.url);
    const minPrice = Number (url.searchParams.get('minPrice')) || 0;
    const maxPrice = Number (url.searchParams.get('maxPrice')) || Infinity;
    const minPopularity = Number (url.searchParams.get('minPopularity')) || 0;
    const color = url.searchParams.get('color') || null;

    if (products) {
        const enriched = products.map(p => ({
            ...p,
            price: priceCalculator(p.popularityScore, p.weight, goldPrice)
        }))

        const filtered = enriched.filter( p =>
            p.price >= minPrice &&
            p.price <= maxPrice &&
            p.popularityScore >= minPopularity &&
            ( !color || p.images[color] )
        )

        return NextResponse.json(filtered)
    }

    return NextResponse.json(
        {error: {message: 'Products not found', code: 'PRODUCTS_NOT_FOUND'}},
        {status: 404}
    )

}