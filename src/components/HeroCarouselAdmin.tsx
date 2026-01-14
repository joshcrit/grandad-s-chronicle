import { useState, useCallback } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, uploadPhoto, getPhotoUrl, deletePhoto } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroCarouselAdmin() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: photos, isLoading } = useQuery({
    queryKey: ["hero-carousel-photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_carousel_photos")
        .select("*")
        .order("row_number", { ascending: true })
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const photo = photos?.find((p) => p.id === id);
      if (photo) {
        // Delete from storage
        await deletePhoto(photo.storage_path);
        // Delete from database
        const { error } = await supabase
          .from("hero_carousel_photos")
          .delete()
          .eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-carousel-photos"] });
      toast.success("Photo removed");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove photo");
    },
  });

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploading(true);
      const maxBytes = 20 * 1024 * 1024; // 20MB
      const validFiles: File[] = [];

      // Validate files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }
        if (file.size > maxBytes) {
          toast.error(`${file.name} is too large (max 20MB)`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        setUploading(false);
        return;
      }

      try {
        // Get current photos to determine row assignments
        const currentPhotos = photos || [];
        const photosPerRow = 10;
        const totalRows = 4;

        // Group existing photos by row
        const rowCounts = [0, 0, 0, 0];
        currentPhotos.forEach((photo) => {
          if (photo.row_number >= 1 && photo.row_number <= 4) {
            rowCounts[photo.row_number - 1]++;
          }
        });

        // Upload files and assign to rows
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          
          // Determine which row (round-robin if rows are full)
          let targetRow = 1;
          let minCount = rowCounts[0];
          for (let r = 0; r < totalRows; r++) {
            if (rowCounts[r] < minCount) {
              minCount = rowCounts[r];
              targetRow = r + 1;
            }
          }

          // If target row is full, find next available row
          if (rowCounts[targetRow - 1] >= photosPerRow) {
            targetRow = (rowCounts.findIndex((count) => count < photosPerRow) + 1) || 1;
          }

          // Upload to storage
          const tempId = crypto.randomUUID();
          const storagePath = await uploadPhoto(file, tempId);

          // Insert into database
          const displayOrder = rowCounts[targetRow - 1];
          const { error } = await supabase
            .from("hero_carousel_photos")
            .insert({
              storage_path: storagePath,
              row_number: targetRow,
              display_order: displayOrder,
            });

          if (error) throw error;
          rowCounts[targetRow - 1]++;
        }

        queryClient.invalidateQueries({ queryKey: ["hero-carousel-photos"] });
        toast.success(`Uploaded ${validFiles.length} photo(s)`);
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.message || "Failed to upload photos");
      } finally {
        setUploading(false);
      }
    },
    [photos, queryClient]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  // Group photos by row
  const rows = [1, 2, 3, 4].map((rowNum) => {
    return photos?.filter((photo) => photo.row_number === rowNum) || [];
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Hero Carousel Photos
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload up to 40 photos (10 per row). Photos will automatically be distributed across 4 rows.
        </p>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all",
            uploading
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50 hover:bg-muted/30"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-foreground">
                {uploading ? "Uploading..." : "Drop photos here or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Up to 40 photos, 20MB each
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Grid by Row */}
      {isLoading ? (
        <div className="grid grid-cols-5 gap-4">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {rows.map((rowPhotos, rowIndex) => (
            <div key={rowIndex} className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">
                Row {rowIndex + 1} ({rowPhotos.length}/10 photos)
              </h4>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {rowPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={getPhotoUrl(photo.storage_path)}
                      alt={`Row ${photo.row_number} photo ${photo.display_order}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => deleteMutation.mutate(photo.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {rowPhotos.length < 10 && (
                  <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                    {10 - rowPhotos.length} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
