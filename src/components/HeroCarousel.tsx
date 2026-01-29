import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  "carousel/0c0a293e-e445-47aa-be4e-331d88ee4f79.JPG",
  "carousel/0ce68e02-0457-42f7-b14b-27bdfc44016f.JPG",
  "carousel/0d7b7232-1578-4989-883b-9a2bb3587c73.JPG",
  "carousel/12cff05d-31bf-4d05-a47e-f3a5ead332c3.JPG",
  "carousel/1f7d5067-0196-43d5-aca3-1e06e5cd86a1.JPG",
  "carousel/240c99cc-4dac-4d59-a076-a37512e53322.JPG",
  "carousel/29ed3173-c630-4a8a-9ef5-18664d74e00f.JPG",
  "carousel/31b56225-911a-49ab-98ff-6955395d4c09.JPG",
  "carousel/38552523-69d0-45b1-a1fd-4e1b5926521c.JPG",
  "carousel/39e96f73-c8da-4247-b0c4-cfdbc153bc2d.JPG",
  "carousel/3e6c7189-4a60-4f3c-96ac-4fa6b621a9ec.JPG",
  "carousel/401e735c-849e-4b29-affd-f6c454b2e474.JPG",
  "carousel/455996f0-7703-4e77-949a-989fb0a56765.JPG",
  "carousel/4dee5fb7-b588-4b52-b2ce-14ca5d63d327.JPG",
  "carousel/5078076f-e30c-459e-9ba8-0d9b21b78f83.JPG",
  "carousel/610d9b39-002b-4f7e-8e3f-0c94ddb62f45.JPG",
  "carousel/6ceb5527-f178-42c4-b2e5-3876f8424175.JPG",
  "carousel/717ac8b2-7a7a-4b2b-a0f0-55880ee7b45f.JPG",
  "carousel/76ec74ea-8b53-4979-901b-d6cc6b95e254.JPG",
  "carousel/7ac67a35-229c-45c6-b3b1-1cbe4be4bd3e.JPG",
  "carousel/7e9d9efe-6584-4c2c-a962-916ba920847a.JPG",
  "carousel/84440dd2-620c-4f67-9c77-069a215f264c.JPG",
  "carousel/8500bc6d-9960-47bd-93e4-a7afe54e5567.JPG",
  "carousel/86bc46c6-43b6-4b56-a900-b7b6ea014d62.JPG",
  "carousel/94045466-537c-4057-a909-537fa285bc8a.JPG",
  "carousel/97db51a9-ebca-4347-8ccc-76821dbe0f3d.JPG",
  "carousel/a00628ff-74ea-413e-a1d4-5c6d390f36aa.JPG",
  "carousel/a89636f9-68ef-4a80-af57-219f6133985d.JPG",
  "carousel/acd8135a-4fe8-4dc1-aaa7-180d6a870dc9.JPG",
  "carousel/ae9185eb-4f72-4c13-ae4f-25e430abadaf.JPG",
  "carousel/b7f58a99-65b1-4d88-830c-db1aa659aeca.JPG",
  "carousel/bf254490-b472-40f5-825c-12ff54d5a04e.JPG",
  "carousel/cb7e34c4-fe98-4a85-b510-0559a6dfe290.JPG",
  "carousel/cbbeb7ea-4102-4931-a4a2-ae4ef85d0ed9.JPG",
  "carousel/ce66b38b-b42b-4b80-be9e-124c4532d115.JPG",
  "carousel/d8800d13-3c89-4ad9-bbef-240992ad3cac.JPG",
  "carousel/dac3ada2-5e7c-4f82-82df-4899a7361c47.JPG",
  "carousel/dd704d8c-6e62-4ba8-bc4f-016d85a57beb.JPG",
  "carousel/e75b939e-dd8e-4411-9d63-fb225cb423c4.JPG",
  "carousel/e9725a52-9038-4364-b2ef-6dd3015fc860.JPG",
  "carousel/ef16d39a-baae-4e53-b739-e6c56332549b.JPG",
  "carousel/f49ef5ea-4b60-471c-88e7-ff3fdc83435a.JPG",
  "carousel/f7e02a12-b227-4c40-8226-e4a8986c10c8.JPG",
  "carousel/fd489572-cfd7-443c-b530-348fad12690a.JPG",
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
