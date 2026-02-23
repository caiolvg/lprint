import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useProducts(category?: string, featured?: boolean) {
  return useQuery({
    queryKey: [api.products.list.path, { category, featured }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (category && category !== "All") searchParams.set("category", category);
      if (featured) searchParams.set("featured", "true");
      
      const queryString = searchParams.toString();
      const url = `${api.products.list.path}${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      
      const data = await res.json();
      return api.products.list.responses[200].parse(data);
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      
      const data = await res.json();
      return api.products.get.responses[200].parse(data);
    },
    enabled: !!id && !isNaN(id),
  });
}
