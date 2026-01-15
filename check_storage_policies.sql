-- Check Storage Bucket Policies for memory-photos
-- Run this to verify storage uploads will work

-- ============================================
-- PART 1: Check if bucket exists
-- ============================================

SELECT '=== CHECKING STORAGE BUCKET ===' as info;

SELECT 
    id,
    name,
    public as is_public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'memory-photos';

-- ============================================
-- PART 2: Check storage policies
-- ============================================

SELECT '=== CHECKING STORAGE POLICIES ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    CASE 
        WHEN cmd = 'INSERT' AND roles::text LIKE '%public%' THEN '✅ Allows public uploads'
        WHEN cmd = 'SELECT' AND roles::text LIKE '%public%' THEN '✅ Allows public viewing'
        ELSE '⚠️ Check this policy'
    END as status
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND (
    qual::text LIKE '%memory-photos%' 
    OR with_check::text LIKE '%memory-photos%'
)
ORDER BY cmd, policyname;

-- ============================================
-- PART 3: Verify INSERT policy exists
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
        ) THEN '✅ Storage INSERT policy exists for public'
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
        ) THEN '✅ Storage SELECT policy exists for public'
        ELSE '⚠️ Storage SELECT policy is missing (photos won''t be viewable)'
    END as storage_select_check;
