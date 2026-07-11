import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import type { Category, Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { EmptyState, ErrorState, Spinner } from "../components/States";
import { Button } from "../components/Button";

interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "name", label: "Name" },
];

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "newest";
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const page = Number(params.get("page") ?? "1");

  const query = new URLSearchParams({
    page: String(page),
    pageSize: "12",
    sort,
  });
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (minPrice) query.set("minPrice", String(Math.round(Number(minPrice) * 100)));
  if (maxPrice) query.set("maxPrice", String(Math.round(Number(maxPrice) * 100)));
  if (params.get("featured")) query.set("featured", "1");

  const products = useQuery({
    queryKey: ["products", query.toString()],
    queryFn: () => api<ProductPage>(`/api/products?${query.toString()}`),
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => api<Category[]>("/api/categories"),
  });

  function update(next: Record<string, string>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => {
      if (value) merged.set(key, value);
      else merged.delete(key);
    });
    if (!("page" in next)) merged.set("page", "1");
    setParams(merged);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-6">
        <h1 className="font-serif text-3xl">Catalog</h1>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Category</span>
          <select
            className="h-11 w-full rounded-xl border border-paper-200 bg-white px-3"
            value={category}
            onChange={(event) => update({ category: event.target.value })}
          >
            <option value="">All</option>
            {categories.data?.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Min $</span>
            <input
              className="h-11 w-full rounded-xl border border-paper-200 px-3"
              value={minPrice}
              onChange={(event) => update({ minPrice: event.target.value })}
              inputMode="numeric"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Max $</span>
            <input
              className="h-11 w-full rounded-xl border border-paper-200 px-3"
              value={maxPrice}
              onChange={(event) => update({ maxPrice: event.target.value })}
            />
          </label>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Sort</span>
          <select
            className="h-11 w-full rounded-xl border border-paper-200 bg-white px-3"
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
          >
            {sorts.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </aside>

      <section>
        {products.isLoading ? <Spinner /> : null}
        {products.error ? <ErrorState message="Could not load products." /> : null}
        {products.data && products.data.items.length === 0 ? (
          <EmptyState title="No matching products" body="Try a broader search or clear the filters.">
            <Button variant="secondary" onClick={() => setParams(new URLSearchParams())}>
              Clear filters
            </Button>
          </EmptyState>
        ) : null}
        {products.data && products.data.items.length > 0 ? (
          <>
            <p className="mb-6 text-sm text-ink-500">{products.data.total} products</p>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {products.data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 flex justify-center gap-3">
              <Button
                variant="ghost"
                disabled={page <= 1}
                onClick={() => update({ page: String(page - 1) })}
              >
                Previous
              </Button>
              <span className="grid h-11 place-items-center text-sm">
                {page} / {products.data.totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={page >= products.data.totalPages}
                onClick={() => update({ page: String(page + 1) })}
              >
                Next
              </Button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
