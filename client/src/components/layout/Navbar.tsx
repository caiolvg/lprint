import { Link } from "wouter";
import { Box, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-provider";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20">
              <Box className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Leopardo
              <span className="text-muted-foreground font-normal"> Print</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button className="hidden sm:flex rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
              Contato
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
