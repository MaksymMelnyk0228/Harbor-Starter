import { prisma } from "../lib/prisma.js";
import * as products from "../repositories/productRepository.js";
import { HttpError } from "../utils/httpError.js";

export async function listProducts(query: products.ProductQuery) {
  return products.listProducts(query);
}

export async function getProduct(idOrSlug: string) {
  const product = await products.getProductByIdOrSlug(idOrSlug);
  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  await prisma.productStat.upsert({
    where: { productId: product.id },
    update: { pageViews: { increment: 1 } },
    create: { productId: product.id, pageViews: 1, addToCarts: 0 },
  });

  const related = await products.relatedProducts(product.categoryId, product.id);
  return { product, related };
}

export async function listCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getHomeData() {
  const [featured, recommended, categories] = await Promise.all([
    products.listProducts({ featured: true, pageSize: 8, sort: "rating" }),
    products.listProducts({ recommended: true, pageSize: 8, sort: "rating" }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return {
    featured: featured.items,
    recommended: recommended.items,
    categories,
    promo: {
      eyebrow: "Spring restock",
      title: "Quiet tools for a louder life.",
      body: "Studio-grade audio, travel-ready computing, and home pieces designed to last. Free standard shipping on orders over $75.",
      cta: "Shop featured",
      href: "/products?featured=1",
    },
  };
}
