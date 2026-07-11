import { prisma } from "../lib/prisma.js";

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      addresses: { orderBy: [{ isDefault: "desc" }, { label: "asc" }] },
    },
  });
}

export function createUser(data: {
  email: string;
  passwordHash: string;
  name: string;
  role?: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      name: data.name,
      role: data.role ?? "customer",
    },
  });
}
