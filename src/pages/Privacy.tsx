import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen memorial-gradient">
      <header className="border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="btn-memorial-outline">
            <ArrowLeft className="w-4 h-4" />
            Return to memorial
          </Link>
          <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View shared memories
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <div className="mb-10">
          <p className="hero-eyebrow text-foreground/70 [text-shadow:none]">
            Privacy and how submissions are used
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
            Privacy Notice
          </h1>
          <div className="gold-divider !mx-0" />
        </div>

        <div className="space-y-6">
          <div className="memorial-card p-6 sm:p-8 prose prose-neutral max-w-none">
            <h2 className="font-serif text-xl text-foreground mt-0">What we collect</h2>
            <p className="text-muted-foreground">
              This memorial site collects only the information you choose to share:
            </p>
            <ul className="text-muted-foreground">
              <li>Your name and relationship (optional)</li>
              <li>Your email address (optional, for confirmation only)</li>
              <li>Your written memories</li>
              <li>Photos you upload</li>
            </ul>
          </div>

          <div className="memorial-card p-6 sm:p-8 prose prose-neutral max-w-none">
            <h2 className="font-serif text-xl text-foreground">How we use it</h2>
            <p className="text-muted-foreground">
              All submissions are used exclusively for creating a memorial compilation for the family. This may include:
            </p>
            <ul className="text-muted-foreground">
              <li>A printed memory book for the funeral service</li>
              <li>A digital keepsake for family members</li>
              <li>Display during memorial services</li>
            </ul>
          </div>

          <div className="memorial-card p-6 sm:p-8 prose prose-neutral max-w-none">
            <h2 className="font-serif text-xl text-foreground">Who can see it</h2>
            <p className="text-muted-foreground">
              This is a private memorial. Submissions are reviewed by the family administrator before being included.
              Your contact information is never shared publicly.
            </p>
          </div>

          <div className="memorial-card p-6 sm:p-8 prose prose-neutral max-w-none">
            <h2 className="font-serif text-xl text-foreground">Data retention</h2>
            <p className="text-muted-foreground">
              Photos and memories are kept for as long as the family wishes to maintain this memorial.
              You may request removal of your submission by contacting the family directly.
            </p>
          </div>

          <div className="memorial-card p-6 sm:p-8 prose prose-neutral max-w-none">
            <h2 className="font-serif text-xl text-foreground">Questions?</h2>
            <p className="text-muted-foreground">
              If you have any questions about your privacy or how your submissions are used, please reach out to the family directly.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-6 mt-10">
        <div className="container max-w-6xl mx-auto px-4 text-sm text-muted-foreground flex items-center justify-between">
          <p>Thank you for contributing thoughtfully.</p>
          <Link to="/" className="hover:text-foreground transition-colors">
            Return to memorial
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
