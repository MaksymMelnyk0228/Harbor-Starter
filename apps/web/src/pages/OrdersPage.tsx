import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Order } from "../types";
import { formatMoney } from "../lib/money";
import { EmptyState, Spinner } from "../components/States";
import { Button } from "../components/Button";

export function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api<Order[]>("/api/orders"),
  });

  if (isLoading) return <Spinner />;
  if (!data?.length) {
    return (
      <div className="px-4 py-20">
        <EmptyState title="No orders yet" body="When you check out, your history will live here.">
          <Link to="/products">
            <Button>Start shopping</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-4xl">Orders</h1>
      <div className="mt-8 space-y-4">
        {data.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="surface block p-5 hover:border-pine-700/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-ink-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p>{formatMoney(order.total)}</p>
                <p className="text-sm capitalize text-ink-500">{order.status}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
