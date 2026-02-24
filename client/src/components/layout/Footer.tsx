import { Box } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground/10 text-foreground rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-lg">Leopardo Print</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
