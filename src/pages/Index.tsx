import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroCarousel } from "@/components/HeroCarousel";

const Index = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const siteTitle = settings?.site_title || "In Loving Memory - Bill Godfrey";
  const introText = settings?.intro_text || 
    "Share your memories and photos to celebrate an Incredible life.";
  const submissionsOpen = settings?.submissions_open ?? true;

  return (
    <div className="min-h-screen memorial-gradient relative">
      {/* Photo Carousel Background */}
      <HeroCarousel />
      
      {/* Hero Section */}
      <header className="relative z-10">
        <div className="container max-w-4xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20">
          <div className="text-center animate-fade-in">
            {/* Decorative Element */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent" />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {siteTitle}
            </h1>

            {/* Divider */}
            <div className="gold-divider mb-6" />

            {/* Intro */}
            <p className="text-lg sm:text-xl text-white leading-relaxed mb-10 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {introText}
            </p>

            {/* CTA */}
            {submissionsOpen ? (
              <Link
                to="/add"
                className="btn-memorial text-lg px-8 py-4 inline-flex"
              >
                Add a Memory
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="memorial-card inline-block px-6 py-4">
                <p className="text-muted-foreground">
                  Submissions are now closed. Thank you for all the memories shared.
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Info Section */}
      <section className="pb-16 sm:pb-24 relative z-10">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="memorial-card p-8 sm:p-10 text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
              Celebrating a life well lived.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We invite you to share your favorite memories, stories, photos and videos of Bill, Dad, Grandpa, Father Godfrey or however he was known to you. 
              Your contributions will be compiled into a beautiful bank of memories so that we can never forget him.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Share written memories
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Upload photos & videos
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Add personal tributes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 relative z-10">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Link 
            to="/privacy" 
            className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-black hover:bg-white transition-colors text-sm"
          >
            Privacy Notice
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
