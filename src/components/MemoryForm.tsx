import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import { PhotoUpload } from "./PhotoUpload";
import { supabase, uploadPhoto } from "@/lib/supabase";
import { toast } from "sonner";

interface PhotoFile {
  file: File;
  preview: string;
  caption: string;
}

const MAX_BODY_CHARS = 2000;

export function MemoryForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [consent, setConsent] = useState(false);
  
  // Honeypot for spam
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Spam check
    if (honeypot) {
      navigate("/thank-you");
      return;
    }

    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in the required fields");
      return;
    }

    if (!consent) {
      toast.error("Please confirm you have permission to share");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create submission
      const { data: submission, error: submissionError } = await supabase
        .from("submissions")
        .insert({
          contributor_name: name.trim() || null,
          contributor_relationship: relationship.trim() || null,
          contributor_email: email.trim() || null,
          title: title.trim(),
          body: body.trim(),
          consent_given: consent,
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const storagePath = await uploadPhoto(photo.file, submission.id);
        
        const { error: photoError } = await supabase
          .from("photos")
          .insert({
            submission_id: submission.id,
            storage_path: storagePath,
            caption: photo.caption.trim() || null,
            order_index: i,
          });

        if (photoError) {
          console.error("Photo upload error:", photoError);
        }
      }

      navigate("/thank-you");
    } catch (error: any) {
      console.error("Submission error:", error);
      // Show more specific error message
      const errorMessage = error?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Full error details:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const charsRemaining = MAX_BODY_CHARS - body.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot - hidden from users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Personal Info Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-foreground">About You</h3>
        <p className="text-sm text-muted-foreground">
          All fields are optional – share as much as you're comfortable with.
        </p>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sarah Johnson"
              className="input-memorial"
              maxLength={100}
            />
          </div>
          
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-foreground mb-2">
              Your Relationship
            </label>
            <input
              id="relationship"
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g., Granddaughter, Old Friend"
              className="input-memorial"
              maxLength={100}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
            <span className="text-muted-foreground font-normal ml-2">
              (to receive confirmation)
            </span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-memorial"
            maxLength={255}
          />
        </div>
      </div>

      <div className="gold-divider" />

      {/* Memory Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-foreground">Your Memory</h3>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Memory Title <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Summer Fishing Trips"
            className="input-memorial"
            maxLength={150}
            required
          />
        </div>
        
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-foreground mb-2">
            Your Memory <span className="text-destructive">*</span>
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, MAX_BODY_CHARS))}
            placeholder="Share your favorite memory, a story, or what this person meant to you..."
            className="textarea-memorial min-h-[200px]"
            required
          />
          <div className="flex justify-end mt-1">
            <span className={`text-sm ${charsRemaining < 100 ? "text-destructive" : "text-muted-foreground"}`}>
              {charsRemaining.toLocaleString()} characters remaining
            </span>
          </div>
        </div>
      </div>

      <div className="gold-divider" />

      {/* Photos Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl text-foreground">Photos</h3>
        <p className="text-sm text-muted-foreground">
          Add up to 10 photos to accompany your memory. These are optional.
        </p>
        <PhotoUpload photos={photos} onChange={setPhotos} />
      </div>

      <div className="gold-divider" />

      {/* Consent & Submit */}
      <div className="space-y-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-5 h-5 border-2 border-border rounded peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center group-hover:border-accent/50">
              {consent && <Check className="w-3 h-3 text-accent-foreground" />}
            </div>
          </div>
          <span className="text-sm text-foreground leading-relaxed">
            I confirm I have permission to share these photos and memories, and I understand they may be included in a printed memorial compilation. <span className="text-destructive">*</span>
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting || !consent}
          className="btn-memorial w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Share This Memory"
          )}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          Submissions are reviewed before being added to the memorial.
        </p>
      </div>
    </form>
  );
}
