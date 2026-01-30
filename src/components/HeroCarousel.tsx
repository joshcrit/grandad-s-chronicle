import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase, getPhotoUrl } from "@/lib/supabase";

// Fallback when no hero carousel photos in Supabase yet (single image so hero still shows)
const FALLBACK_CAROUSEL = ["carousel/4dee5fb7-b588-4b52-b2ce-14ca5d63d327.JPG"];

export function HeroCarousel() {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : base + "/";

  const { data: carouselPhotos } = useQuery({
    queryKey: ["hero-carousel-photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_carousel_photos")
        .select("id, storage_path, row_number, display_order")
        .order("row_number", { ascending: true })
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const images = useMemo(() => {
    if (carouselPhotos && carouselPhotos.length > 0) {
      return carouselPhotos.map((p) => getPhotoUrl(p.storage_path));
    }
    return FALLBACK_CAROUSEL.map((p) => `${prefix}${p.replace(/^\//, "")}`);
  }, [carouselPhotos, prefix]);

  if (images.length === 0) return null;
  return <CrossfadeBackdrop images={images} />;
}

function CrossfadeBackdrop({ images }: { images: string[] }) {
  const displayMs = 8000;
  const fadeMs = 1200;
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, displayMs);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [images.length, displayMs]);

  const restartInterval = () => {
    if (images.length <= 1) return;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, displayMs);
  };

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
    restartInterval();
  };

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % images.length);
    restartInterval();
  };

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  return (
    <div className="hero-carousel" aria-hidden="true">
      <div className="hero-backdrop">
        {images.map((src, index) => (
          <div
            key={src}
            className="hero-backdrop__layer"
            style={{ zIndex: index === activeIndex ? 2 : 1 }}
          >
            <img
              src={src}
              alt=""
              className="hero-backdrop__img"
              style={{
                opacity: index === activeIndex ? 1 : 0,
                transition: `opacity ${fadeMs}ms ease-in-out`,
                pointerEvents: "none",
              }}
              loading="eager"
              onError={() => console.error("Hero image failed:", src)}
            />
          </div>
        ))}
        <div className="hero-backdrop__scrim" />
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="hero-arrow hero-arrow--left"
            onClick={goPrev}
            aria-label="Previous hero image"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="hero-arrow hero-arrow--right"
            onClick={goNext}
            aria-label="Next hero image"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
