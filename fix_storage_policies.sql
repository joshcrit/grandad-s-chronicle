-- Fix Storage Bucket Policies for memory-photos
-- Run this if storage uploads are failing

-- ============================================
-- PART 1: Create bucket if it doesn't exist
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'memory-photos',
    'memory-photos',
    true,
    104857600,  -- 100MB (for videos)
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
    file_size_limit = EXCLUDED.file_size_limit,
    public = true;

-- ============================================
-- PART 2: Remove existing storage policies
-- ============================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND (
            qual::text LIKE '%memory-photos%' 
            OR with_check::text LIKE '%memory-photos%'
            OR policyname LIKE '%memory-photos%'
        )
    ) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- ============================================
-- PART 3: Create INSERT policy (upload)
-- ============================================

CREATE POLICY "storage_upload_memory_photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'memory-photos');

-- ============================================
-- PART 4: Create SELECT policy (view)
-- ============================================

CREATE POLICY "storage_select_memory_photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memory-photos');

-- ============================================
-- PART 5: Verify the fix
-- ============================================

SELECT '=== VERIFICATION ===' as info;

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets WHERE id = 'memory-photos'
        ) THEN '✅ Storage bucket exists'
        ELSE '❌ Storage bucket does NOT exist!'
    END as bucket_check,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' 
            AND tablename = 'objects'
            AND cmd = 'INSERT'
            AND (qual::text LIKE '%memory-photos%' OR with_check::text LIKE '%memory-photos%')
            AND roles::text LIKE '%public%'
        ) THEN '✅ Storage INSERT policy exists'
        ELSE '❌ Storage INSERT policy is missing!'
    END as storage_insert_check,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' 
            AND tablename = 'objects'
            AND cmd = 'SELECT'
            AND (qual::text LIKE '%memory-photos%' OR with_check::text LIKE '%memory-photos%')
            AND roles::text LIKE '%public%'
        ) THEN '✅ Storage SELECT policy exists'
        ELSE '❌ Storage SELECT policy is missing!'
    END as storage_select_check;
