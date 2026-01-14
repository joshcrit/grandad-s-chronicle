import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Helper to get public URL for photos
export const getPhotoUrl = (storagePath: string) => {
  const { data } = supabase.storage
    .from("memory-photos")
    .getPublicUrl(storagePath);
  return data.publicUrl;
};

// Upload photo to storage
export const uploadPhoto = async (file: File, submissionId: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${submissionId}/${crypto.randomUUID()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from("memory-photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  return data.path;
};

// Delete photo from storage
export const deletePhoto = async (storagePath: string) => {
  const { error } = await supabase.storage
    .from("memory-photos")
    .remove([storagePath]);

  if (error) throw error;
};
