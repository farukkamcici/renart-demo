import {NextResponse} from "next/server";
import products from "@/data/products.json";
import {getGoldPrice} from "@/lib/goldService";
import {priceCalculator} from "@/lib/priceCalculator";

export async function GET(request, {params}) {
    const id = Number(params.id);

    if(isNaN(id)) {
        return NextResponse.json(
            { error: 'ID must be a number', code:'INVALID_ID'},
            {status:400}
        );
    }

    const product = products.find(p => p.id === id);
    if(!product) {
        return NextResponse.json(
            { error: 'Product not found', code:'PRODUCT_NOT_FOUND'},
            {status:404}
        )
    }

    const {price: goldPrice} = await getGoldPrice();

    const enriched = {
        ...product,
        price: priceCalculator(product.popularityScore, product.weight, goldPrice),
    }
    return NextResponse.json(enriched)
}