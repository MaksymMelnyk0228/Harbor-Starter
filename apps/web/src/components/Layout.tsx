import { FormEvent, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

const links = [
  { to: "/products", label: "Shop" },
  { to: "/products?category=electronics", label: "Electronics" },
  { to: "/products?category=home", label: "Home" },
  { to: "/products?category=gaming", label: "Gaming" },
];

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const count = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const [search, setSearch] = useState("");

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    navigate(`/products?${params.toString()}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-paper-200 bg-paper-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="font-serif text-2xl tracking-tight">
          Harbor
        </Link>
        <nav className="hidden items-center gap-5 text-sm md:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="text-ink-700 hover:text-ink-950"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <form onSubmit={onSearch} className="ml-auto flex min-w-0 flex-1 max-w-sm items-center rounded-full border border-paper-200 bg-white px-3">
          <Search size={16} className="text-ink-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the catalog"
            className="h-10 w-full bg-transparent px-2 outline-none"
            aria-label="Search products"
          />
        </form>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              {user.role === "admin" ? (
                <Link to="/admin" className="hidden sm:inline hover:text-pine-800">
                  Dashboard
                </Link>
              ) : null}
              <Link to="/account" className="hidden sm:inline hover:text-pine-800">
                {user.name.split(" ")[0]}
              </Link>
              <button type="button" className="hidden text-ink-500 sm:inline" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
          <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full bg-ink-950 text-white" aria-label="Cart">
            <ShoppingBag size={16} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay-500 px-1 text-[11px]">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-paper-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">Harbor</p>
          <p className="mt-2 max-w-sm text-sm text-ink-500">
            Quiet tools for work and home. Designed to last, shipped with care.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Shop</p>
          <p className="mt-2 text-ink-500">Electronics · Computers · Home · Gaming · Mobile</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Help</p>
          <p className="mt-2 text-ink-500">Orders, shipping, and returns from your account. Free standard shipping over $75.</p>
        </div>
      </div>
    </footer>
  );
}
