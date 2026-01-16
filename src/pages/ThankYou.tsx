import { Link } from "react-router-dom";
import { Heart, Home, Plus } from "lucide-react";
import { StaticPhotoBackground } from "@/components/StaticPhotoBackground";

const ThankYou = () => {
  return (
    <div className="min-h-screen memorial-gradient relative flex items-center justify-center px-4">
      <StaticPhotoBackground />

      {/* gentle scrim for readability */}
      <div aria-hidden className="hero-scrim z-0" />

      <div className="max-w-xl w-full relative z-10">
        <div className="memorial-card p-8 sm:p-10 text-center animate-scale-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-accent" />
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
            Thank you
          </h1>

          <div className="gold-divider mb-6" />

          <p className="text-muted-foreground leading-relaxed mb-8">
            Your submission has been received. We're grateful you took the time to share something meaningful.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-memorial-outline">
              <Home className="w-4 h-4" />
              Return to memorial
            </Link>
            <Link to="/add" className="btn-memorial">
              <Plus className="w-4 h-4" />
              Share another
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Submissions are reviewed before appearing publicly.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
