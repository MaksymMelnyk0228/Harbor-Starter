import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { formatMoney } from "../../lib/money";
import { Spinner } from "../../components/States";

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpending: number;
  lastOrder: { orderNumber: string; createdAt: string } | null;
}

export function AdminCustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => api<CustomerRow[]>("/api/admin/customers"),
  });

  if (isLoading || !data) return <Spinner />;

  return (
    <div>
      <h1 className="font-serif text-4xl">Customers</h1>
      <div className="surface mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-paper-200 text-ink-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th>Orders</th>
              <th>Spend</th>
              <th>Last order</th>
            </tr>
          </thead>
          <tbody>
            {data.map((customer) => (
              <tr key={customer.id} className="border-b border-paper-100">
                <td className="px-4 py-3">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-ink-500">{customer.email}</p>
                </td>
                <td>{customer.orderCount}</td>
                <td>{formatMoney(customer.totalSpending)}</td>
                <td>{customer.lastOrder ? customer.lastOrder.orderNumber : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
