import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Category, Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { ErrorState, Spinner } from "../components/States";
import { Button } from "../components/Button";

interface HomeData {
  featured: Product[];
  recommended: Product[];
  categories: Category[];
  promo: { eyebrow: string; title: string; body: string; cta: string; href: string };
}

export function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["home"],
    queryFn: () => api<HomeData>("/api/home"),
  });

  if (isLoading) return <Spinner label="Opening the shop" />;
  if (error || !data) return <ErrorState message="Could not load the storefront." />;

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">{data.promo.eyebrow}</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">{data.promo.title}</h1>
          <p className="mt-4 max-w-md text-lg text-ink-700">{data.promo.body}</p>
          <div className="mt-8 flex gap-3">
            <Link to={data.promo.href}>
              <Button size="lg">{data.promo.cta}</Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="ghost">
                Browse all
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {data.featured.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-paper-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-6">
          {data.categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="rounded-2xl bg-paper-50 px-4 py-5 transition hover:-translate-y-0.5"
            >
              <p className="font-medium">{category.name}</p>
              <p className="mt-1 text-sm text-ink-500">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">Featured</h2>
          <Link to="/products" className="text-sm text-pine-800">
            View catalog
          </Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-serif text-3xl">Recommended</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.recommended.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
