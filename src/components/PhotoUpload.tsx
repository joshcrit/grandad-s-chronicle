import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoFile {
  file: File;
  preview: string;
  caption: string;
}

interface PhotoUploadProps {
  photos: PhotoFile[];
  onChange: (photos: PhotoFile[]) => void;
  maxPhotos?: number;
  maxSizeMB?: number;
}

export function PhotoUpload({
  photos,
  onChange,
  maxPhotos = 10,
  maxSizeMB = 20,
}: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      setError(null);

      const validFiles: PhotoFile[] = [];
      const maxBytes = maxSizeMB * 1024 * 1024;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError("Please upload only image files");
          continue;
        }

        // Validate file size
        if (file.size > maxBytes) {
          setError(`Each photo must be under ${maxSizeMB}MB`);
          continue;
        }

        // Check max photos limit
        if (photos.length + validFiles.length >= maxPhotos) {
          setError(`Maximum ${maxPhotos} photos allowed`);
          break;
        }

        validFiles.push({
          file,
          preview: URL.createObjectURL(file),
          caption: "",
        });
      }

      if (validFiles.length > 0) {
        onChange([...photos, ...validFiles]);
      }
    },
    [photos, onChange, maxPhotos, maxSizeMB]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index].preview);
    newPhotos.splice(index, 1);
    onChange(newPhotos);
  };

  const updateCaption = (index: number, caption: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], caption };
    onChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          dragActive
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/50 hover:bg-muted/30",
          photos.length >= maxPhotos && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={photos.length >= maxPhotos}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Drop photos here or click to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Up to {maxPhotos} photos, {maxSizeMB}MB each
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group relative photo-frame animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={photo.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Add a caption (optional)"
                value={photo.caption}
                onChange={(e) => updateCaption(index, e.target.value)}
                className="w-full px-3 py-2 text-sm border-t border-border bg-card focus:outline-none focus:ring-1 focus:ring-accent"
                maxLength={200}
              />
            </div>
          ))}

          {/* Add More Placeholder */}
          {photos.length < maxPhotos && (
            <label className="aspect-square border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 hover:bg-muted/30 transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Add more</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
