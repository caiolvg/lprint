import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
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
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
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
          name: "Astronaut Suit",
          description: "A highly detailed 3D model of an astronaut suit.",
          price: 14999, // $149.99
          modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb", 
          thumbnailUrl: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80",
          category: "Equipment",
          featured: true
        },
        {
          name: "Modern Chair",
          description: "A sleek, modern chair design with ergonomic features.",
          price: 12900, // $129.00
          modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb", 
          thumbnailUrl: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=800&q=80",
          category: "Furniture",
          featured: true
        },
        {
          name: "Running Shoe",
          description: "High-performance running shoe optimized for speed.",
          price: 8999, // $89.99
          modelUrl: "https://modelviewer.dev/shared-assets/models/Shoe.glb", 
          thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
          category: "Apparel",
          featured: false
        },
        {
          name: "Toy Train",
          description: "A colorful wooden toy train for kids of all ages.",
          price: 1950, // $19.50
          modelUrl: "https://modelviewer.dev/shared-assets/models/ToyTrain.glb", 
          thumbnailUrl: "https://images.unsplash.com/photo-1550580975-f7db8c02f1a8?auto=format&fit=crop&w=800&q=80",
          category: "Toys",
          featured: false
        }
      ];

      for (const product of sampleProducts) {
        await storage.createProduct(product);
      }
      console.log("Database seeded with sample products");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}