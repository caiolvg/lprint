import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get(api.products.list.path, async (req, res) => {
    try {
      const input = api.products.list.input?.parse(req.query) || {};
      const items = await storage.getProducts(input);
      res.json(items);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const product = await storage.getProduct(id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // POST /api/products — create
  app.post("/api/products", async (req, res) => {
    try {
      const body = insertProductSchema.omit({ id: true } as any).parse({
        ...req.body,
        imageUrls: Array.isArray(req.body.imageUrls)
          ? req.body.imageUrls
          : req.body.imageUrls
              ?.split("\n")
              .map((s: string) => s.trim())
              .filter(Boolean),
      });
      const product = await storage.createProduct(body as any);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError)
        return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // PUT /api/products/:id — update
  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const body = {
        ...req.body,
        ...(req.body.imageUrls !== undefined && {
          imageUrls: Array.isArray(req.body.imageUrls)
            ? req.body.imageUrls
            : req.body.imageUrls
                .split("\n")
                .map((s: string) => s.trim())
                .filter(Boolean),
        }),
        ...(req.body.price !== undefined && { price: Number(req.body.price) }),
        ...(req.body.featured !== undefined && {
          featured: Boolean(req.body.featured),
        }),
      };
      const product = await storage.updateProduct(id, body);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // DELETE /api/products/:id — delete
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const deleted = await storage.deleteProduct(id);
      if (!deleted)
        return res.status(404).json({ message: "Product not found" });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Seed the database after routes are registered
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existing = await storage.getProducts();
    if (existing.length === 0) {
      const sampleProducts = [
        {
          name: "Traje de Astronauta",
          description:
            "Um traje de astronauta altamente detalhado para exploração espacial, disponível em incrível visualização 3D.",
          price: 14999, // R$ 149,99
          imageUrls: [
            "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
          ],
          category: "Equipamento",
          featured: true,
        },
        {
          name: "Cadeira Moderna",
          description:
            "Um design de cadeira elegante e moderno com características ergonômicas. Interaja com o modelo 3D abaixo.",
          price: 12900, // R$ 129,00
          imageUrls: [
            "https://modelviewer.dev/assets/ShopifyModels/Chair.glb",
          ],
          category: "Móveis",
          featured: true,
        },
        {
          name: "Batedeira Mix Master",
          description:
            "Batedeira super potente. Verifique todos os ângulos no nosso visualizador 3D interativo.",
          price: 8999, // R$ 89,99
          imageUrls: [
            "https://modelviewer.dev/assets/ShopifyModels/Mixer.glb",
          ],
          category: "Equipamento",
          featured: false,
        },
        {
          name: "Trem de Brinquedo 3D",
          description:
            "Um trem de brinquedo clássico e detalhado. Perfeito para a coleção.",
          price: 1950, // R$ 19,50
          imageUrls: [
            "https://modelviewer.dev/assets/ShopifyModels/ToyTrain.glb",
          ],
          category: "Brinquedos",
          featured: false,
        },
      ];

      for (const product of sampleProducts) {
        await storage.createProduct(product);
      }
      console.log("Banco de dados semeado com produtos de exemplo");
    }
  } catch (error) {
    console.error("Erro ao semear banco de dados:", error);
  }
}
