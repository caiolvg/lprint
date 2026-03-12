import { products } from "@shared/schema";
import type { Product, InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getProducts(params?: {
    category?: string;
    featured?: string;
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(
    id: number,
    product: Partial<InsertProduct>,
  ): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private mapProduct(product: any): Product {
    return {
      ...product,
      imageUrls:
        typeof product.imageUrls === "string"
          ? JSON.parse(product.imageUrls)
          : product.imageUrls,
    };
  }

  async getProducts(params?: {
    category?: string;
    featured?: string;
  }): Promise<Product[]> {
    let query = db.select().from(products);

    const conditions = [];
    if (params?.category) {
      conditions.push(eq(products.category, params.category));
    }
    if (params?.featured === "true") {
      conditions.push(eq(products.featured, true));
    }

    const results =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return results.map(this.mapProduct);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product ? this.mapProduct(product) : undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const values = {
      ...product,
      imageUrls: JSON.stringify(product.imageUrls),
    };
    const [newProduct] = await db
      .insert(products)
      .values(values as any)
      .returning();
    return this.mapProduct(newProduct);
  }

  async updateProduct(
    id: number,
    product: Partial<InsertProduct>,
  ): Promise<Product | undefined> {
    const values: any = { ...product };
    if (product.imageUrls) values.imageUrls = JSON.stringify(product.imageUrls);
    const [updated] = await db
      .update(products)
      .set(values)
      .where(eq(products.id, id))
      .returning();
    return updated ? this.mapProduct(updated) : undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
