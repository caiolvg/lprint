import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Heart, Info, Package, Truck, ShieldCheck } from "lucide-react";
import { useProduct } from "@/hooks/use-products";
import { ModelViewer } from "@/components/product/ModelViewer";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "", 10);
  
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Preparing 3D experience...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md text-center bg-card p-8 rounded-3xl border border-border shadow-lg">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed from the showcase.</p>
            <Link href="/">
              <Button className="rounded-full px-8">Return to Showcase</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price / 100);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="ghost" className="rounded-full pl-2 pr-4 hover:bg-secondary text-muted-foreground hover:text-foreground group transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                Back to catalog
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full bg-background/50 hover:bg-secondary">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full bg-background/50 hover:bg-secondary">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: 3D Viewer */}
            <motion.div 
              className="lg:col-span-7 xl:col-span-8 h-[50vh] lg:h-[70vh] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 border border-border/50 bg-secondary/20 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Floating Interaction Hint */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-border flex items-center gap-2 pointer-events-none">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-medium text-foreground">Drag to rotate • Scroll to zoom</span>
              </div>
              
              <ModelViewer 
                src={product.modelUrl} 
                alt={product.name} 
                fallbackImage={product.thumbnailUrl}
              />
            </motion.div>

            {/* Right Column: Details */}
            <motion.div 
              className="lg:col-span-5 xl:col-span-4 flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="text-3xl font-display font-semibold text-primary mb-6">
                {formattedPrice}
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {product.description}
              </p>
              
              <div className="bg-secondary/30 rounded-3xl p-6 border border-border/50 mb-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-background rounded-full p-2 shadow-sm border border-border">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Premium Quality</h4>
                    <p className="text-xs text-muted-foreground mt-1">High-fidelity PBR materials and textures.</p>
                  </div>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex items-start gap-4">
                  <div className="bg-background rounded-full p-2 shadow-sm border border-border">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Formats Available</h4>
                    <p className="text-xs text-muted-foreground mt-1">GLB, GLTF, USDZ formats provided upon request.</p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-auto pt-6 flex flex-col gap-4">
                <Button size="lg" className="w-full rounded-full h-14 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
                  Request Information
                </Button>
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Info className="w-3 h-3" />
                  This is a read-only showcase catalog.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
