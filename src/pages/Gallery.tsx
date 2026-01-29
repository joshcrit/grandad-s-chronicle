import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
        ) : collagePhotos.length > 0 ? (
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
                  <div className="aspect-video w-full">
                    <video
                      src={getPhotoUrl(photo.storage_path)}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>
                ) : (
                  <img
                    src={getPhotoUrl(photo.storage_path)}
                    alt={photo.caption || "Memory photo"}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
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
        ) : (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="font-serif text-2xl text-foreground mb-3">
              No photos yet
            </h2>
            <p className="text-muted-foreground mb-2">
              Be the first to share a photo or memory.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Only approved submissions appear here. Approve them in the Admin area to show them on this page.
            </p>
            <Link to="/add" className="btn-memorial">
              Share the first memory
            </Link>
          </div>
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
    </div>
  );
};

export default Gallery;
