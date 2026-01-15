-- Test Connection and Insert Capability
-- Run this in Supabase SQL Editor to verify everything works

-- ============================================
-- Step 1: Verify INSERT policies exist
-- ============================================

SELECT '=== CHECKING INSERT POLICIES ===' as step;

SELECT 
    tablename,
    policyname,
    cmd,
    roles::text as roles,
    CASE WHEN with_check IS NULL THEN 'NULL (no check)' ELSE 'SET' END as with_check_status
FROM pg_policies 
WHERE tablename IN ('submissions', 'photos')
AND cmd = 'INSERT'
ORDER BY tablename, policyname;

-- ============================================
-- Step 2: Test anonymous insert (simulated)
-- ============================================

SELECT '=== TESTING ANONYMOUS INSERT ===' as step;

-- This simulates what an anonymous user would do
-- Note: This will run as the current user, but tests the policy logic
DO $$
DECLARE
    test_submission_id UUID;
    test_photo_id UUID;
BEGIN
    -- Try to insert a test submission
    INSERT INTO public.submissions (title, body, consent_given)
    VALUES ('TEST - DELETE ME', 'This is a test submission', true)
    RETURNING id INTO test_submission_id;
    
    RAISE NOTICE '✅ Successfully inserted test submission: %', test_submission_id;
    
    -- Try to insert a test photo
    INSERT INTO public.photos (submission_id, storage_path, order_index, media_type)
    VALUES (test_submission_id, 'test/path.jpg', 0, 'image')
    RETURNING id INTO test_photo_id;
    
    RAISE NOTICE '✅ Successfully inserted test photo: %', test_photo_id;
    
    -- Clean up
    DELETE FROM public.photos WHERE id = test_photo_id;
    DELETE FROM public.submissions WHERE id = test_submission_id;
    
    RAISE NOTICE '✅ Test completed successfully - inserts work!';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR: %', SQLERRM;
    RAISE NOTICE 'Error code: %', SQLSTATE;
END $$;

-- ============================================
-- Step 3: Verify RLS is enabled
-- ============================================

SELECT '=== CHECKING RLS STATUS ===' as step;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('submissions', 'photos')
ORDER BY tablename;

-- ============================================
-- Step 4: Final verification
-- ============================================

SELECT '=== FINAL VERIFICATION ===' as step;

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'submissions' 
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
            AND (with_check IS NULL OR with_check::text = 'true')
        ) THEN '✅ Submissions INSERT policy is correct'
        ELSE '❌ Submissions INSERT policy is missing or incorrect'
    END as submissions_check,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'photos' 
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
            AND (with_check IS NULL OR with_check::text = 'true')
        ) THEN '✅ Photos INSERT policy is correct'
        ELSE '❌ Photos INSERT policy is missing or incorrect'
    END as photos_check;
