import React, { Suspense } from "react";
import ProductFilter from "./components/ProductFilter";
import "../styles/globals.scss";

export const metadata = {
    title: 'Renart Demo',
}
export default async function Page() {
    let initialProducts = [];
    try {
        const res = await fetch("https://renart-demo.vercel.app/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Products can not be fetched");
        initialProducts = await res.json();
    } catch (err) {
        console.error("Error fetching initial products:", err);
    }

    return (
        <main>
            <header>
                Product List
            </header>

            <Suspense fallback={<div>Loading filters…</div>}>
                <ProductFilter initialProducts={initialProducts} />
            </Suspense>
        </main>
    );
}
