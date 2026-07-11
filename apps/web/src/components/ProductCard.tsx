import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatMoney } from "../lib/money";
import { ProductVisual } from "./ProductVisual";
import { Stars } from "./Stars";

export function ProductCard({ product }: { product: Product }) {
  const stock = product.inventory?.quantity ?? 0;
  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <ProductVisual
        name={product.name}
        categorySlug={product.category.slug}
        imageUrl={product.images[0]?.url}
        className="aspect-[4/5] transition duration-300 group-hover:-translate-y-1"
      />
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-500">{product.category.name}</p>
        <h3 className="font-medium leading-snug group-hover:text-pine-800">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p>
            {formatMoney(product.price)}
            {product.compareAt ? (
              <span className="ml-2 text-sm text-ink-500 line-through">
                {formatMoney(product.compareAt)}
              </span>
            ) : null}
          </p>
          <Stars value={product.ratingAvg} />
        </div>
        <p className="text-sm text-ink-500">
          {stock <= 0 ? "Out of stock" : stock <= 8 ? `Only ${stock} left` : "In stock"}
        </p>
      </div>
    </Link>
  );
}
