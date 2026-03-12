import express, { type Request, Response } from "express";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq, and } from "drizzle-orm";
import { products } from "../shared/schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
  return drizzle(client, { schema: { products } });
}

function mapProduct(p: any) {
  return {
    ...p,
    imageUrls: typeof p.imageUrls === "string" ? JSON.parse(p.imageUrls) : p.imageUrls,
  };
}

app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { category, featured } = req.query as { category?: string; featured?: string };
    const conditions = [];
    if (category) conditions.push(eq(products.category, category));
    if (featured === "true") conditions.push(eq(products.featured, true));

    const rows =
      conditions.length === 0
        ? await db.select().from(products)
        : conditions.length === 1
        ? await db.select().from(products).where(conditions[0])
        : await db.select().from(products).where(and(...conditions));

    res.json(rows.map(mapProduct));
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message ?? "Internal Server Error" });
  }
});

app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(mapProduct(product));
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message ?? "Internal Server Error" });
  }
});

export default app;
