import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export interface ProductQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
  featured?: boolean;
  recommended?: boolean;
}

export async function listProducts(query: ProductQuery) {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, query.pageSize ?? 12));
  const where = buildWhere(query);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: buildOrderBy(query.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProductByIdOrSlug(idOrSlug: string) {
  return prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      ...productInclude,
      reviews: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 12,
      },
    },
  });
}

export async function relatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      status: "active",
    },
    include: productInclude,
    take: 4,
  });
}

export const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  inventory: true,
} satisfies Prisma.ProductInclude;

function buildWhere(query: ProductQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { status: "active" };

  if (query.category) {
    where.category = { slug: query.category };
  }
  if (query.featured) {
    where.featured = true;
  }
  if (query.recommended) {
    where.recommended = true;
  }
  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }
  if (query.minPrice != null || query.maxPrice != null) {
    where.price = {
      gte: query.minPrice,
      lte: query.maxPrice,
    };
  }

  return where;
}

function buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "rating":
      return { ratingAvg: "desc" };
    case "name":
      return { name: "asc" };
    default:
      return { createdAt: "desc" };
  }
}
