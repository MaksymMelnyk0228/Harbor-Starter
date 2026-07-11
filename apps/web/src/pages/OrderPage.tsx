import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import type { Order } from "../types";
import { formatMoney, shippingLabel } from "../lib/money";
import { ErrorState, Spinner } from "../components/States";
import { Button } from "../components/Button";

export function OrderPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api<Order>(`/api/orders/${id}`),
    enabled: Boolean(id),
  });

  if (isLoading) return <Spinner />;
  if (error || !data) return <ErrorState message="Order not found." />;

  const payment = data.payments[0];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-pine-700">Order confirmation</p>
      <h1 className="mt-2 font-serif text-4xl">{data.orderNumber}</h1>
      <p className="mt-2 text-ink-500">
        Status: {data.status} · Payment: {payment?.status ?? "unpaid"}
      </p>
      <div className="surface mt-8 p-6">
        <ul className="space-y-3">
          {data.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(data.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>{formatMoney(data.tax)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shippingLabel(data.shippingMethod, data.shipping)}</dd>
          </div>
          <div className="flex justify-between text-base font-medium">
            <dt>Total</dt>
            <dd>{formatMoney(data.total)}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="surface p-5">
          <h2 className="font-medium">Shipping address</h2>
          {data.address ? (
            <p className="mt-2 text-sm text-ink-700">
              {data.address.fullName}
              <br />
              {data.address.line1}
              <br />
              {data.address.city}, {data.address.region} {data.address.postalCode}
            </p>
          ) : null}
        </div>
        <div className="surface p-5">
          <h2 className="font-medium">Delivery</h2>
          <p className="mt-2 text-sm text-ink-700">
            Estimated {data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleDateString() : "soon"}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            {payment?.last4 ? `Charged to card ending ${payment.last4}` : "Payment pending"}
          </p>
        </div>
      </div>
      <Link to="/orders" className="mt-8 inline-block">
        <Button variant="ghost">View all orders</Button>
      </Link>
    </div>
  );
}
