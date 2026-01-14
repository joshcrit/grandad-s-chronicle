import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MemoryForm } from "@/components/MemoryForm";

const AddMemory = () => {
  return (
    <div className="min-h-screen memorial-gradient">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
            Share a Memory
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Take your time to share your thoughts, stories, and photos. 
            Every memory helps paint a picture of a life well lived.
          </p>
        </div>

        <div className="memorial-card p-6 sm:p-10 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <MemoryForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy Notice
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AddMemory;
