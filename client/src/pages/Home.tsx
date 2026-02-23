import { useState } from "react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2, Box } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CATEGORIES = ["All", "Furniture", "Electronics", "Fashion", "Automotive"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { data: products, isLoading, error } = useProducts(
    selectedCategory === "All" ? undefined : selectedCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Abstract background shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent rounded-full blur-3xl -z-10 pointer-events-none opacity-50" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              <Badge className="mb-6 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground border-border hover:bg-secondary">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Interactive 3D Experience
                </span>
              </Badge>
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1] text-balance">
                Experience products in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">stunning 3D.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed text-balance">
                A premium showcase of meticulously crafted 3D models. Rotate, zoom, and explore every detail before making a decision.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1">
                  Explore Catalog
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base bg-background/50 backdrop-blur-sm hover:bg-secondary transition-all duration-300">
                  How it works
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Featured Collection</h2>
              <p className="text-muted-foreground mt-2">Discover our highest quality 3D assets.</p>
            </div>
            
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar mask-edges">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category 
                      ? "shadow-md" 
                      : "bg-background/50 hover:bg-secondary"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid or Loading/Error States */}
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Loading catalog...</p>
            </div>
          ) : error ? (
            <div className="py-32 flex flex-col items-center justify-center text-center bg-destructive/5 rounded-3xl border border-destructive/20">
              <p className="text-destructive font-semibold text-lg mb-2">Failed to load products</p>
              <p className="text-muted-foreground">Please try refreshing the page.</p>
            </div>
          ) : !products?.length ? (
            <div className="py-32 flex flex-col items-center justify-center text-center bg-secondary/30 rounded-3xl border border-border/50">
              <Box className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">There are no products in the "{selectedCategory}" category yet.</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-full"
                onClick={() => setSelectedCategory("All")}
              >
                Clear Filters
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

// Inline component for the Badge used in Hero
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
