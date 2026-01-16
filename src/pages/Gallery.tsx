import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase, getPhotoUrl } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const Gallery = () => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["approved-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select(
          `
          *,
          photos (*)
        `
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen memorial-gradient">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="btn-memorial-outline">
            <ArrowLeft className="w-4 h-4" />
            Return to memorial
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
            Stories and photographs shared by family and friends
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
            Shared memories
          </h1>
          <div className="gold-divider !mx-0" />
        </div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="memorial-card p-6 sm:p-8">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-40 w-full" />
              </div>
            ))}
          </div>
        ) : submissions && submissions.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {submissions.map((submission, index) => (
              <article
                key={submission.id}
                className="memorial-card p-6 sm:p-8 animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <header className="mb-4">
                  <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-2">
                    {submission.title}
                  </h2>
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

                <div className="gold-divider !mx-0 mb-4" />

                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap mb-6">
                  {submission.body}
                </p>

                {submission.photos && submission.photos.length > 0 && (
                  <div
                    className={`grid gap-3 ${
                      submission.photos.length === 1
                        ? "grid-cols-1"
                        : submission.photos.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2 sm:grid-cols-3"
                    }`}
                  >
                    {submission.photos
                      .sort((a: any, b: any) => a.order_index - b.order_index)
                      .map((photo: any) => (
                        <div key={photo.id} className="photo-frame">
                          <div className="aspect-square">
                            {photo.media_type === "video" ? (
                              <video
                                src={getPhotoUrl(photo.storage_path)}
                                className="w-full h-full object-cover"
                                controls
                                playsInline
                              />
                            ) : (
                              <img
                                src={getPhotoUrl(photo.storage_path)}
                                alt={photo.caption || "Memory photo"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            )}
                          </div>
                          {photo.caption && (
                            <p className="p-2 text-xs text-muted-foreground text-center">
                              {photo.caption}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </article>
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
              No memories yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Be the first to share a cherished memory.
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
