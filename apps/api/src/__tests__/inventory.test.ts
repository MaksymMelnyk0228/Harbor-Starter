import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    inventory: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { prisma } from "../lib/prisma.js";
import { assertAndDecrement } from "../services/inventoryService.js";
import { HttpError } from "../utils/httpError.js";

const findUnique = prisma.inventory.findUnique as unknown as ReturnType<typeof vi.fn>;
const updateMany = prisma.inventory.updateMany as unknown as ReturnType<typeof vi.fn>;

describe("inventory behavior", () => {
  beforeEach(() => {
    findUnique.mockReset();
    updateMany.mockReset();
  });

  it("rejects quantities above available stock", async () => {
    updateMany.mockResolvedValue({ count: 0 });
    findUnique.mockResolvedValue({ productId: "p1", quantity: 2, lowStockAt: 8, reserved: 0 });

    await expect(assertAndDecrement("p1", 5, "Pro Laptop 15")).rejects.toBeInstanceOf(HttpError);
    expect(updateMany).toHaveBeenCalledWith({
      where: { productId: "p1", quantity: { gte: 5 } },
      data: { quantity: { decrement: 5 } },
    });
  });

  it("decrements stock only when enough quantity is available", async () => {
    updateMany.mockResolvedValue({ count: 1 });

    await assertAndDecrement("p1", 3, "Pro Laptop 15");

    expect(updateMany).toHaveBeenCalledWith({
      where: { productId: "p1", quantity: { gte: 3 } },
      data: { quantity: { decrement: 3 } },
    });
  });
});
