import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  "carousel/0c0a293e-e445-47aa-be4e-331d88ee4f79.JPG",
  "carousel/0d7b7232-1578-4989-883b-9a2bb3587c73.JPG",
  "carousel/455996f0-7703-4e77-949a-989fb0a56765.JPG",
  "carousel/4dee5fb7-b588-4b52-b2ce-14ca5d63d327.JPG",
];

export function HeroCarousel() {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : base + "/";

  const images = useMemo(
    () => HERO_IMAGES.filter(Boolean).map((p) => `${prefix}${p.replace(/^\//, "")}`),
    [prefix]
  );

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
