import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductSlide {
  id: string;
  name: string;
  image: string;
  badge: string;
  price: string;
  tagline: string;
}

interface ProductSliderProps {
  products: ProductSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ProductSlider({ 
  products, 
  autoPlay = true, 
  autoPlayInterval = 4000 
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  }, [products.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  }, [products.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl bg-[#08090C] border border-[#232934]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="min-w-full h-[400px] sm:h-[500px] relative flex-shrink-0"
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#101318] via-black/50 to-transparent" />
            
            {/* Product Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
              <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-[#E11D2A] text-white shadow-md">
                {product.badge}
              </span>
              
              <h3 className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                {product.name}
              </h3>
              
              <p className="text-sm sm:text-base text-[#CBD5E1] max-w-2xl">
                {product.tagline}
              </p>
              
              <p className="text-lg sm:text-xl font-bold text-[#FF4D5A]">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-[#E11D2A] hover:border-[#E11D2A] transition-all focus:outline-none focus:ring-2 focus:ring-[#E11D2A]"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-[#E11D2A] hover:border-[#E11D2A] transition-all focus:outline-none focus:ring-2 focus:ring-[#E11D2A]"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-[#E11D2A]'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar (when autoplay is enabled) */}
      {autoPlay && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
          <div 
            className="h-full bg-[#E11D2A] transition-all duration-linear"
            style={{ 
              width: `${((currentIndex + 1) / products.length) * 100}%`,
              transitionDuration: `${autoPlayInterval}ms`
            }}
          />
        </div>
      )}
    </div>
  );
}
