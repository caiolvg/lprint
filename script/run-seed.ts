import "dotenv/config";
import { storage } from "../server/storage";

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
        await storage.createProduct(product as any);
      }
      console.log("Banco de dados semeado com produtos de exemplo");
    } else {
      console.log("Banco já possui produtos");
    }
  } catch (error) {
    console.error("Erro ao semear banco de dados:", error);
  }
}

seedDatabase().then(() => {
  console.log("Done");
  process.exit(0);
});
