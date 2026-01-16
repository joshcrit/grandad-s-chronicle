import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

  // Keep settings-driven values available, but we are enforcing real hierarchy in the hero.
  const submissionsOpen = settings?.submissions_open ?? true;

  return (
    <div className="min-h-screen memorial-gradient relative">
      <HeroCarousel />

      {/* Hero Section */}
      <header className="relative z-10 overflow-hidden">
        {/* Global scrim over the moving photo field */}
        <div aria-hidden="true" className="hero-scrim" />

        <div className="container mx-auto max-w-6xl px-4 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="relative grid md:grid-cols-[minmax(0,44rem)_1fr] md:gap-x-16 items-center animate-fade-in">
            {/* Local veil behind just the copy */}
            <div aria-hidden="true" className="hero-veil" />

            <div className="relative">
              {/* Bilingual / human naming line (NOT a tag cloud) */}
              <p className="hero-eyebrow">
                Bishop Bill Godfrey <span className="sep" /> Obispo Godfrey <span className="sep" /> Grandpa
              </p>

              {/* Use "Bill Godfrey" as the headline */}
              <h1 className="hero-title">Bill Godfrey</h1>

              {/* Make the subtitle human, not résumé */}
              <p className="hero-subtitle">
                A father, grandpa, bishop — and a friend to many across the world.
              </p>

              <div className="gold-divider hero-divider" />

              {/* Present tense, invitational, specific */}
              <p className="hero-intro">
                This is a place to gather stories, photographs, and moments — so we can remember Bill together,
                in the voices of everyone who knew him.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {submissionsOpen ? (
                  <>
                    <Link to="/add" className="hero-cta">
                      Share a memory
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/gallery" className="hero-secondary">
                      Read shared memories
                    </Link>
                  </>
                ) : (
                  <p className="hero-intro text-white/70">
                    Submissions are now closed. Thank you for every memory shared.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Paper Section */}
      <section id="memories" className="paper-section">
        <div className="container mx-auto max-w-5xl px-4 py-14 sm:py-18">
          <h2 className="paper-title">Celebrating a life well lived.</h2>
          <p className="paper-body">
            Add a story, a photograph, or a short tribute—whether you knew him as Bill, Dad, Grandpa, Father Godfrey, or Obispo Godfrey.
          </p>

          <div className="paper-features">
            <div>Share written memories</div>
            <div>Upload photos &amp; videos</div>
            <div>Add personal tributes</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
