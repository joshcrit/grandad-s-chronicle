-- FINAL FIX for Submissions INSERT Issue
-- Run this ENTIRE script in Supabase SQL Editor
-- This will fix the "add memories" feature

-- ============================================
-- PART 1: Remove ALL existing INSERT policies
-- ============================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Remove all submissions INSERT policies
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'submissions' 
        AND schemaname = 'public'
        AND cmd = 'INSERT'
    ) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.submissions', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
    
    -- Remove all photos INSERT policies
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'photos' 
        AND schemaname = 'public'
        AND cmd = 'INSERT'
    ) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.photos', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- ============================================
-- PART 2: Create INSERT policies for submissions
-- ============================================

CREATE POLICY "submissions_insert_public"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- PART 3: Create INSERT policies for photos
-- ============================================

CREATE POLICY "photos_insert_public"
ON public.photos
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- PART 4: Verify the fix
-- ============================================

SELECT '=== VERIFICATION: SUBMISSIONS ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    CASE 
        WHEN with_check::text = 'true' THEN '✅ Allows all inserts'
        ELSE '⚠️ WITH CHECK: ' || with_check::text
    END as status
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';

SELECT '=== VERIFICATION: PHOTOS ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    CASE 
        WHEN with_check::text = 'true' THEN '✅ Allows all inserts'
        ELSE '⚠️ WITH CHECK: ' || with_check::text
    END as status
FROM pg_policies 
WHERE tablename = 'photos' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- ============================================
-- PART 5: Final check
-- ============================================

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'submissions' 
            AND schemaname = 'public'
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
            AND schemaname = 'public'
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
            AND (with_check IS NULL OR with_check::text = 'true')
        ) THEN '✅ Photos INSERT policy is correct'
        ELSE '❌ Photos INSERT policy is missing or incorrect'
    END as photos_check;
