import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { api } from "../services/api";
import type { Product, Review } from "../types";
import { formatMoney } from "../lib/money";
import { ProductVisual } from "../components/ProductVisual";
import { ProductCard } from "../components/ProductCard";
import { QuantitySelector } from "../components/QuantitySelector";
import { Stars } from "../components/Stars";
import { Button } from "../components/Button";
import { ErrorState, Spinner } from "../components/States";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";

interface ProductResponse {
  product: Product & { reviews: Review[] };
  related: Product[];
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => api<ProductResponse>(`/api/products/${slug}`),
    enabled: Boolean(slug),
  });

  const save = useMutation({
    mutationFn: () =>
      api("/api/account/saved", {
        method: "POST",
        body: JSON.stringify({ productId: data?.product.id }),
      }),
    onSuccess: () => {
      toast.success("Saved to your account");
      void queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
    onError: () => toast.error("Sign in to save products"),
  });

  if (isLoading) return <Spinner />;
  if (error || !data) return <ErrorState message="This product could not be found." />;

  const { product, related } = data;
  const stock = product.inventory?.quantity ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="grid gap-3">
          {(product.images.length > 0 ? product.images : [{ id: "fallback", url: "", alt: product.name }]).slice(0, 2).map((image, index) => (
            <ProductVisual
              key={image.id}
              name={product.name}
              categorySlug={product.category.slug}
              imageUrl={image.url || product.images[0]?.url}
              className={index === 0 ? "aspect-square" : "aspect-[5/2]"}
            />
          ))}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-ink-500">{product.category.name}</p>
          <h1 className="mt-2 font-serif text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Stars value={product.ratingAvg} />
            <span className="text-sm text-ink-500">{product.reviewCount} reviews</span>
          </div>
          <p className="mt-4 text-2xl">
            {formatMoney(product.price)}
            {product.compareAt ? (
              <span className="ml-3 text-lg text-ink-500 line-through">{formatMoney(product.compareAt)}</span>
            ) : null}
          </p>
          <p className="mt-4 leading-relaxed text-ink-700">{product.description}</p>
          <p className="mt-4 text-sm">
            {stock <= 0 ? "Out of stock" : stock <= 8 ? `Low stock — ${stock} remaining` : "In stock and ready to ship"}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantitySelector value={quantity} max={Math.max(1, stock)} onChange={setQuantity} />
            <Button
              size="lg"
              disabled={stock <= 0}
              onClick={() => {
                addItem(product, quantity);
                toast.success("Added to cart");
              }}
            >
              Add to cart
            </Button>
            <Button variant="ghost" onClick={() => save.mutate()} disabled={!user}>
              <Heart size={16} /> Save
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Reviews</h2>
        <div className="mt-6 grid gap-4">
          {product.reviews.length === 0 ? <p className="text-ink-500">No reviews yet.</p> : null}
          {product.reviews.map((review) => (
            <article key={review.id} className="surface p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium">{review.title}</p>
                <Stars value={review.rating} />
              </div>
              <p className="mt-2 text-ink-700">{review.body}</p>
              <p className="mt-3 text-sm text-ink-500">{review.user.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">Related</h2>
          <Link to={`/products?category=${product.category.slug}`} className="text-sm text-pine-800">
            More in {product.category.name}
          </Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
