-- Add video support to your memorial app
-- Run this in Supabase SQL Editor

-- ============================================
-- Step 1: Add media_type column to photos table
-- ============================================
ALTER TABLE public.photos 
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- Update existing photos to be 'image' type
UPDATE public.photos SET media_type = 'image' WHERE media_type IS NULL;

-- ============================================
-- Step 2: Update storage bucket to allow videos
-- ============================================
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'image/heic', 
    'image/heif',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm'
],
file_size_limit = 104857600  -- 100MB for videos (increased from 20MB)
WHERE id = 'memory-photos';

-- ============================================
-- Step 3: Verify the changes
-- ============================================
SELECT 
    '=== PHOTOS TABLE STRUCTURE ===' as section;

SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'photos'
ORDER BY ordinal_position;

SELECT 
    '=== STORAGE BUCKET CONFIG ===' as section;

SELECT 
    id,
    name,
    public,
    file_size_limit / 1048576 as max_size_mb,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'memory-photos';
