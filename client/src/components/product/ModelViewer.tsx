import { useEffect, useRef, useState } from "react";
import '@google/model-viewer';
import { Loader2 } from "lucide-react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'shadow-intensity'?: string;
        'exposure'?: string;
        'environment-image'?: string;
        'interaction-prompt'?: string;
      };
    }
  }
}

interface ModelViewerProps {
  src: string;
  alt: string;
  fallbackImage?: string;
}

export function ModelViewer({ src, alt, fallbackImage }: ModelViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => setIsLoaded(true);
    viewer.addEventListener('load', handleLoad);

    return () => {
      viewer.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-secondary/30 rounded-3xl overflow-hidden flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading 3D Model...</p>
        </div>
      )}
      
      {/* We use a neutral HDRI environment for premium lighting reflections */}
      <model-viewer
        ref={viewerRef}
        src={src}
        alt={alt}
        auto-rotate
        camera-controls
        shadow-intensity="1"
        exposure="1"
        interaction-prompt="auto"
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      >
        {fallbackImage && !isLoaded && (
          <img 
            slot="poster" 
            src={fallbackImage} 
            alt={alt} 
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-50"
          />
        )}
      </model-viewer>
    </div>
  );
}
