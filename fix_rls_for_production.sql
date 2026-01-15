-- Fix RLS Policies for Production Deployment
-- Run this in your Supabase SQL Editor to allow anonymous submissions

-- ============================================
-- Fix Submissions Table RLS Policies
-- ============================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can submit memories" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_anon" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_public" ON public.submissions;

-- Create policy that explicitly allows anonymous users to insert
CREATE POLICY "submissions_insert_anon"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Ensure SELECT policy allows approved submissions to be viewed
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
DROP POLICY IF EXISTS "submissions_select_public" ON public.submissions;
CREATE POLICY "submissions_select_public"
ON public.submissions
FOR SELECT
TO public
USING (
    status = 'approved' OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
);

-- ============================================
-- Fix Photos Table RLS Policies
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can upload photos" ON public.photos;
DROP POLICY IF EXISTS "photos_insert_anon" ON public.photos;

-- Create policy that explicitly allows anonymous users to insert photos
CREATE POLICY "photos_insert_anon"
ON public.photos
FOR INSERT
TO public
WITH CHECK (true);

-- Fix SELECT policy for photos
DROP POLICY IF EXISTS "Photos visible with submissions" ON public.photos;
DROP POLICY IF EXISTS "photos_select_public" ON public.photos;
CREATE POLICY "photos_select_public"
ON public.photos
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.submissions s
        WHERE s.id = photos.submission_id
        AND (
            s.status = 'approved' OR
            public.has_role(auth.uid(), 'admin') OR 
            public.has_role(auth.uid(), 'moderator')
        )
    )
);

-- ============================================
-- Add Video Support (if not already done)
-- ============================================

-- Add media_type column to photos table if it doesn't exist
ALTER TABLE public.photos 
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- Update existing photos to be 'image' type
UPDATE public.photos SET media_type = 'image' WHERE media_type IS NULL;

-- Create storage bucket if it doesn't exist, or update if it does
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'memory-photos',
    'memory-photos',
    true,
    104857600,  -- 100MB for videos
    ARRAY[
        'image/jpeg', 
        'image/png', 
        'image/webp', 
        'image/heic', 
        'image/heif',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm',
        'video/ogg'
    ]
)
ON CONFLICT (id) DO UPDATE
SET 
    allowed_mime_types = EXCLUDED.allowed_mime_types,
    file_size_limit = EXCLUDED.file_size_limit;

-- ============================================
-- Fix Storage Bucket Policies
-- ============================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can upload photos to memory-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;
DROP POLICY IF EXISTS "storage_upload_anon" ON storage.objects;
DROP POLICY IF EXISTS "storage_upload_public" ON storage.objects;
DROP POLICY IF EXISTS "storage_select_public" ON storage.objects;

-- Allow anonymous users to upload to memory-photos bucket
CREATE POLICY "storage_upload_anon"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
    bucket_id = 'memory-photos'
);

-- Allow public to view photos
CREATE POLICY "storage_select_public"
ON storage.objects
FOR SELECT
TO public
USING (
    bucket_id = 'memory-photos'
);

-- ============================================
-- Verify Policies
-- ============================================

-- Check submissions policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'submissions'
ORDER BY cmd, policyname;

-- Check photos policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'photos'
ORDER BY cmd, policyname;

-- Check storage policies
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY cmd, policyname;
