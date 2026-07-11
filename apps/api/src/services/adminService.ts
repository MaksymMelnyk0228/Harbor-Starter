import { prisma } from "../lib/prisma.js";
import { orderInclude } from "./orderService.js";
import { HttpError } from "../utils/httpError.js";

function startOfDaysAgo(days: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

export async function getDashboard() {
  const since = startOfDaysAgo(30);
  const previousSince = startOfDaysAgo(60);

  const [orders, previousOrders, customers, paidOrders, visits] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: since } },
      include: { payments: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: previousSince, lt: since } },
      include: { payments: true },
    }),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.order.findMany({
      where: { createdAt: { gte: since }, status: { in: ["confirmed", "shipped", "delivered"] } },
    }),
    prisma.productStat.aggregate({ _sum: { pageViews: true } }),
  ]);

  const revenue = sumPaid(orders);
  const previousRevenue = sumPaid(previousOrders);
  const aov = paidOrders.length ? Math.round(revenue / paidOrders.length) : 0;
  const pageViews = visits._sum.pageViews ?? 0;
  const conversionRate = pageViews > 0 ? paidOrders.length / pageViews : 0;

  return {
    revenue,
    orders: orders.length,
    customers,
    averageOrderValue: aov,
    conversionRate,
    revenueChange: percentChange(revenue, previousRevenue),
    orderChange: percentChange(orders.length, previousOrders.length),
  };
}

export async function listAdminOrders() {
  return prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getAdminOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
  if (!order) {
    throw new HttpError(404, "Order not found");
  }
  return order;
}

export async function listAdminProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      inventory: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getInventoryOverview() {
  const rows = await prisma.inventory.findMany({
    include: {
      product: { include: { category: true } },
    },
    orderBy: { quantity: "asc" },
  });

  const lowStock = rows.filter(
    (row) => row.quantity > 0 && row.quantity <= row.lowStockAt
  );
  const outOfStock = rows.filter((row) => row.quantity <= 0);
  const inventoryValue = rows.reduce(
    (sum, row) => sum + row.quantity * row.product.price,
    0
  );

  return {
    items: rows,
    lowStock,
    outOfStock,
    inventoryValue,
    skuCount: rows.length,
  };
}

export async function listCustomers() {
  const customers = await prisma.user.findMany({
    where: { role: "customer" },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { payments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return customers.map((customer) => {
    const paid = customer.orders.filter((order) =>
      order.payments.some((payment) => payment.status === "paid")
    );
    const totalSpending = paid.reduce((sum, order) => sum + order.total, 0);
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      orderCount: customer.orders.length,
      totalSpending,
      lastOrder: customer.orders[0] ?? null,
      createdAt: customer.createdAt,
    };
  });
}

export async function getAnalytics() {
  const since = startOfDaysAgo(30);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    include: {
      items: { include: { product: { include: { category: true } } } },
      payments: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const byDay = new Map<string, { revenue: number; orders: number }>();
  for (let i = 29; i >= 0; i -= 1) {
    const day = startOfDaysAgo(i).toISOString().slice(0, 10);
    byDay.set(day, { revenue: 0, orders: 0 });
  }

  const productSales = new Map<string, { name: string; revenue: number; units: number }>();
  const categorySales = new Map<string, { name: string; revenue: number; units: number }>();

  for (const order of orders) {
    const paid = order.payments.some((payment) => payment.status === "paid");
    const day = order.createdAt.toISOString().slice(0, 10);
    const bucket = byDay.get(day) ?? { revenue: 0, orders: 0 };
    bucket.orders += 1;
    if (paid) bucket.revenue += order.total;
    byDay.set(day, bucket);

    if (!paid) continue;
    for (const item of order.items) {
      const current = productSales.get(item.productId) ?? {
        name: item.name,
        revenue: 0,
        units: 0,
      };
      current.revenue += item.unitPrice * item.quantity;
      current.units += item.quantity;
      productSales.set(item.productId, current);

      const categoryName = item.product.category.name;
      const cat = categorySales.get(categoryName) ?? {
        name: categoryName,
        revenue: 0,
        units: 0,
      };
      cat.revenue += item.unitPrice * item.quantity;
      cat.units += item.quantity;
      categorySales.set(categoryName, cat);
    }
  }

  return {
    revenueOverTime: [...byDay.entries()].map(([date, value]) => ({ date, ...value })),
    topProducts: [...productSales.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8),
    categoryPerformance: [...categorySales.values()].sort((a, b) => b.revenue - a.revenue),
  };
}

function sumPaid(orders: Array<{ total: number; payments: Array<{ status: string }> }>) {
  return orders
    .filter((order) => order.payments.some((payment) => payment.status === "paid"))
    .reduce((sum, order) => sum + order.total, 0);
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
