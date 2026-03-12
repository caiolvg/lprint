import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Product } from "@shared/schema";

type ProductInput = {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  featured: boolean;
};

async function apiFetch(url: string, options: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(err.message ?? "Erro na requisição");
  }
  if (res.status === 204) return null;
  return res.json() as Promise<Product>;
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductInput) =>
      apiFetch(api.products.create.path, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductInput> }) =>
      apiFetch(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}
