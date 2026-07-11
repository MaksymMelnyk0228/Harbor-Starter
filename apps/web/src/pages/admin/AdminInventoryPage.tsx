import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { Product } from "../../types";
import { formatMoney } from "../../lib/money";
import { Spinner } from "../../components/States";

interface InventoryResponse {
  items: Array<{
    id: string;
    quantity: number;
    lowStockAt: number;
    product: Product;
  }>;
  lowStock: Array<{ product: Product; quantity: number }>;
  outOfStock: Array<{ product: Product; quantity: number }>;
  inventoryValue: number;
  skuCount: number;
}

export function AdminInventoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: () => api<InventoryResponse>("/api/admin/inventory"),
  });

  if (isLoading || !data) return <Spinner />;

  return (
    <div>
      <h1 className="font-serif text-4xl">Inventory</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="surface p-5">
          <p className="text-sm text-ink-500">Inventory value</p>
          <p className="mt-2 font-serif text-3xl">{formatMoney(data.inventoryValue)}</p>
        </article>
        <article className="surface p-5">
          <p className="text-sm text-ink-500">Low stock</p>
          <p className="mt-2 font-serif text-3xl">{data.lowStock.length}</p>
        </article>
        <article className="surface p-5">
          <p className="text-sm text-ink-500">Out of stock</p>
          <p className="mt-2 font-serif text-3xl">{data.outOfStock.length}</p>
        </article>
      </div>
      <div className="surface mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-paper-200 text-ink-500">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th>On hand</th>
              <th>Threshold</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row) => (
              <tr key={row.id} className="border-b border-paper-100">
                <td className="px-4 py-3">{row.product.name}</td>
                <td>{row.quantity}</td>
                <td>{row.lowStockAt}</td>
                <td>{formatMoney(row.quantity * row.product.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
