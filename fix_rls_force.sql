-- FORCE FIX for RLS - This will definitely work
-- Run this ENTIRE script in Supabase SQL Editor
-- This removes ALL policies and creates fresh ones

-- ============================================
-- PART 1: Disable RLS temporarily (to clean up)
-- ============================================

ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: Drop ALL existing policies
-- ============================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all submissions policies
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'submissions' 
        AND schemaname = 'public'
    ) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.submissions', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
    
    -- Drop all photos policies
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'photos' 
        AND schemaname = 'public'
    ) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.photos', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- ============================================
-- PART 3: Re-enable RLS
-- ============================================

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 4: Create INSERT policies (MOST IMPORTANT)
-- ============================================

-- Submissions INSERT - Allow public (anonymous + authenticated)
CREATE POLICY "submissions_insert_public"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Photos INSERT - Allow public
CREATE POLICY "photos_insert_public"
ON public.photos
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- PART 5: Create SELECT policies
-- ============================================

-- Submissions SELECT - Show approved ones or if admin
CREATE POLICY "submissions_select_public"
ON public.submissions
FOR SELECT
TO public
USING (
    status = 'approved' OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
);

-- Photos SELECT - Show if submission is approved
CREATE POLICY "photos_select_public"
ON public.photos
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.submissions s
        WHERE s.id = photos.submission_id
        AND (
            s.status = 'approved' OR
            public.has_role(auth.uid(), 'admin') OR 
            public.has_role(auth.uid(), 'moderator')
        )
    )
);

-- ============================================
-- PART 6: Create UPDATE/DELETE policies (for admins)
-- ============================================

-- Submissions UPDATE - Only admins
CREATE POLICY "submissions_update_admin"
ON public.submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Submissions DELETE - Only admins
CREATE POLICY "submissions_delete_admin"
ON public.submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Photos UPDATE - Only admins
CREATE POLICY "photos_update_admin"
ON public.photos
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Photos DELETE - Only admins
CREATE POLICY "photos_delete_admin"
ON public.photos
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PART 7: Verify everything
-- ============================================

SELECT '=== VERIFICATION: SUBMISSIONS ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    CASE 
        WHEN cmd = 'INSERT' AND roles::text LIKE '%public%' AND with_check::text = 'true' THEN '✅ Correct'
        ELSE '⚠️ Check this'
    END as status
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
ORDER BY cmd, policyname;

SELECT '=== VERIFICATION: PHOTOS ===' as info;

SELECT 
    policyname,
    cmd,
    roles::text as roles,
    CASE 
        WHEN cmd = 'INSERT' AND roles::text LIKE '%public%' AND with_check::text = 'true' THEN '✅ Correct'
        ELSE '⚠️ Check this'
    END as status
FROM pg_policies 
WHERE tablename = 'photos' 
AND schemaname = 'public'
ORDER BY cmd, policyname;

SELECT '=== RLS STATUS ===' as info;

SELECT 
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS enabled'
        ELSE '❌ RLS disabled'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('submissions', 'photos')
ORDER BY tablename;

-- ============================================
-- PART 8: Final check
-- ============================================

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'submissions' 
            AND schemaname = 'public'
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
            AND with_check::text = 'true'
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
            AND with_check::text = 'true'
        ) THEN '✅ Photos INSERT policy is correct'
        ELSE '❌ Photos INSERT policy is missing or incorrect'
    END as photos_check;
