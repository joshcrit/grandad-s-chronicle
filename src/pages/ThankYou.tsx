import { Link } from "react-router-dom";
import { Heart, Home, Plus } from "lucide-react";

const ThankYou = () => {
  return (
    <div className="min-h-screen memorial-gradient relative flex items-center justify-center px-4">
      {/* Background Image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/carousel/4dee5fb7-b588-4b52-b2ce-14ca5d63d327.JPG)'
        }}
      />
      
      <div className="max-w-lg w-full text-center relative z-10">
        <div className="p-10 sm:p-12 animate-scale-in">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Heart className="w-10 h-10 text-success" />
            </div>
          </div>

          {/* Message */}
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4 animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ animationDelay: "300ms" }}>
            Thank You
          </h1>
          
          <div className="gold-divider mb-6" />
          
          <p className="text-white leading-relaxed mb-8 animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ animationDelay: "400ms" }}>
            Your memories are greatly appreciated. 
            Thank you for taking the time to share something so meaningful.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "500ms" }}>
            <Link to="/" className="btn-memorial">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <Link to="/add" className="btn-memorial">
              <Plus className="w-4 h-4" />
              Add Another Memory
            </Link>
          </div>
        </div>

        {/* Subtle footer */}
        <p className="text-sm text-white mt-8 animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ animationDelay: "600ms" }}>
          If you provided an email, we would love to keep in touch.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
