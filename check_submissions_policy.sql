-- Quick check: What policies exist for submissions?
-- Run this to see what's actually there

SELECT '=== ALL SUBMISSIONS POLICIES ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    qual::text as using_clause,
    with_check::text as with_check_clause
FROM pg_policies 
WHERE tablename = 'submissions' AND schemaname = 'public'
ORDER BY cmd, policyname;

-- Check specifically for INSERT policies
SELECT '=== INSERT POLICIES FOR SUBMISSIONS ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    with_check::text as with_check_clause
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- Count how many INSERT policies exist
SELECT 
    COUNT(*) as insert_policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ NO INSERT POLICY EXISTS!'
        WHEN COUNT(*) > 1 THEN '⚠️ MULTIPLE INSERT POLICIES (may cause conflicts)'
        ELSE '✅ One INSERT policy exists'
    END as status
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';
