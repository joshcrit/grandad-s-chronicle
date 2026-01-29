import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
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
            Privacy &amp; sharing
          </h1>

          <p className="hero-paragraph mt-4">
            This memorial is for family, friends, and the communities Bill served.
            Please share only what you have permission to share.
          </p>

          <div className="form-divider" />

          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              <strong>What you can submit:</strong> a written memory, photos or videos,
              and (optionally) your name and relationship.
            </p>
            <p>
              <strong>Email is optional</strong> and only used for confirmation.
            </p>
            <p>
              <strong>Review:</strong> submissions are reviewed by the family before appearing.
            </p>
            <p>
              If you'd like something removed or corrected, please contact the family directly.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
