import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const Privacy = () => {
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

      {/* Content */}
      <main className="container max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-accent" />
            </div>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
            Privacy Notice
          </h1>
          <div className="gold-divider" />
        </div>

        <div className="memorial-card p-8 sm:p-10 prose prose-neutral max-w-none">
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

          <h2 className="font-serif text-xl text-foreground">How we use it</h2>
          <p className="text-muted-foreground">
            All submissions are used exclusively for creating a memorial compilation 
            for the family. This may include:
          </p>
          <ul className="text-muted-foreground">
            <li>A printed memory book for the funeral service</li>
            <li>A digital keepsake for family members</li>
            <li>Display during memorial services (with your permission)</li>
          </ul>

          <h2 className="font-serif text-xl text-foreground">Who can see it</h2>
          <p className="text-muted-foreground">
            This is a private memorial. Submissions are reviewed by the family 
            administrator before being included. Your contact information is never 
            shared publicly.
          </p>

          <h2 className="font-serif text-xl text-foreground">Data retention</h2>
          <p className="text-muted-foreground">
            Photos and memories are kept for as long as the family wishes to maintain 
            this memorial. You may request removal of your submission by contacting 
            the family directly.
          </p>

          <h2 className="font-serif text-xl text-foreground">Questions?</h2>
          <p className="text-muted-foreground">
            If you have any questions about your privacy or how your submissions 
            are used, please reach out to the family directly.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Return to Memorial
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
