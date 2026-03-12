import { createClient } from "@libsql/client";

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
}

function mapRow(row: any) {
  return {
    id: row[0],
    name: row[1],
    description: row[2],
    price: row[3],
    imageUrls: typeof row[4] === "string" ? JSON.parse(row[4]) : row[4],
    category: row[5],
    featured: Boolean(row[6]),
  };
}

export default async function handler(req: any, res: any) {
  try {
    const client = getClient();
    const url = new URL(req.url, "http://localhost");
    const id = url.pathname.match(/^\/api\/products\/(\d+)$/)?.[1];

    if (id) {
      const result = await client.execute({
        sql: "SELECT id, name, description, price, image_urls, category, featured FROM products WHERE id = ?",
        args: [parseInt(id)],
      });
      if (result.rows.length === 0) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(200).json(mapRow(result.rows[0]));
      return;
    }

    const category = url.searchParams.get("category");
    const featured = url.searchParams.get("featured");

    const conditions: string[] = [];
    const args: any[] = [];
    if (category) {
      conditions.push("category = ?");
      args.push(category);
    }
    if (featured === "true") {
      conditions.push("featured = 1");
    }

    const where =
      conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";
    const sql = `SELECT id, name, description, price, image_urls, category, featured FROM products${where}`;

    const result = await client.execute({ sql, args });
    res.status(200).json(result.rows.map(mapRow));
  } catch (err: any) {
    console.error("API error:", err);
    res.status(500).json({ message: err?.message ?? "Internal Server Error" });
  }
}
