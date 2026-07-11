import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../services/api";
import { formatMoney } from "../../lib/money";
import { Spinner } from "../../components/States";

interface Analytics {
  revenueOverTime: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; revenue: number; units: number }>;
  categoryPerformance: Array<{ name: string; revenue: number; units: number }>;
}

export function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => api<Analytics>("/api/admin/analytics"),
  });

  if (isLoading || !data) return <Spinner />;

  const revenueSeries = data.revenueOverTime.map((row) => ({
    ...row,
    label: row.date.slice(5),
    revenueDollars: row.revenue / 100,
  }));

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl">Analytics</h1>
      <section className="surface p-5">
        <h2 className="mb-4 font-medium">Revenue over time</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueSeries}>
              <CartesianGrid stroke="#e6d9c6" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => formatMoney(Number(value) * 100)} />
              <Line type="monotone" dataKey="revenueDollars" stroke="#245748" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="surface p-5">
        <h2 className="mb-4 font-medium">Orders over time</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries}>
              <CartesianGrid stroke="#e6d9c6" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#c0562a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="mb-4 font-medium">Top products</h2>
          <ul className="space-y-2 text-sm">
            {data.topProducts.map((product) => (
              <li key={product.name} className="flex justify-between">
                <span>{product.name}</span>
                <span>{formatMoney(product.revenue)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="surface p-5">
          <h2 className="mb-4 font-medium">Category performance</h2>
          <ul className="space-y-2 text-sm">
            {data.categoryPerformance.map((category) => (
              <li key={category.name} className="flex justify-between">
                <span>{category.name}</span>
                <span>{formatMoney(category.revenue)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
