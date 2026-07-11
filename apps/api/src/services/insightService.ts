import { prisma } from "../lib/prisma.js";
import { getAnalytics, getDashboard, getInventoryOverview, listCustomers } from "./adminService.js";

const SUGGESTED_QUESTIONS = [
  "Why did sales decrease?",
  "Which products should I promote?",
  "What should I reorder?",
  "Which products have low conversion?",
  "Who are my highest-value customers?",
];

export async function getInsightBoard() {
  const [dashboard, inventory, analytics] = await Promise.all([
    getDashboard(),
    getInventoryOverview(),
    getAnalytics(),
  ]);

  const highlights = [
    dashboard.revenueChange < 0
      ? `Revenue decreased ${Math.abs(dashboard.revenueChange)}% compared with the previous period.`
      : `Revenue increased ${dashboard.revenueChange}% compared with the previous period.`,
    analytics.categoryPerformance[0]
      ? `${analytics.categoryPerformance[0].name} generated the highest revenue this month.`
      : "Category revenue is still accumulating.",
    inventory.lowStock.length
      ? `${inventory.lowStock.length} products are approaching their low-stock threshold.`
      : "No products are currently near their low-stock threshold.",
  ];

  const lowConversion = await findLowConversionProducts();
  if (lowConversion[0]) {
    highlights.splice(
      1,
      0,
      `Product "${lowConversion[0].name}" has high traffic but below-average conversion.`
    );
  }

  return {
    highlights,
    suggestedQuestions: SUGGESTED_QUESTIONS,
  };
}

export async function answerQuestion(question: string) {
  const normalized = question.trim().toLowerCase();

  if (normalized.includes("decrease") || normalized.includes("sales")) {
    return explainSales();
  }
  if (normalized.includes("promote")) {
    return recommendPromotions();
  }
  if (normalized.includes("reorder") || normalized.includes("stock")) {
    return reorderAdvice();
  }
  if (normalized.includes("conversion")) {
    return conversionAdvice();
  }
  if (normalized.includes("customer") || normalized.includes("value")) {
    return highValueCustomers();
  }

  return {
    question,
    answer:
      "I can help with sales movement, promotions, reordering, conversion, and high-value customers. Try one of the suggested questions.",
  };
}

async function explainSales() {
  const dashboard = await getDashboard();
  const analytics = await getAnalytics();
  const topCategory = analytics.categoryPerformance[0];
  const direction = dashboard.revenueChange < 0 ? "decreased" : "increased";
  return {
    question: "Why did sales decrease?",
    answer: `Revenue ${direction} ${Math.abs(dashboard.revenueChange)}% versus the previous 30 days. Confirmed demand is concentrated in ${topCategory?.name ?? "a few categories"}, while average order value is $${(dashboard.averageOrderValue / 100).toFixed(2)}. The mix suggests fewer high-ticket checkouts rather than a store-wide outage.`,
  };
}

async function recommendPromotions() {
  const products = await findLowConversionProducts();
  const names = products.slice(0, 3).map((product) => product.name);
  return {
    question: "Which products should I promote?",
    answer: names.length
      ? `${names.join(", ")} attract browsing interest but convert below the catalog average. Feature them on the home page, pair with free-shipping messaging, and consider a bundle with higher-converting accessories.`
      : "Traffic is converting evenly across the catalog. Promote current featured products rather than discounting.",
  };
}

async function reorderAdvice() {
  const inventory = await getInventoryOverview();
  const names = [...inventory.outOfStock, ...inventory.lowStock]
    .slice(0, 5)
    .map((row) => row.product.name);
  return {
    question: "What should I reorder?",
    answer: names.length
      ? `Prioritize restocking ${names.join(", ")}. ${inventory.outOfStock.length} SKUs are at zero and ${inventory.lowStock.length} are at or below their threshold.`
      : "Stock levels look healthy. No immediate reorder is required.",
  };
}

async function conversionAdvice() {
  const products = await findLowConversionProducts();
  const lines = products.slice(0, 4).map((product) => {
    const rate = (product.conversion * 100).toFixed(1);
    return `${product.name} (${rate}% conversion from ${product.pageViews} views)`;
  });
  return {
    question: "Which products have low conversion?",
    answer: lines.length
      ? `These listings get attention without closing: ${lines.join("; ")}. Review pricing, imagery, and in-stock messaging before spending more on traffic.`
      : "No low-conversion outliers were found in the current catalog.",
  };
}

async function highValueCustomers() {
  const customers = await listCustomers();
  const top = [...customers].sort((a, b) => b.totalSpending - a.totalSpending).slice(0, 3);
  const lines = top.map(
    (customer) =>
      `${customer.name} ($${(customer.totalSpending / 100).toFixed(2)} across ${customer.orderCount} orders)`
  );
  return {
    question: "Who are my highest-value customers?",
    answer: top.length
      ? `Highest lifetime spend: ${lines.join("; ")}. They are strong candidates for early access drops and post-purchase care.`
      : "There is not enough paid order history to rank customers yet.",
  };
}

async function findLowConversionProducts() {
  const rows = await prisma.product.findMany({
    include: { stats: true, orderItems: true },
  });

  const mapped = rows
    .map((product) => {
      const pageViews = product.stats?.pageViews ?? 0;
      const units = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const conversion = pageViews > 0 ? units / pageViews : 0;
      return { name: product.name, pageViews, conversion };
    })
    .filter((row) => row.pageViews >= 40)
    .sort((a, b) => a.conversion - b.conversion);

  return mapped;
}
