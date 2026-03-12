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
    const idMatch = url.pathname.match(/^\/api\/products\/(\d+)$/);
    const id = idMatch ? parseInt(idMatch[1]) : null;
    const method = req.method?.toUpperCase() ?? "GET";

    // GET /api/products/:id
    if (id && method === "GET") {
      const result = await client.execute({
        sql: "SELECT id, name, description, price, image_urls, category, featured FROM products WHERE id = ?",
        args: [id],
      });
      if (result.rows.length === 0) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(200).json(mapRow(result.rows[0]));
      return;
    }

    // PUT /api/products/:id
    if (id && method === "PUT") {
      const body = req.body ?? {};
      const sets: string[] = [];
      const args: any[] = [];
      if (body.name !== undefined) {
        sets.push("name = ?");
        args.push(body.name);
      }
      if (body.description !== undefined) {
        sets.push("description = ?");
        args.push(body.description);
      }
      if (body.price !== undefined) {
        sets.push("price = ?");
        args.push(Number(body.price));
      }
      if (body.imageUrls !== undefined) {
        sets.push("image_urls = ?");
        args.push(
          JSON.stringify(
            Array.isArray(body.imageUrls)
              ? body.imageUrls
              : body.imageUrls
                  .split("\n")
                  .map((s: string) => s.trim())
                  .filter(Boolean),
          ),
        );
      }
      if (body.category !== undefined) {
        sets.push("category = ?");
        args.push(body.category);
      }
      if (body.featured !== undefined) {
        sets.push("featured = ?");
        args.push(body.featured ? 1 : 0);
      }
      if (sets.length === 0) {
        res.status(400).json({ message: "No fields to update" });
        return;
      }
      args.push(id);
      await client.execute({
        sql: `UPDATE products SET ${sets.join(", ")} WHERE id = ?`,
        args,
      });
      const updated = await client.execute({
        sql: "SELECT id, name, description, price, image_urls, category, featured FROM products WHERE id = ?",
        args: [id],
      });
      if (updated.rows.length === 0) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(200).json(mapRow(updated.rows[0]));
      return;
    }

    // DELETE /api/products/:id
    if (id && method === "DELETE") {
      await client.execute({
        sql: "DELETE FROM products WHERE id = ?",
        args: [id],
      });
      res.status(204).send("");
      return;
    }

    // POST /api/products
    if (!id && method === "POST") {
      const body = req.body ?? {};
      const imageUrls = Array.isArray(body.imageUrls)
        ? body.imageUrls
        : (body.imageUrls ?? "")
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean);
      const result = await client.execute({
        sql: "INSERT INTO products (name, description, price, image_urls, category, featured) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, name, description, price, image_urls, category, featured",
        args: [
          body.name,
          body.description,
          Number(body.price),
          JSON.stringify(imageUrls),
          body.category,
          body.featured ? 1 : 0,
        ],
      });
      res.status(201).json(mapRow(result.rows[0]));
      return;
    }

    // GET /api/products
    if (!id && method === "GET") {
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
      const result = await client.execute({
        sql: `SELECT id, name, description, price, image_urls, category, featured FROM products${where}`,
        args,
      });
      res.status(200).json(result.rows.map(mapRow));
      return;
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error("API error:", err);
    res.status(500).json({ message: err?.message ?? "Internal Server Error" });
  }
}
