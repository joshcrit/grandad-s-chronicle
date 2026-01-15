-- ⚠️ WARNING: This disables Row Level Security
-- ⚠️ This is NOT recommended for production!
-- ⚠️ Your database will be vulnerable to unauthorized access
-- 
-- BETTER SOLUTION: Run fix_rls_force.sql instead
-- It will fix your policies while keeping security enabled

-- Disable RLS on submissions table
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on photos table
ALTER TABLE public.photos DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '⚠️ RLS is still enabled'
        ELSE '❌ RLS is DISABLED (security risk!)'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('submissions', 'photos');

-- ============================================
-- TO RE-ENABLE RLS LATER (when you're ready):
-- ============================================
-- ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
-- Then create proper policies using fix_rls_force.sql
