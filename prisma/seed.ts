import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ProductSeed = {
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAt?: number;
  category: string;
  featured?: boolean;
  recommended?: boolean;
  stock: number;
  lowStockAt?: number;
  views: number;
  addToCarts: number;
};

const categories = [
  { slug: "electronics", name: "Electronics", description: "Audio, displays, and everyday studio gear." },
  { slug: "computers", name: "Computers", description: "Laptops, desktops, and deskside machines." },
  { slug: "accessories", name: "Accessories", description: "Cables, cases, and carry goods." },
  { slug: "home", name: "Home", description: "Quiet objects for living spaces." },
  { slug: "gaming", name: "Gaming", description: "Controllers, headsets, and storage." },
  { slug: "mobile", name: "Mobile", description: "Phones, readers, and on-the-go power." },
];

const products: ProductSeed[] = [
  {
    slug: "cloud-cans",
    name: "Cloud Cans Wireless",
    description: "Over-ear headphones with a long-endurance battery, memory-foam cups, and a quiet ANC profile for travel days.",
    price: 24900,
    compareAt: 29900,
    category: "electronics",
    featured: true,
    recommended: true,
    stock: 42,
    views: 220,
    addToCarts: 48,
  },
  {
    slug: "lumen-monitor-27",
    name: "Lumen 27 4K Monitor",
    description: "A 27-inch 4K IPS display with a matte coating, USB-C charging, and accurate color for design work.",
    price: 57900,
    category: "electronics",
    featured: true,
    stock: 18,
    views: 160,
    addToCarts: 22,
  },
  {
    slug: "type-k-mechanical",
    name: "Type-K Mechanical Keyboard",
    description: "Hot-swappable switches, a gasket mount, and a coiled cable. Built for long writing sessions.",
    price: 18900,
    category: "electronics",
    recommended: true,
    stock: 36,
    views: 140,
    addToCarts: 40,
  },
  {
    slug: "harbor-hub",
    name: "Harbor USB-C Hub",
    description: "Eight ports in a milled aluminum body: HDMI 2.1, SD, two USB-A, and 100W pass-through charging.",
    price: 7900,
    category: "electronics",
    stock: 80,
    views: 95,
    addToCarts: 31,
  },
  {
    slug: "frame-webcam",
    name: "Frame Webcam Pro",
    description: "4K sensor, a privacy shutter, and software that keeps your background honest rather than fake.",
    price: 12900,
    category: "electronics",
    stock: 24,
    views: 110,
    addToCarts: 19,
  },
  {
    slug: "pebble-speaker",
    name: "Pebble Bluetooth Speaker",
    description: "A dense little driver with a 16-hour battery and a handle that actually fits a finger.",
    price: 8900,
    category: "electronics",
    recommended: true,
    stock: 54,
    views: 88,
    addToCarts: 27,
  },
  {
    slug: "pro-laptop-15",
    name: "Pro Laptop 15",
    description: "A 15-inch workstation laptop with a 120Hz panel, 32GB memory, and an all-day battery. The flagship of the catalog.",
    price: 189900,
    compareAt: 209900,
    category: "computers",
    featured: true,
    stock: 9,
    views: 640,
    addToCarts: 18,
  },
  {
    slug: "ultrabook-13",
    name: "Ultrabook 13",
    description: "One kilogram, a silent keyboard, and a 20-hour claim that holds up on cross-country flights.",
    price: 129900,
    category: "computers",
    featured: true,
    recommended: true,
    stock: 14,
    views: 210,
    addToCarts: 26,
  },
  {
    slug: "nook-mini-pc",
    name: "Nook Mini PC",
    description: "A palm-sized desktop for media shelves and home offices. Dual 4K output, quiet fan, plenty of ports.",
    price: 64900,
    category: "computers",
    stock: 21,
    views: 90,
    addToCarts: 14,
  },
  {
    slug: "lift-laptop-stand",
    name: "Lift Laptop Stand",
    description: "A CNC aluminum stand that raises any notebook to eye height without wobble.",
    price: 6900,
    category: "computers",
    recommended: true,
    stock: 70,
    views: 75,
    addToCarts: 33,
  },
  {
    slug: "field-backpack",
    name: "Field Leather Backpack",
    description: "Vegetable-tanned leather, a padded 16-inch sleeve, and hardware that will outlast the straps.",
    price: 24900,
    category: "accessories",
    featured: true,
    stock: 16,
    views: 150,
    addToCarts: 21,
  },
  {
    slug: "slate-desk-mat",
    name: "Slate Desk Mat",
    description: "A 4mm natural rubber mat with a wool-blend surface. Large enough for keyboard and notebook.",
    price: 4900,
    category: "accessories",
    stock: 90,
    views: 60,
    addToCarts: 28,
  },
  {
    slug: "cable-kit",
    name: "Everyday Cable Kit",
    description: "Braided USB-C, Lightning, and a short 100W charge cable in a zip pouch.",
    price: 2900,
    category: "accessories",
    stock: 120,
    views: 55,
    addToCarts: 40,
  },
  {
    slug: "folio-phone-case",
    name: "Folio Phone Case",
    description: "A slim leather folio with a microfiber lining and a hidden card slot.",
    price: 4500,
    category: "accessories",
    recommended: true,
    stock: 6,
    lowStockAt: 8,
    views: 48,
    addToCarts: 12,
  },
  {
    slug: "disc-charger",
    name: "Disc Wireless Charger",
    description: "A 15W puck with a fabric top and a cable that does not fight the desk.",
    price: 3900,
    category: "accessories",
    stock: 4,
    lowStockAt: 8,
    views: 70,
    addToCarts: 16,
  },
  {
    slug: "ceramic-lamp",
    name: "Ceramic Table Lamp",
    description: "Hand-glazed stoneware, a linen shade, and a dimmer switch. Warm light, no app required.",
    price: 15900,
    category: "home",
    featured: true,
    stock: 22,
    views: 100,
    addToCarts: 17,
  },
  {
    slug: "pour-over-kettle",
    name: "Pour-Over Kettle",
    description: "Gooseneck, 1.0L, variable temperature, and a handle that stays cool.",
    price: 8900,
    category: "home",
    recommended: true,
    stock: 33,
    views: 82,
    addToCarts: 24,
  },
  {
    slug: "linen-throw",
    name: "Washed Linen Throw",
    description: "Stonewashed European linen, 50 by 70 inches. Gets better after every wash.",
    price: 7900,
    category: "home",
    stock: 28,
    views: 64,
    addToCarts: 15,
  },
  {
    slug: "hearth-purifier",
    name: "Hearth Air Purifier",
    description: "HEPA and carbon in a low-noise tower sized for bedrooms and studios.",
    price: 22900,
    category: "home",
    stock: 11,
    views: 93,
    addToCarts: 11,
  },
  {
    slug: "climate-dial",
    name: "Climate Dial Thermostat",
    description: "A wall thermostat with a physical dial and a schedule you can set without an account.",
    price: 11900,
    category: "home",
    stock: 19,
    views: 58,
    addToCarts: 9,
  },
  {
    slug: "vector-controller",
    name: "Vector Wireless Controller",
    description: "Hall-effect sticks, a 40-hour battery, and a shape that works for long sessions.",
    price: 6900,
    category: "gaming",
    featured: true,
    recommended: true,
    stock: 47,
    views: 180,
    addToCarts: 52,
  },
  {
    slug: "rift-headset",
    name: "Rift Gaming Headset",
    description: "Closed-back cups, a broadcast-grade mic, and a USB dongle that just works.",
    price: 14900,
    category: "gaming",
    stock: 31,
    views: 120,
    addToCarts: 29,
  },
  {
    slug: "ember-ssd-2tb",
    name: "Ember 2TB SSD",
    description: "Gen4 speeds, a compact heatsink, and enough room for a full game library.",
    price: 17900,
    category: "gaming",
    recommended: true,
    stock: 3,
    lowStockAt: 8,
    views: 200,
    addToCarts: 44,
  },
  {
    slug: "apex-wheel",
    name: "Apex Racing Wheel",
    description: "Direct-drive feel in a desk-friendly form. Pedals included.",
    price: 39900,
    category: "gaming",
    stock: 0,
    lowStockAt: 5,
    views: 25,
    addToCarts: 8,
  },
  {
    slug: "north-phone",
    name: "North Flagship Phone",
    description: "A 6.3-inch OLED, 512GB, and a camera that prefers natural color over punch.",
    price: 99900,
    category: "mobile",
    featured: true,
    stock: 12,
    views: 300,
    addToCarts: 20,
  },
  {
    slug: "page-reader",
    name: "Page E-Reader",
    description: "7-inch paper-like display, weeks of battery, and a warm light for late chapters.",
    price: 15900,
    category: "mobile",
    recommended: true,
    stock: 26,
    views: 77,
    addToCarts: 18,
  },
  {
    slug: "current-bank",
    name: "Current 20K Power Bank",
    description: "20,000 mAh, 65W USB-C, and a display that shows actual remaining time.",
    price: 6900,
    category: "mobile",
    stock: 58,
    views: 102,
    addToCarts: 37,
  },
  {
    slug: "clip-wallet",
    name: "Clip Magnetic Wallet",
    description: "Three cards, a tracking-compatible insert, and a grip that does not collect lint.",
    price: 3500,
    category: "mobile",
    stock: 2,
    lowStockAt: 8,
    views: 66,
    addToCarts: 14,
  },
  {
    slug: "clear-screen-kit",
    name: "Clear Screen Kit",
    description: "Two tempered sheets, a dust-free jig, and a cloth that you will actually keep.",
    price: 1900,
    category: "mobile",
    stock: 140,
    views: 40,
    addToCarts: 22,
  },
  {
    slug: "studio-mic",
    name: "Studio USB Microphone",
    description: "Cardioid condenser, a desktop arm, and onboard monitoring. Ready for calls and voice work.",
    price: 16900,
    category: "electronics",
    stock: 17,
    views: 85,
    addToCarts: 13,
  },
  {
    slug: "dock-bar",
    name: "Dock Bar 12-in-1",
    description: "A single-cable docking station with dual 4K, 2.5G ethernet, and 98W charge.",
    price: 19900,
    category: "computers",
    stock: 20,
    views: 112,
    addToCarts: 16,
  },
  {
    slug: "night-shift-mouse",
    name: "Night Shift Mouse",
    description: "A quiet, high-polling mouse with a ceramic scroll wheel and replaceable switches.",
    price: 9900,
    category: "gaming",
    recommended: true,
    stock: 39,
    views: 98,
    addToCarts: 30,
  },
];

