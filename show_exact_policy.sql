-- Show the EXACT policy configuration
-- This will tell us what's wrong with it

SELECT '=== EXACT SUBMISSIONS INSERT POLICY ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    CASE 
        WHEN roles::text LIKE '%public%' THEN '✅ Uses public role'
        WHEN roles::text LIKE '%anon%' THEN '⚠️ Uses anon role (should use public)'
        ELSE '❌ Wrong roles: ' || roles::text
    END as role_check,
    with_check::text as with_check_clause,
    CASE 
        WHEN with_check::text = 'true' THEN '✅ Allows all inserts'
        WHEN with_check IS NULL THEN '⚠️ No WITH CHECK (may block inserts)'
        ELSE '❌ Has restrictions: ' || with_check::text
    END as with_check_status
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- Also check if RLS is enabled
SELECT '=== RLS STATUS ===' as info;

SELECT 
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS is enabled'
        ELSE '❌ RLS is DISABLED (this is the problem!)'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'submissions';
