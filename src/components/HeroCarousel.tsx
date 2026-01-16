import { useEffect, useRef } from "react";

// Local carousel photos - using actual filenames from public/carousel/
const CAROUSEL_PHOTOS = [
  // Row 1 (11 photos)
  "/carousel/0c0a293e-e445-47aa-be4e-331d88ee4f79.JPG",
  "/carousel/455996f0-7703-4e77-949a-989fb0a56765.JPG",
  "/carousel/f7e02a12-b227-4c40-8226-e4a8986c10c8.JPG",
  "/carousel/fd489572-cfd7-443c-b530-348fad12690a.JPG",
  "/carousel/0ce68e02-0457-42f7-b14b-27bdfc44016f.JPG",
  "/carousel/0d7b7232-1578-4989-883b-9a2bb3587c73.JPG",
  "/carousel/12cff05d-31bf-4d05-a47e-f3a5ead332c3.JPG",
  "/carousel/1f7d5067-0196-43d5-aca3-1e06e5cd86a1.JPG",
  "/carousel/240c99cc-4dac-4d59-a076-a37512e53322.JPG",
  "/carousel/29ed3173-c630-4a8a-9ef5-18664d74e00f.JPG",
  "/carousel/31b56225-911a-49ab-98ff-6955395d4c09.JPG",
  // Row 2 (11 photos)
  "/carousel/38552523-69d0-45b1-a1fd-4e1b5926521c.JPG",
  "/carousel/401e735c-849e-4b29-affd-f6c454b2e474.JPG",
  "/carousel/4dee5fb7-b588-4b52-b2ce-14ca5d63d327.JPG",
  "/carousel/5078076f-e30c-459e-9ba8-0d9b21b78f83.JPG",
  "/carousel/610d9b39-002b-4f7e-8e3f-0c94ddb62f45.JPG",
  "/carousel/6ceb5527-f178-42c4-b2e5-3876f8424175.JPG",
  "/carousel/717ac8b2-7a7a-4b2b-a0f0-55880ee7b45f.JPG",
  "/carousel/76ec74ea-8b53-4979-901b-d6cc6b95e254.JPG",
  "/carousel/7ac67a35-229c-45c6-b3b1-1cbe4be4bd3e.JPG",
  "/carousel/7e9d9efe-6584-4c2c-a962-916ba920847a.JPG",
  "/carousel/84440dd2-620c-4f67-9c77-069a215f264c.JPG",
  // Row 3 (11 photos)
  "/carousel/39e96f73-c8da-4247-b0c4-cfdbc153bc2d.JPG",
  "/carousel/8500bc6d-9960-47bd-93e4-a7afe54e5567.JPG",
  "/carousel/86bc46c6-43b6-4b56-a900-b7b6ea014d62.JPG",
  "/carousel/94045466-537c-4057-a909-537fa285bc8a.JPG",
  "/carousel/97db51a9-ebca-4347-8ccc-76821dbe0f3d.JPG",
  "/carousel/a00628ff-74ea-413e-a1d4-5c6d390f36aa.JPG",
  "/carousel/a89636f9-68ef-4a80-af57-219f6133985d.JPG",
  "/carousel/acd8135a-4fe8-4dc1-aaa7-180d6a870dc9.JPG",
  "/carousel/ae9185eb-4f72-4c13-ae4f-25e430abadaf.JPG",
  "/carousel/b7f58a99-65b1-4d88-830c-db1aa659aeca.JPG",
  "/carousel/bf254490-b472-40f5-825c-12ff54d5a04e.JPG",
  // Row 4 (11 photos)
  "/carousel/3e6c7189-4a60-4f3c-96ac-4fa6b621a9ec.JPG",
  "/carousel/cb7e34c4-fe98-4a85-b510-0559a6dfe290.JPG",
  "/carousel/cbbeb7ea-4102-4931-a4a2-ae4ef85d0ed9.JPG",
  "/carousel/ce66b38b-b42b-4b80-be9e-124c4532d115.JPG",
  "/carousel/d8800d13-3c89-4ad9-bbef-240992ad3cac.JPG",
  "/carousel/dac3ada2-5e7c-4f82-82df-4899a7361c47.JPG",
  "/carousel/dd704d8c-6e62-4ba8-bc4f-016d85a57beb.JPG",
  "/carousel/e75b939e-dd8e-4411-9d63-fb225cb423c4.JPG",
  "/carousel/e9725a52-9038-4364-b2ef-6dd3015fc860.JPG",
  "/carousel/ef16d39a-baae-4e53-b739-e6c56332549b.JPG",
  "/carousel/f49ef5ea-4b60-471c-88e7-ff3fdc83435a.JPG",
];

export function HeroCarousel() {
  const rows = [
    CAROUSEL_PHOTOS.slice(0, 11),
    CAROUSEL_PHOTOS.slice(11, 22),
    CAROUSEL_PHOTOS.slice(22, 33),
    CAROUSEL_PHOTOS.slice(33, 44),
  ];

  if (CAROUSEL_PHOTOS.length === 0) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 photo-carousel"
      style={{ filter: "saturate(0.98) contrast(0.99) brightness(0.99)" }}
    >
      <div className="absolute inset-0 flex flex-col">
        {rows.map((rowPhotos, rowIndex) => {
          if (rowPhotos.length === 0) return null;
          const duplicatedPhotos = [...rowPhotos, ...rowPhotos];

          return (
            <SlidingRow
              key={rowIndex}
              photos={duplicatedPhotos}
              direction="left"
              speed={120}
            />
          );
        })}
      </div>
    </div>
  );
}

interface SlidingRowProps {
  photos: string[];
  direction: "left" | "right";
  speed: number;
}

function SlidingRow({ photos, direction, speed }: SlidingRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationName = `slide-${direction}-${speed}`;

  useEffect(() => {
    if (!containerRef.current) return;

    const style = document.createElement("style");
    const totalWidth = containerRef.current.scrollWidth / 2;

    if (direction === "left") {
      style.textContent = `
        @keyframes ${animationName} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${totalWidth}px); }
        }
      `;
    } else {
      style.textContent = `
        @keyframes ${animationName} {
          0% { transform: translateX(-${totalWidth}px); }
          100% { transform: translateX(0); }
        }
      `;
    }

    document.head.appendChild(style);

    if (containerRef.current) {
      containerRef.current.style.animation = `${animationName} ${speed}s linear infinite`;
    }

    return () => {
      document.head.removeChild(style);
    };
  }, [photos, direction, speed, animationName]);

  return (
    <div className="overflow-hidden flex-1 photo-row">
      <div ref={containerRef} className="flex h-full" style={{ width: "max-content" }}>
        {photos.map((photoPath, index) => (
          <div key={`${photoPath}-${index}`} className="flex-shrink-0 h-full aspect-square overflow-hidden">
            <img
              src={photoPath}
              alt={`Hero photo ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                console.error(`Failed to load image: ${photoPath}`);
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