const customers = [
  { email: "customer@harbor.co", name: "Jordan Hale", password: "customer123" },
  { email: "ava.chen@example.com", name: "Ava Chen", password: "password123" },
  { email: "marcus.hale@example.com", name: "Marcus Hale", password: "password123" },
  { email: "priya.nair@example.com", name: "Priya Nair", password: "password123" },
  { email: "jonah.wright@example.com", name: "Jonah Wright", password: "password123" },
  { email: "elena.rossi@example.com", name: "Elena Rossi", password: "password123" },
  { email: "caleb.okonkwo@example.com", name: "Caleb Okonkwo", password: "password123" },
  { email: "mina.park@example.com", name: "Mina Park", password: "password123" },
  { email: "theo.laurent@example.com", name: "Theo Laurent", password: "password123" },
  { email: "sage.williams@example.com", name: "Sage Williams", password: "password123" },
];

const reviewPool = [
  { rating: 5, title: "Exactly what I wanted", body: "Build quality is obvious in the first week. Shipping was quick and the packaging was thoughtful." },
  { rating: 4, title: "Worth the price", body: "A little heavy, but the finish and daily use more than make up for it." },
  { rating: 5, title: "Daily driver", body: "Replaced something I had been compromising on for years." },
  { rating: 3, title: "Almost", body: "Great design, software could be simpler. Still keeping it." },
  { rating: 5, title: "Quiet luxury", body: "Nothing flashy, everything works. That is the point." },
  { rating: 4, title: "Solid gift", body: "Bought a second one after using the first for a month." },
];

