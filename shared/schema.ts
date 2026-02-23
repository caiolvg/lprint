import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  imageUrls: text("image_urls").array().notNull(), // Array of product images
  category: text("category").notNull(),
  featured: boolean("featured").default(false).notNull(),
});

// === BASE SCHEMAS ===
export const insertProductSchema = createInsertSchema(products).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

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
