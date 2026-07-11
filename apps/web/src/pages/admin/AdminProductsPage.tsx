import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { Product } from "../../types";
import { formatMoney } from "../../lib/money";
import { Spinner } from "../../components/States";

export function AdminProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api<Product[]>("/api/admin/products"),
  });

  if (isLoading || !data) return <Spinner />;

  return (
    <div>
      <h1 className="font-serif text-4xl">Products</h1>
      <div className="surface mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-paper-200 text-ink-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.id} className="border-b border-paper-100">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td>{product.category.name}</td>
                <td>{formatMoney(product.price)}</td>
                <td>{product.inventory?.quantity ?? 0}</td>
                <td className="capitalize">{product.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
