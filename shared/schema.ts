import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  imageUrls: text("image_urls").notNull(), // Stored as JSON string
  category: text("category").notNull(),
  featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
});

// === BASE SCHEMAS ===
export const insertProductSchema = createInsertSchema(products).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Product = Omit<typeof products.$inferSelect, "imageUrls"> & { imageUrls: string[] };
export type InsertProduct = Omit<z.infer<typeof insertProductSchema>, "imageUrls"> & { imageUrls: string[] };

// Request types
export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;

// Response types
export type ProductResponse = Product;
export type ProductsListResponse = Product[];

// Query types
export interface ProductsQueryParams {
  category?: string;
  featured?: string;
}
