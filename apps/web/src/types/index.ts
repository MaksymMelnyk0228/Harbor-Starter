export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface Inventory {
  id: string;
  quantity: number;
  lowStockAt: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  status: string;
  featured: boolean;
  recommended: boolean;
  ratingAvg: number;
  reviewCount: number;
  category: Category;
  images: ProductImage[];
  inventory: Inventory | null;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string };
}

export interface Address {
  id?: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault?: boolean;
}

export interface Payment {
  id: string;
  provider: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  last4?: string | null;
  brand?: string | null;
  failureReason?: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingMethod: "standard" | "express";
  estimatedDelivery: string | null;
  customerEmail: string;
  customerName: string;
  createdAt: string;
  items: OrderItem[];
  payments: Payment[];
  address: Address | null;
  user?: { id: string; name: string; email: string };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  categorySlug: string;
  stock: number;
  ratingAvg: number;
  imageUrl?: string;
}
