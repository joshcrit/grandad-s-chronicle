-- Diagnose RLS Issue
-- Run this to see what's wrong

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('submissions', 'photos');

-- Check all policies on submissions
SELECT 
    '=== ALL SUBMISSIONS POLICIES ===' as info;

SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'submissions'
ORDER BY cmd, policyname;

-- Check all policies on photos
SELECT 
    '=== ALL PHOTOS POLICIES ===' as info;

SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'photos'
ORDER BY cmd, policyname;

-- Check if has_role function exists
SELECT 
    '=== HAS_ROLE FUNCTION ===' as info;

SELECT 
    proname as function_name,
    prosrc as function_body
FROM pg_proc
WHERE proname = 'has_role';

-- Test: Try to see what role we're using
SELECT 
    '=== CURRENT ROLE ===' as info,
    current_user as current_user,
    session_user as session_user;
