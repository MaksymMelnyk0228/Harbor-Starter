import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../services/api";
import type { Address, Product } from "../types";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { ProductCard } from "../components/ProductCard";
import { Spinner } from "../components/States";

interface SavedRow {
  id: string;
  product: Product;
}

export function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState({
    label: "Home",
    fullName: user?.name ?? "",
    line1: "",
    city: "",
    region: "",
    postalCode: "",
    country: "United States",
  });

  const addresses = useQuery({
    queryKey: ["addresses"],
    queryFn: () => api<Address[]>("/api/account/addresses"),
  });
  const saved = useQuery({
    queryKey: ["saved"],
    queryFn: () => api<SavedRow[]>("/api/account/saved"),
  });

  const saveProfile = useMutation({
    mutationFn: () =>
      api("/api/account/profile", { method: "PATCH", body: JSON.stringify({ name }) }),
    onSuccess: () => toast.success("Profile updated"),
  });

  const addAddress = useMutation({
    mutationFn: () =>
      api("/api/account/addresses", {
        method: "POST",
        body: JSON.stringify({ ...address, isDefault: true }),
      }),
    onSuccess: () => {
      toast.success("Address saved");
      void queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  function onAddress(event: FormEvent) {
    event.preventDefault();
    addAddress.mutate();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl">Account</h1>
          <p className="mt-1 text-ink-500">{user?.email}</p>
        </div>
        <Link to="/orders" className="text-sm text-pine-800">
          View orders
        </Link>
      </div>

      <section className="surface p-6">
        <h2 className="font-serif text-2xl">Profile</h2>
        <form
          className="mt-4 flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            saveProfile.mutate();
          }}
        >
          <div className="min-w-64 flex-1">
            <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </section>

      <section className="surface p-6">
        <h2 className="font-serif text-2xl">Addresses</h2>
        {addresses.isLoading ? <Spinner /> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {addresses.data?.map((item) => (
            <article key={item.id} className="rounded-xl border border-paper-200 p-4">
              <p className="font-medium">{item.label}</p>
              <p className="mt-1 text-sm text-ink-700">
                {item.fullName}
                <br />
                {item.line1}
                <br />
                {item.city}, {item.region} {item.postalCode}
              </p>
            </article>
          ))}
        </div>
        <form onSubmit={onAddress} className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Label" value={address.label} onChange={(e) => setAddress({ ...address, label: e.target.value })} />
          <Field label="Recipient" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
          <div className="md:col-span-2">
            <Field label="Line 1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
          </div>
          <Field label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
          <Field label="Region" value={address.region} onChange={(e) => setAddress({ ...address, region: e.target.value })} />
          <Field label="Postal code" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
          <Button type="submit" className="self-end">
            Add address
          </Button>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Saved products</h2>
        {saved.isLoading ? <Spinner /> : null}
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {saved.data?.map((row) => (
            <ProductCard key={row.id} product={row.product} />
          ))}
        </div>
      </section>
    </div>
  );
}
