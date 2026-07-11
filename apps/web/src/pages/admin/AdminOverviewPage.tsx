import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { formatMoney } from "../../lib/money";
import { Spinner } from "../../components/States";

interface Dashboard {
  revenue: number;
  orders: number;
  customers: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueChange: number;
  orderChange: number;
}

export function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api<Dashboard>("/api/admin/dashboard"),
  });

  if (isLoading || !data) return <Spinner />;

  const cards = [
    { label: "Revenue (30d)", value: formatMoney(data.revenue), hint: `${data.revenueChange}% vs prior` },
    { label: "Orders", value: String(data.orders), hint: `${data.orderChange}% vs prior` },
    { label: "Customers", value: String(data.customers), hint: "All time" },
    { label: "Average order", value: formatMoney(data.averageOrderValue), hint: "Paid orders" },
    { label: "Conversion", value: `${(data.conversionRate * 100).toFixed(2)}%`, hint: "Orders / product views" },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl">Overview</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="surface p-5">
            <p className="text-sm text-ink-500">{card.label}</p>
            <p className="mt-2 font-serif text-3xl">{card.value}</p>
            <p className="mt-2 text-xs text-ink-500">{card.hint}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
