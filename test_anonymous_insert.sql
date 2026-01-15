-- Test Anonymous Insert Access
-- Run this to verify anonymous users can insert

-- Test 1: Try to insert a test submission (will be deleted)
BEGIN;

-- This should work if RLS is configured correctly
INSERT INTO public.submissions (title, body, consent_given)
VALUES ('Test Submission', 'This is a test', true)
RETURNING id, title, created_at;

-- If the above works, delete the test submission
DELETE FROM public.submissions WHERE title = 'Test Submission';

ROLLBACK;

-- Test 2: Check if we can insert into photos table
-- (This will fail if no submission exists, but should show the right error)
SELECT 
    'Can insert into submissions' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'submissions' 
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
        ) THEN 'PASS: INSERT policy exists for public'
        ELSE 'FAIL: No INSERT policy for public'
    END as result;

SELECT 
    'Can insert into photos' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'photos' 
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
        ) THEN 'PASS: INSERT policy exists for public'
        ELSE 'FAIL: No INSERT policy for public'
    END as result;

-- Test 3: Check environment - verify you're using anon key
SELECT 
    'API Key Check' as note,
    'Make sure VITE_SUPABASE_PUBLISHABLE_KEY is set to the anon public key (starts with eyJ)' as instruction,
    'NOT the service_role key!' as warning;
