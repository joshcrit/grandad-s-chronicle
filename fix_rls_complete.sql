-- Complete RLS Fix - This will fix the submission errors
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- PART 1: Remove ALL existing policies
-- ============================================

-- Remove all submissions policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'submissions' AND schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.submissions', r.policyname);
    END LOOP;
END $$;

-- Remove all photos policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'photos' AND schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.photos', r.policyname);
    END LOOP;
END $$;

-- ============================================
-- PART 2: Create INSERT policies (most important)
-- ============================================

-- Submissions INSERT - Allow anyone to insert
CREATE POLICY "submissions_insert_public"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Photos INSERT - Allow anyone to insert
CREATE POLICY "photos_insert_public"
ON public.photos
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- PART 3: Create SELECT policies
-- ============================================

-- Submissions SELECT - Show approved or admin can see all
CREATE POLICY "submissions_select_public"
ON public.submissions
FOR SELECT
TO public
USING (
    status = 'approved' OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
);

-- Photos SELECT - Show if submission is approved or admin
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
-- PART 4: Create UPDATE/DELETE policies (for admins)
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
-- PART 5: Verify everything
-- ============================================

SELECT '=== VERIFICATION: SUBMISSIONS POLICIES ===' as info;

SELECT 
    policyname,
    cmd,
    roles,
    CASE WHEN with_check IS NULL THEN 'NULL' ELSE 'SET' END as with_check_status
FROM pg_policies 
WHERE tablename = 'submissions' AND schemaname = 'public'
ORDER BY cmd, policyname;

SELECT '=== VERIFICATION: PHOTOS POLICIES ===' as info;

SELECT 
    policyname,
    cmd,
    roles,
    CASE WHEN with_check IS NULL THEN 'NULL' ELSE 'SET' END as with_check_status
FROM pg_policies 
WHERE tablename = 'photos' AND schemaname = 'public'
ORDER BY cmd, policyname;

SELECT '=== TEST: Check if INSERT policy exists ===' as info;

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'submissions' 
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
        ) THEN '✅ INSERT policy exists for submissions'
        ELSE '❌ NO INSERT policy for submissions!'
    END as submissions_insert_check;

SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'photos' 
            AND cmd = 'INSERT' 
            AND roles::text LIKE '%public%'
        ) THEN '✅ INSERT policy exists for photos'
        ELSE '❌ NO INSERT policy for photos!'
    END as photos_insert_check;
