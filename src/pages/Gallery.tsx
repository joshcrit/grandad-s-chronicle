import { Link } from "react-router-dom";
import { ArrowLeft, Heart, X, ZoomIn, ZoomOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useCallback, useState } from "react";
import { supabase, getPhotoUrl } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

type PhotoRow = {
  id: string;
  storage_path: string;
  caption: string | null;
  order_index: number;
  media_type?: string;
};

type SubmissionRow = {
  id: string;
  title: string;
  body: string;
  contributor_name: string | null;
  contributor_relationship: string | null;
  created_at: string;
  photos: PhotoRow[] | null;
};

type CollagePhoto = PhotoRow & {
  submission_title: string;
  submission_created_at: string;
};

function flattenPhotosFromSubmissions(submissions: SubmissionRow[] | null): CollagePhoto[] {
  if (!submissions || submissions.length === 0) return [];
  const flat: CollagePhoto[] = [];
  for (const sub of submissions) {
    const photos = (sub.photos || []).sort((a, b) => a.order_index - b.order_index);
    for (const photo of photos) {
      flat.push({
        ...photo,
        submission_title: sub.title,
        submission_created_at: sub.created_at,
      });
    }
  }
  return flat;
}

const Gallery = () => {
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["approved-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select(
          `
          id,
          title,
          body,
          contributor_name,
          contributor_relationship,
          created_at,
          photos (*)
        `
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SubmissionRow[];
    },
  });

  const collagePhotos = flattenPhotosFromSubmissions(submissions ?? null);
  const hasPhotos = collagePhotos.length > 0;
  const hasSubmissions = !!(submissions && submissions.length > 0);
  const [selectedPhoto, setSelectedPhoto] = useState<CollagePhoto | null>(null);
  const [zoom, setZoom] = useState(1);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
    setZoom(1);
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedPhoto, closeLightbox]);

  return (
    <div className="min-h-screen memorial-gradient">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="btn-memorial-outline">
            <ArrowLeft className="w-4 h-4" />
            Return to home page
          </Link>
          <Link to="/add" className="btn-memorial">
            Share a memory
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="mb-10 sm:mb-12">
          <p className="hero-eyebrow text-foreground/70 [text-shadow:none]">
            Photos from memories shared by family and friends
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
            Read memories
          </h1>
          <p className="text-muted-foreground mb-2">
            Scroll down to see more as they are added.
          </p>
          <div className="gold-divider !mx-0" />
        </div>

        {isLoading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <Skeleton
                  className="w-full rounded-lg"
                  style={{ height: [180, 220, 260, 200, 240][i % 5] }}
                />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="font-medium text-destructive mb-2">Could not load memories</p>
            <p className="text-sm text-muted-foreground mb-4">
              {(error as Error).message}
            </p>
            <p className="text-xs text-muted-foreground">
              Check that Row Level Security allows public read of approved submissions and photos.
            </p>
          </div>
        ) : !hasPhotos && !hasSubmissions ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              No memories yet
            </h2>
            <p className="text-muted-foreground mb-2">
              Be the first to share a memory, with or without photos.
            </p>
            <Link to="/add" className="btn-memorial">
              Share the first memory
            </Link>
          </div>
        ) : (
          <>
            {hasPhotos && (
              <div
                className="columns-2 sm:columns-3 lg:columns-4 gap-4 collage-masonry"
                role="list"
                aria-label="Photo collage from shared memories"
              >
                {collagePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="break-inside-avoid mb-4 rounded-lg overflow-hidden bg-muted/50 shadow-sm hover:shadow-md transition-shadow"
                    role="listitem"
                  >
                    {photo.media_type === "video" ? (
                      <div
                        className="aspect-video w-full cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedPhoto(photo)}
                        role="button"
                        tabIndex={0}
                        aria-label="Expand video"
                      >
                        <video
                          src={getPhotoUrl(photo.storage_path)}
                          className="w-full h-full object-cover pointer-events-none"
                          playsInline
                          preload="metadata"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg overflow-hidden"
                        onClick={() => setSelectedPhoto(photo)}
                        aria-label="Expand photo to view larger"
                      >
                        <img
                          src={getPhotoUrl(photo.storage_path)}
                          alt={photo.caption || "Memory photo"}
                          className="w-full h-auto block cursor-zoom-in"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {(photo.caption || photo.submission_title) && (
                      <div className="p-2 sm:p-3 bg-card/80">
                        {photo.caption && (
                          <p className="text-sm text-foreground/90">{photo.caption}</p>
                        )}
                        {photo.submission_title && (
                          <p className="text-xs text-muted-foreground mt-1">
                            From: {photo.submission_title}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {hasSubmissions && (
              <section className="mt-12 space-y-6">
                <div className="mb-2">
                  <h2 className="font-serif text-2xl text-foreground mb-1">
                    Stories behind these photos
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Read the memories that family and friends have shared, together with their photos.
                  </p>
                </div>

                <div className="space-y-6">
                  {submissions!.map((submission) => (
                    <article
                      key={submission.id}
                      className="memorial-card p-6 sm:p-8"
                    >
                      <header className="mb-4">
                        <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-1">
                          {submission.title}
                        </h3>
                        {(submission.contributor_name || submission.contributor_relationship) && (
                          <p className="text-sm text-muted-foreground">
                            {submission.contributor_name && (
                              <span className="font-medium">{submission.contributor_name}</span>
                            )}
                            {submission.contributor_name && submission.contributor_relationship && " · "}
                            {submission.contributor_relationship && <span>{submission.contributor_relationship}</span>}
                          </p>
                        )}
                      </header>

                      <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {submission.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border/50 py-6 mt-10">
        <div className="container max-w-6xl mx-auto px-4 text-sm text-muted-foreground flex items-center justify-between">
          <p>A private memorial for family and friends</p>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Notice
          </Link>
        </div>
      </footer>

      {/* Lightbox: click to expand, zoom, close */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded photo view"
        >
          <div className="absolute top-0 right-0 p-4 flex items-center gap-2 z-10">
            {selectedPhoto.media_type !== "video" && (
              <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-white text-sm min-w-[3rem] text-center tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="flex-1 flex items-center justify-center overflow-auto p-4 pt-16"
            onClick={closeLightbox}
          >
            <div
              className="flex items-center justify-center min-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedPhoto.media_type === "video" ? (
                <video
                  src={getPhotoUrl(selectedPhoto.storage_path)}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={getPhotoUrl(selectedPhoto.storage_path)}
                  alt={selectedPhoto.caption || "Memory photo"}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain select-none"
                  style={{ transform: `scale(${zoom})` }}
                  draggable={false}
                />
              )}
            </div>
          </div>

          {(selectedPhoto.caption || selectedPhoto.submission_title) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white text-sm text-center">
              {selectedPhoto.caption && <p className="font-medium">{selectedPhoto.caption}</p>}
              {selectedPhoto.submission_title && (
                <p className="text-white/80 text-xs mt-1">From: {selectedPhoto.submission_title}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