function daysAgo(days: number, hour = 12): Date {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

async function syncProductImages() {
  const rows = await prisma.product.findMany({ include: { images: true } });
  for (const product of rows) {
    const url = `/images/products/${product.slug}.jpg`;
    const primary = product.images[0];
    if (!primary) {
      await prisma.productImage.create({
        data: { productId: product.id, url, alt: product.name, sortOrder: 0 },
      });
      continue;
    }
    await prisma.productImage.update({
      where: { id: primary.id },
      data: { url, alt: product.name },
    });
    if (product.images.length > 1) {
      await prisma.productImage.deleteMany({
        where: { productId: product.id, id: { not: primary.id } },
      });
    }
  }
}

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    await syncProductImages();
    console.log("Product images updated.");
    return;
  }

  const categoryRecords = [];
  for (const category of categories) {
    categoryRecords.push(
      await prisma.category.create({ data: category })
    );
  }
  const categoryBySlug = Object.fromEntries(categoryRecords.map((row) => [row.slug, row]));

  const productRecords = [];
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        categoryId: categoryBySlug[product.category].id,
        featured: Boolean(product.featured),
        recommended: Boolean(product.recommended),
        status: "active",
        images: {
          create: [
            { url: `/images/products/${product.slug}.jpg`, alt: product.name, sortOrder: 0 },
          ],
        },
        inventory: {
          create: {
            quantity: product.stock,
            lowStockAt: product.lowStockAt ?? 8,
          },
        },
        stats: {
          create: {
            pageViews: product.views,
            addToCarts: product.addToCarts,
          },
        },
      },
    });
    productRecords.push(created);
  }
  const productBySlug = Object.fromEntries(productRecords.map((row) => [row.slug, row]));

  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@harbor.co",
      name: "Harbor Admin",
      passwordHash: adminHash,
      role: "admin",
    },
  });

  const userRecords = [];
  for (const customer of customers) {
    const passwordHash = await bcrypt.hash(customer.password, 10);
    const user = await prisma.user.create({
      data: {
        email: customer.email,
        name: customer.name,
        passwordHash,
        role: "customer",
        addresses: {
          create: {
            label: "Home",
            fullName: customer.name,
            line1: `${100 + userRecords.length} Market Street`,
            city: "Portland",
            region: "OR",
            postalCode: "97201",
            country: "United States",
            phone: "503-555-0140",
            isDefault: true,
          },
        },
      },
      include: { addresses: true },
    });
    userRecords.push(user);
  }

  for (const [index, product] of productRecords.entries()) {
    const reviewsForProduct = index % 3 === 0 ? 3 : index % 2 === 0 ? 2 : 1;
    let ratingSum = 0;
    for (let i = 0; i < reviewsForProduct; i += 1) {
      const template = reviewPool[(index + i) % reviewPool.length];
      const author = userRecords[(index + i) % userRecords.length];
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: author.id,
          rating: template.rating,
          title: template.title,
          body: template.body,
        },
      });
      ratingSum += template.rating;
    }
    await prisma.product.update({
      where: { id: product.id },
      data: {
        reviewCount: reviewsForProduct,
        ratingAvg: Math.round((ratingSum / reviewsForProduct) * 10) / 10,
      },
    });
  }

  const demoUser = userRecords[0];
  await prisma.savedProduct.createMany({
    data: [
      { userId: demoUser.id, productId: productBySlug["pro-laptop-15"].id },
      { userId: demoUser.id, productId: productBySlug["cloud-cans"].id },
      { userId: demoUser.id, productId: productBySlug["ceramic-lamp"].id },
    ],
  });

  const orderBlueprints: Array<{
    userIndex: number;
    daysAgo: number;
    status: string;
    paid: boolean;
    method: "standard" | "express";
    items: Array<{ slug: string; qty: number }>;
  }> = [
    { userIndex: 1, daysAgo: 52, status: "delivered", paid: true, method: "standard", items: [{ slug: "pro-laptop-15", qty: 1 }, { slug: "harbor-hub", qty: 1 }] },
    { userIndex: 2, daysAgo: 50, status: "delivered", paid: true, method: "express", items: [{ slug: "ultrabook-13", qty: 1 }] },
    { userIndex: 3, daysAgo: 48, status: "delivered", paid: true, method: "standard", items: [{ slug: "lumen-monitor-27", qty: 1 }, { slug: "type-k-mechanical", qty: 1 }] },
    { userIndex: 4, daysAgo: 46, status: "delivered", paid: true, method: "standard", items: [{ slug: "north-phone", qty: 1 }, { slug: "folio-phone-case", qty: 1 }] },
    { userIndex: 5, daysAgo: 44, status: "shipped", paid: true, method: "express", items: [{ slug: "cloud-cans", qty: 2 }] },
    { userIndex: 6, daysAgo: 42, status: "delivered", paid: true, method: "standard", items: [{ slug: "field-backpack", qty: 1 }, { slug: "slate-desk-mat", qty: 1 }] },
    { userIndex: 7, daysAgo: 40, status: "delivered", paid: true, method: "standard", items: [{ slug: "hearth-purifier", qty: 1 }, { slug: "ceramic-lamp", qty: 1 }] },
    { userIndex: 8, daysAgo: 38, status: "delivered", paid: true, method: "express", items: [{ slug: "rift-headset", qty: 1 }, { slug: "vector-controller", qty: 2 }] },
    { userIndex: 9, daysAgo: 36, status: "delivered", paid: true, method: "standard", items: [{ slug: "nook-mini-pc", qty: 1 }, { slug: "dock-bar", qty: 1 }] },
    { userIndex: 1, daysAgo: 34, status: "delivered", paid: true, method: "standard", items: [{ slug: "studio-mic", qty: 1 }, { slug: "frame-webcam", qty: 1 }] },
    { userIndex: 2, daysAgo: 32, status: "delivered", paid: true, method: "standard", items: [{ slug: "ember-ssd-2tb", qty: 2 }, { slug: "night-shift-mouse", qty: 1 }] },
    { userIndex: 0, daysAgo: 28, status: "delivered", paid: true, method: "standard", items: [{ slug: "pour-over-kettle", qty: 1 }, { slug: "linen-throw", qty: 1 }] },
    { userIndex: 3, daysAgo: 24, status: "shipped", paid: true, method: "express", items: [{ slug: "page-reader", qty: 1 }, { slug: "current-bank", qty: 1 }] },
    { userIndex: 4, daysAgo: 20, status: "confirmed", paid: true, method: "standard", items: [{ slug: "pebble-speaker", qty: 1 }, { slug: "cable-kit", qty: 2 }] },
    { userIndex: 5, daysAgo: 16, status: "confirmed", paid: true, method: "standard", items: [{ slug: "climate-dial", qty: 1 }] },
    { userIndex: 6, daysAgo: 12, status: "processing", paid: false, method: "standard", items: [{ slug: "lift-laptop-stand", qty: 1 }, { slug: "slate-desk-mat", qty: 1 }] },
    { userIndex: 7, daysAgo: 9, status: "confirmed", paid: true, method: "express", items: [{ slug: "vector-controller", qty: 1 }, { slug: "clear-screen-kit", qty: 2 }] },
    { userIndex: 8, daysAgo: 6, status: "confirmed", paid: true, method: "standard", items: [{ slug: "disc-charger", qty: 1 }, { slug: "clip-wallet", qty: 1 }] },
    { userIndex: 0, daysAgo: 3, status: "confirmed", paid: true, method: "standard", items: [{ slug: "cloud-cans", qty: 1 }, { slug: "harbor-hub", qty: 1 }] },
    { userIndex: 9, daysAgo: 1, status: "pending", paid: false, method: "express", items: [{ slug: "type-k-mechanical", qty: 1 }] },
  ];

  for (const [index, blueprint] of orderBlueprints.entries()) {
    const user = userRecords[blueprint.userIndex];
    const address = user.addresses[0];
    const lines = blueprint.items.map((item) => {
      const product = productBySlug[item.slug];
      return {
        productId: product.id,
        name: product.name,
        quantity: item.qty,
        unitPrice: product.price,
      };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const tax = Math.round(subtotal * 0.0875);
    const shipping = blueprint.method === "express" ? 1499 : subtotal >= 7500 ? 0 : 899;
    const total = subtotal + tax + shipping;
    const createdAt = daysAgo(blueprint.daysAgo, 10 + (index % 8));

    const order = await prisma.order.create({
      data: {
        orderNumber: `HB-${String(1001 + index).padStart(5, "0")}`,
        userId: user.id,
        addressId: address.id,
        status: blueprint.status,
        subtotal,
        tax,
        shipping,
        total,
        shippingMethod: blueprint.method,
        estimatedDelivery: daysAgo(blueprint.daysAgo - 6, 12),
        customerEmail: user.email,
        customerName: user.name,
        createdAt,
        updatedAt: createdAt,
        items: { create: lines },
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "mock_card",
        method: "card",
        status: blueprint.paid ? "paid" : blueprint.status === "processing" ? "processing" : "pending",
        amount: total,
        currency: "USD",
        last4: blueprint.paid ? "4242" : null,
        brand: blueprint.paid ? "visa" : null,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  console.log(`Seeded ${productRecords.length} products, ${userRecords.length} customers, and ${orderBlueprints.length} orders.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
