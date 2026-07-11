import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Order } from "../../types";
import { formatMoney } from "../../lib/money";
import { Spinner } from "../../components/States";

export function AdminOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api<Order[]>("/api/admin/orders"),
  });

  if (isLoading || !data) return <Spinner />;

  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <div className="surface mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-paper-200 text-ink-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order.id} className="border-b border-paper-100">
                <td className="px-4 py-3">
                  <Link to={`/admin/orders/${order.id}`} className="font-medium text-pine-800">
                    {order.orderNumber}
                  </Link>
                </td>
                <td>{order.customerName}</td>
                <td className="capitalize">{order.status}</td>
                <td>{order.payments[0]?.status ?? "unpaid"}</td>
                <td>{formatMoney(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
