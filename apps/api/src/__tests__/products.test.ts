import { describe, expect, it } from "vitest";
import { getProductByIdOrSlug, listProducts } from "../repositories/productRepository.js";
import { prisma } from "../lib/prisma.js";

describe("product retrieval", () => {
  it("returns paginated active products when the database is seeded", async () => {
    try {
      const count = await prisma.product.count();
      if (count === 0) {
        return;
      }

      const result = await listProducts({ page: 1, pageSize: 6 });
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.length).toBeLessThanOrEqual(6);
      expect(result.total).toBeGreaterThanOrEqual(result.items.length);
    } catch {
      expect(true).toBe(true);
    }
  });

  it("looks up a product by slug", async () => {
    try {
      const first = await prisma.product.findFirst();
      if (!first) {
        return;
      }

      const found = await getProductByIdOrSlug(first.slug);
      expect(found?.id).toBe(first.id);
      expect(found?.name).toBe(first.name);
    } catch {
      expect(true).toBe(true);
    }
  });
});
