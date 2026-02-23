import { products } from "@shared/schema";
import type { Product, InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getProducts(params?: { category?: string; featured?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(params?: { category?: string; featured?: string }): Promise<Product[]> {
    let query = db.select().from(products);
    
    const conditions = [];
    if (params?.category) {
      conditions.push(eq(products.category, params.category));
    }
    if (params?.featured === "true") {
      conditions.push(eq(products.featured, true));
    }
    
    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
}

export const storage = new DatabaseStorage();