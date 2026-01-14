import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MemoryForm } from "@/components/MemoryForm";
import { StaticPhotoBackground } from "@/components/StaticPhotoBackground";

const AddMemory = () => {
  return (
    <div className="min-h-screen memorial-gradient relative">
      {/* Static Photo Background */}
      <StaticPhotoBackground />
      {/* Header */}
      <header className="border-b border-border/50 relative z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-black hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block px-6 py-3 mb-4 bg-white/90 backdrop-blur-sm rounded-lg">
            <h1 className="font-serif text-3xl sm:text-4xl text-black">
              Share a Memory
            </h1>
          </div>
          <div className="inline-block px-6 py-3 mb-10 bg-white/90 backdrop-blur-sm rounded-lg max-w-lg mx-auto">
            <p className="text-black">
              Take your time to share your thoughts, stories, and photos. 
              Every memory helps paint a picture of a life well lived.
            </p>
          </div>
        </div>

        <div className="memorial-card p-6 sm:p-10 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <MemoryForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-8 relative z-10">
        <div className="container max-w-3xl mx-auto px-4 text-center">
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

export default AddMemory;
