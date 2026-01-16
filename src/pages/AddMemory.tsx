import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MemoryForm } from "@/components/MemoryForm";
import { StaticPhotoBackground } from "@/components/StaticPhotoBackground";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AddMemory = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.from("site_settings").select("site_title").limit(1);
        if (error) console.error("Supabase connection test failed:", error);
      } catch (err) {
        console.error("Supabase connection test error:", err);
      }
    };
    testConnection();
  }, []);

  return (
    <div className="min-h-screen memorial-gradient relative">
      {/* Static Photo Background */}
      <StaticPhotoBackground />
      <div aria-hidden="true" className="page-scrim" />

      {/* Header */}
      <header className="relative z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full paper-card text-foreground hover:brightness-[0.98] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to memorial
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="paper-card rounded-2xl p-6 sm:p-10 mb-8 animate-fade-in">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
            Share a memory
          </h1>
          <div className="gold-divider my-5" />
          <p className="text-foreground/80 leading-relaxed max-w-prose">
            Write a short story, share a photograph, or leave a message for the family.
            Take your time — every contribution helps us remember Bill more fully.
          </p>
        </div>

        <div className="paper-card rounded-2xl p-6 sm:p-10 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <MemoryForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 relative z-10">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <Link
            to="/privacy"
            className="inline-flex items-center px-4 py-2 rounded-full paper-card text-foreground/80 hover:text-foreground transition"
          >
            Privacy &amp; sharing
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AddMemory;
