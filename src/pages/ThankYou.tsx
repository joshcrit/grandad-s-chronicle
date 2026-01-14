import { Link } from "react-router-dom";
import { Heart, Home, Plus } from "lucide-react";

const ThankYou = () => {
  return (
    <div className="min-h-screen memorial-gradient flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="memorial-card p-10 sm:p-12 animate-scale-in">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Heart className="w-10 h-10 text-success" />
            </div>
          </div>

          {/* Message */}
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
            Thank You
          </h1>
          
          <div className="gold-divider mb-6" />
          
          <p className="text-muted-foreground leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
            Your memory has been received and will be reviewed shortly. 
            Thank you for taking the time to share something so meaningful.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "500ms" }}>
            <Link to="/" className="btn-memorial">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <Link to="/add" className="btn-memorial-outline">
              <Plus className="w-4 h-4" />
              Add Another Memory
            </Link>
          </div>
        </div>

        {/* Subtle footer */}
        <p className="text-sm text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: "600ms" }}>
          If you provided an email, you'll receive a confirmation shortly.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
