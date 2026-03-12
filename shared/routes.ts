import { z } from "zod";
import { insertProductSchema, products, type Product } from "./schema";

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  products: {
    list: {
      method: "GET" as const,
      path: "/api/products" as const,
      input: z
        .object({
          category: z.string().optional(),
          featured: z.string().optional(),
        })
        .optional(),
      responses: {
        200: z.array(z.custom<Product>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/products/:id" as const,
      responses: {
        200: z.custom<Product>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/products" as const,
    },
    update: {
      method: "PUT" as const,
      path: "/api/products/:id" as const,
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/products/:id" as const,
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type ProductResponse = z.infer<(typeof api.products.get.responses)[200]>;
export type ProductsListResponse = z.infer<
  (typeof api.products.list.responses)[200]
>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
