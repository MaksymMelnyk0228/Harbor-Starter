import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { api, ApiError } from "../services/api";
import type { Order } from "../types";
import { estimateCartTotals, formatMoney, shippingLabel } from "../lib/money";
import { Field } from "../components/Field";
import { Button } from "../components/Button";
import { EmptyState } from "../components/States";

export function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [pending, setPending] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `pay-${Date.now()}`
  );
  const totals = useMemo(() => estimateCartTotals(items, shippingMethod), [items, shippingMethod]);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    fullName: user?.name ?? "",
    line1: "",
    city: "",
    region: "",
    postalCode: "",
    country: "United States",
    phone: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
  });

  if (items.length === 0 && !orderId) {
    return (
      <div className="px-4 py-20">
        <EmptyState title="Nothing to check out" body="Add products before placing an order.">
          <Link to="/products">
            <Button>Browse products</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function payExisting(id: string) {
    const result = await api<{ order: Order; payment: { status: string; failureReason?: string } }>(
      "/api/payments",
      {
        method: "POST",
        body: JSON.stringify({
          orderId: id,
          provider: "mock_card",
          cardNumber: form.cardNumber,
          expiration: form.expiration,
          cvv: form.cvv,
          idempotencyKey,
        }),
      }
    );
    return result;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    setPending(true);
    setPaymentError(null);
    try {
      let currentOrderId = orderId;
      if (!currentOrderId) {
        const order = await api<Order>("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            shippingMethod,
            address: {
              label: "Checkout",
              fullName: form.fullName,
              line1: form.line1,
              city: form.city,
              region: form.region,
              postalCode: form.postalCode,
              country: form.country,
              phone: form.phone,
            },
            items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          }),
        });
        currentOrderId = order.id;
        setOrderId(order.id);
      }

      const result = await payExisting(currentOrderId);
      if (result.payment.status !== "paid") {
        setPaymentError(result.payment.failureReason ?? "Payment failed");
        toast.error(result.payment.failureReason ?? "Payment failed");
        return;
      }

      clear();
      toast.success("Order placed");
      navigate(`/orders/${result.order.id}`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Checkout failed";
      setPaymentError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <h1 className="font-serif text-4xl">Checkout</h1>
        <section className="surface p-6">
          <h2 className="font-serif text-2xl">Customer</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            <Field label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
        </section>
        <section className="surface p-6">
          <h2 className="font-serif text-2xl">Shipping address</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Recipient" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
            <Field label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            <div className="md:col-span-2">
              <Field label="Address" value={form.line1} onChange={(e) => update("line1", e.target.value)} required />
            </div>
            <Field label="City" value={form.city} onChange={(e) => update("city", e.target.value)} required />
            <Field label="State" value={form.region} onChange={(e) => update("region", e.target.value)} required />
            <Field label="Postal code" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} required />
            <Field label="Country" value={form.country} onChange={(e) => update("country", e.target.value)} required />
          </div>
        </section>
        <section className="surface p-6">
          <h2 className="font-serif text-2xl">Shipping method</h2>
          <div className="mt-4 grid gap-3">
            {(["standard", "express"] as const).map((method) => (
              <label key={method} className="flex cursor-pointer items-center justify-between rounded-xl border border-paper-200 px-4 py-3">
                <span>
                  <input
                    type="radio"
                    className="mr-3"
                    checked={shippingMethod === method}
                    onChange={() => setShippingMethod(method)}
                  />
                  {method === "standard" ? "Standard (5–7 days)" : "Express (2 days)"}
                </span>
                <span>{method === "express" ? "$14.99" : "Calculated at total"}</span>
              </label>
            ))}
          </div>
        </section>
        <section className="surface p-6">
          <h2 className="font-serif text-2xl">Payment</h2>
          <p className="mt-2 text-sm text-ink-500">
            Your card is charged when you place the order. Harbor stores only the last four digits.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <Field
                label="Card number"
                value={form.cardNumber}
                onChange={(e) => update("cardNumber", e.target.value)}
                required
                autoComplete="cc-number"
                inputMode="numeric"
                placeholder="Card number"
              />
            </div>
            <Field
              label="Expiration"
              value={form.expiration}
              onChange={(e) => update("expiration", e.target.value)}
              required
              autoComplete="cc-exp"
              placeholder="MM/YY"
            />
            <Field
              label="CVV"
              value={form.cvv}
              onChange={(e) => update("cvv", e.target.value)}
              required
              autoComplete="cc-csc"
              placeholder="CVV"
            />
          </div>
          {paymentError ? <p className="mt-3 text-sm text-clay-600">{paymentError}</p> : null}
        </section>
      </div>
      <aside className="surface h-fit p-6">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>{formatMoney(totals.tax)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shippingLabel(shippingMethod, totals.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-paper-200 pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatMoney(totals.total)}</dd>
          </div>
        </dl>
        <Button type="submit" className="mt-6 w-full" size="lg" disabled={pending}>
          {pending ? "Placing order…" : orderId ? "Retry payment" : "Place order"}
        </Button>
      </aside>
    </form>
  );
}
