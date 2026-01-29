import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroCarousel } from "@/components/HeroCarousel";

const Index = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (error) throw error;
      return data;
    },
  });

  // Keep settings wiring, but stop using the generic AI-ish defaults in the hero.
  // (You can later manage these fields in Supabase if you want.)
  const submissionsOpen = settings?.submissions_open ?? true;

  return (
    <div className="min-h-screen memorial-gradient relative">
      {/* HERO */}
      <header className="hero-shell">
        <div className="hero-overlay">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="hero-split">
              <div className="hero-text">
                <div className="hero-content">
                  {/* Eyebrow: stop listing "roles" like tags. One bilingual-aware line, human tone. */}
                  <p className="hero-eyebrow-new">
                    Bishop Bill Godfrey <span aria-hidden="true">·</span> Obispo William <span aria-hidden="true">·</span> Grandpa <span aria-hidden="true">·</span> Dad
                  </p>

                  <h1 className="hero-title-new">Bill Godfrey</h1>

                  {/* One line. No "retired". No impersonality. */}
                  <p className="hero-subtitle-new">
                    Bishop of Peru &amp; Uruguay — priest, father, grandfather.
                  </p>

                  {/* One sentence max. Present tense. */}
                  <p className="hero-intro-new">
                    A place for stories and photographs — so we can remember Bill together.
                  </p>

                  <div className="hero-actions">
                    {submissionsOpen ? (
                      <>
                        <Link to="/add" className="hero-cta-primary">
                          Share a memory
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/gallery" className="hero-cta-secondary">
                          Read shared memories
                        </Link>
                      </>
                    ) : (
                      <p className="hero-intro-new hero-note">
                        Submissions are closed. Thank you for the memories shared.
                      </p>
                    )}
                  </div>

                  {/* Replace "Privacy & sharing" page link with one calm disclosure line */}
                  <p className="hero-disclosure">
                    Memories are reviewed by family before appearing on the site.
                  </p>
                </div>
              </div>
              <div className="hero-media">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TIMELINE STRIP (placeholder, horizontal) */}
      <section className="timeline-shell" aria-label="Timeline">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="timeline-header">
            <h2 className="timeline-title">A life in brief</h2>
            <p className="timeline-subtitle">
              We'll add key moments from his life and ministry here.
            </p>
          </div>

          <div className="timeline-rail" role="list">
            {[
              { year: "—", label: "Early life", note: "Placeholder" },
              { year: "—", label: "Ordination", note: "Placeholder" },
              { year: "—", label: "Peru & Uruguay", note: "Placeholder" },
              { year: "—", label: "Friendships & family", note: "Placeholder" },
              { year: "—", label: "Later years", note: "Placeholder" },
            ].map((item, i) => (
              <div className="timeline-item" role="listitem" key={i}>
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-label">{item.label}</div>
                <div className="timeline-note">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nothing else on the homepage for now.
          Keep it restrained: hero + timeline + entry points already live in hero. */}
    </div>
  );
};

export default Index;
