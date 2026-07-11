import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import type { Order } from "../../types";
import { formatMoney } from "../../lib/money";
import { ErrorState, Spinner } from "../../components/States";

export function AdminOrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => api<Order>(`/api/admin/orders/${id}`),
    enabled: Boolean(id),
  });

  if (isLoading) return <Spinner />;
  if (error || !data) return <ErrorState message="Order not found." />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">{data.orderNumber}</h1>
      <p className="mt-2 text-ink-500">
        {data.customerName} · {data.status} · {data.payments[0]?.status ?? "unpaid"}
      </p>
      <div className="surface mt-6 p-6">
        {data.items.map((item) => (
          <p key={item.id} className="flex justify-between py-2">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatMoney(item.unitPrice * item.quantity)}</span>
          </p>
        ))}
        <p className="mt-4 flex justify-between font-medium">
          <span>Total</span>
          <span>{formatMoney(data.total)}</span>
        </p>
      </div>
    </div>
  );
}
