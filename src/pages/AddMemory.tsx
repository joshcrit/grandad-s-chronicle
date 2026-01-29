import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MemoryForm } from "@/components/MemoryForm";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AddMemory = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase
          .from("site_settings")
          .select("site_title")
          .limit(1);
        if (error) console.error("Supabase connection test failed:", error);
      } catch (err) {
        console.error("Supabase connection test error:", err);
      }
    };
    testConnection();
  }, []);

  return (
    <div className="min-h-screen memorial-gradient">
      <header className="container max-w-5xl mx-auto px-4 py-6">
        <Link to="/" className="back-pill">
          <ArrowLeft className="w-4 h-4" />
          Return to home page
        </Link>
      </header>

      <main className="container max-w-3xl mx-auto px-4 pb-16">
        <div className="paper-card rounded-[24px] p-8 sm:p-12">
          <h1 className="hero-name" style={{ fontSize: "2.25rem" }}>
            Share a memory
          </h1>

          <p className="hero-paragraph mt-4">
            A short story, a photograph, or a message for the family.
          </p>

          <div className="form-divider" />

          <MemoryForm />
        </div>

        <p className="mt-8 text-sm text-muted-foreground text-center">
          Submissions are reviewed before appearing on the memorial.
        </p>
      </main>

      <footer className="pb-10 text-center">
        <Link to="/privacy" className="quiet-link">
          Privacy &amp; sharing
        </Link>
      </footer>
    </div>
  );
};

export default AddMemory;
