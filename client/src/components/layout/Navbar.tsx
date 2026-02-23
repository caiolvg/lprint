import { Link } from "wouter";
import { Box, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Box className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Aura<span className="text-muted-foreground font-normal">3D</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Showcase
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
              <Search className="w-5 h-5" />
            </Button>
            <Button className="hidden sm:flex rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300">
              Get in touch
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
