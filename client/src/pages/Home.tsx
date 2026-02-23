import { useState } from "react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2, Box } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Todos", "Equipamento", "Móveis", "Vestuário", "Brinquedos"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const { data: products, isLoading, error } = useProducts(
    selectedCategory === "Todos" ? undefined : selectedCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent rounded-full blur-3xl -z-10 pointer-events-none opacity-50" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1] text-balance">
                Explore nossa coleção em <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">detalhes.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed text-balance">
                Um catálogo premium com imagens de alta qualidade.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl font-bold text-foreground">Coleção em Destaque</h2>
              <p className="text-muted-foreground mt-2">Descubra nossos produtos de alta qualidade.</p>
            </motion.div>
            
            {/* Category Filters */}
            <motion.div 
              className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar mask-edges"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95 ${
                    selectedCategory === category 
                      ? "shadow-md shadow-primary/20" 
                      : "bg-background/50 hover:bg-secondary"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </motion.div>
          </div>

          {/* Grid or Loading/Error States */}
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Carregando catálogo...</p>
            </div>
          ) : error ? (
            <div className="py-32 flex flex-col items-center justify-center text-center bg-destructive/5 rounded-3xl border border-destructive/20">
              <p className="text-destructive font-semibold text-lg mb-2">Falha ao carregar produtos</p>
              <p className="text-muted-foreground">Por favor, tente atualizar a página.</p>
            </div>
          ) : !products?.length ? (
            <div className="py-32 flex flex-col items-center justify-center text-center bg-secondary/30 rounded-3xl border border-border/50">
              <Box className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground">Não há produtos na categoria "{selectedCategory}" ainda.</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-full"
                onClick={() => setSelectedCategory("Todos")}
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial="hidden"
              animate="show"
            >
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
