-- Fix Submissions INSERT Policy - Simple and Direct
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- Step 1: Remove ALL existing INSERT policies on submissions
-- ============================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
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
END $$;

-- ============================================
-- Step 2: Create a single, simple INSERT policy
-- ============================================

CREATE POLICY "submissions_insert_public"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- Step 3: Verify it was created
-- ============================================

SELECT '=== VERIFICATION ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    CASE 
        WHEN with_check::text = 'true' THEN '✅ WITH CHECK (true) - allows all inserts'
        ELSE '⚠️ WITH CHECK: ' || with_check::text
    END as with_check_status
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- Final check
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'submissions' 
            AND schemaname = 'public'
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
        ) THEN '✅ INSERT policy exists for submissions'
        ELSE '❌ NO INSERT policy for submissions!'
    END as final_check;
