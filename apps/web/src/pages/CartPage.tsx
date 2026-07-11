import { Link } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { estimateCartTotals, formatMoney, shippingLabel } from "../lib/money";
import { ProductVisual } from "../components/ProductVisual";
import { QuantitySelector } from "../components/QuantitySelector";
import { Button } from "../components/Button";
import { EmptyState } from "../components/States";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = estimateCartTotals(items, "standard");

  if (items.length === 0) {
    return (
      <div className="px-4 py-20">
        <EmptyState title="Your cart is empty" body="Browse the catalog and add a few quiet essentials.">
          <Link to="/products">
            <Button>Continue shopping</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <h1 className="font-serif text-4xl">Cart</h1>
        {items.map((item) => (
          <article key={item.productId} className="surface grid gap-4 p-4 sm:grid-cols-[96px_1fr_auto]">
            <ProductVisual
              name={item.name}
              categorySlug={item.categorySlug}
              imageUrl={item.imageUrl}
              className="h-24"
            />
            <div>
              <Link to={`/products/${item.slug}`} className="font-medium">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-ink-500">{formatMoney(item.unitPrice)} each</p>
              <div className="mt-3 flex items-center gap-3">
                <QuantitySelector
                  value={item.quantity}
                  max={Math.max(1, item.stock)}
                  onChange={(value) => updateQuantity(item.productId, value)}
                />
                <button className="text-sm text-ink-500" onClick={() => removeItem(item.productId)}>
                  Remove
                </button>
              </div>
            </div>
            <p className="text-right font-medium">{formatMoney(item.unitPrice * item.quantity)}</p>
          </article>
        ))}
      </section>
      <aside className="surface h-fit p-6">
        <h2 className="font-serif text-2xl">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Estimated tax</dt>
            <dd>{formatMoney(totals.tax)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shippingLabel("standard", totals.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-paper-200 pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatMoney(totals.total)}</dd>
          </div>
        </dl>
        <Link to="/checkout" className="mt-6 block">
          <Button className="w-full" size="lg">
            Checkout
          </Button>
        </Link>
      </aside>
    </div>
  );
}
