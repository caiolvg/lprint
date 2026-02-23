import { Link } from "wouter";
import { motion } from "framer-motion";
import { type Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  // Stagger animation based on index
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: index * 0.1 }
    }
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price / 100);

  return (
    <motion.div 
      variants={item} 
      initial="hidden" 
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      layout
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.id}`}>
        <div className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30 p-6 flex items-center justify-center">
            {product.featured && (
              <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground font-medium px-3 py-1 shadow-md">
                Destaque
              </Badge>
            )}
            
            {/* Action button overlay */}
            <div className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
              <ArrowUpRight className="w-5 h-5 text-foreground" />
            </div>

            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply dark:mix-blend-normal"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow bg-card">
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
              {product.category}
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
              <span className="font-display font-bold text-lg text-foreground">
                {formattedPrice}
              </span>
              <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-2 group-hover:translate-x-0">
                Ver Detalhes &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
