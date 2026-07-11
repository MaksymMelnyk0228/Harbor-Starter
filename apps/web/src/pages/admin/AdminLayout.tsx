import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/insights", label: "AI Insights" },
];

export function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
      <aside className="border-b border-paper-200 bg-white md:w-56 md:border-b-0 md:border-r">
        <div className="px-5 py-6">
          <p className="font-serif text-2xl">Harbor</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-500">Merchant</p>
          <p className="mt-4 text-sm">{user?.name}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:flex-col">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm ${isActive ? "bg-ink-950 text-white" : "text-ink-700 hover:bg-paper-100"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 px-4 py-8 md:px-8">
        <Outlet />
      </div>
    </div>
  );
}
