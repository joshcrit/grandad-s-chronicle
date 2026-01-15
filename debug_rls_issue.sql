-- Debug RLS Issue - Check why policies aren't working
-- Run this to see the exact policy configuration

-- ============================================
-- PART 1: Check ALL policies on submissions table
-- ============================================

SELECT '=== ALL POLICIES ON SUBMISSIONS TABLE ===' as info;

SELECT 
    policyname,
    permissive,
    roles::text as roles,
    cmd,
    qual::text as using_clause,
    with_check::text as with_check_clause
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
ORDER BY cmd, policyname;

-- ============================================
-- PART 2: Check if RLS is enabled
-- ============================================

SELECT '=== RLS STATUS ===' as info;

SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'submissions';

-- ============================================
-- PART 3: Check INSERT policies specifically
-- ============================================

SELECT '=== INSERT POLICIES DETAIL ===' as info;

SELECT 
    policyname,
    permissive,
    roles::text as roles,
    with_check::text as with_check_clause,
    CASE 
        WHEN roles::text LIKE '%public%' THEN '✅ Uses public role'
        WHEN roles::text LIKE '%anon%' THEN '⚠️ Uses anon role'
        ELSE '❌ Unknown role: ' || roles::text
    END as role_status,
    CASE 
        WHEN with_check::text = 'true' THEN '✅ Allows all inserts'
        WHEN with_check IS NULL THEN '❌ NO WITH CHECK (this blocks inserts!)'
        ELSE '⚠️ Has condition: ' || with_check::text
    END as with_check_status
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- ============================================
-- PART 4: Test if we can insert (as current user)
-- ============================================

SELECT '=== TESTING INSERT ===' as info;

-- This will show if the policy works for the current database user
-- Note: This runs as the database user, not as an anonymous Supabase user
DO $$
DECLARE
    test_id UUID;
BEGIN
    BEGIN
        INSERT INTO public.submissions (title, body, consent_given)
        VALUES ('RLS_TEST_DELETE_ME', 'Test insert', true)
        RETURNING id INTO test_id;
        
        RAISE NOTICE '✅ Insert succeeded! ID: %', test_id;
        
        -- Clean up
        DELETE FROM public.submissions WHERE id = test_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Insert failed: %', SQLERRM;
        RAISE NOTICE 'Error code: %', SQLSTATE;
    END;
END $$;

-- ============================================
-- PART 5: Check for conflicting policies
-- ============================================

SELECT '=== CHECKING FOR CONFLICTS ===' as info;

SELECT 
    COUNT(*) as insert_policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ NO INSERT POLICIES!'
        WHEN COUNT(*) = 1 THEN '✅ One INSERT policy (good)'
        ELSE '⚠️ MULTIPLE INSERT POLICIES (may conflict)'
    END as status
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';

-- ============================================
-- PART 6: Check policy permissions
-- ============================================

SELECT '=== POLICY PERMISSIONS ===' as info;

SELECT 
    policyname,
    permissive,
    CASE 
        WHEN permissive = 'PERMISSIVE' THEN '✅ Permissive (allows if any policy allows)'
        WHEN permissive = 'RESTRICTIVE' THEN '⚠️ Restrictive (blocks if any policy blocks)'
        ELSE 'Unknown: ' || permissive
    END as permission_type
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';
