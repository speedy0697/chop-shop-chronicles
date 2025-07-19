import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export const ImageCarouselModal = ({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0 
}: ImageCarouselModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-full h-[90vh] p-0 bg-black/95"
        onKeyDown={handleKeyDown}
      >
        <VisuallyHidden>
          <DialogTitle>Haircut Image Gallery</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            onClick={onClose}
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <Button
                onClick={prevImage}
                variant="secondary"
                size="icon"
                className="absolute left-4 z-10 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={nextImage}
                variant="secondary"
                size="icon"
                className="absolute right-4 z-10 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image */}
          <img
            src={images[currentIndex]}
            alt={`Haircut ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 mt-8">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};