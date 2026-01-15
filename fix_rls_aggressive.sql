-- Aggressive RLS Fix - Removes ALL policies and recreates simple ones
-- Run this in Supabase SQL Editor

-- ============================================
-- Step 1: Drop ALL existing policies on submissions
-- ============================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'submissions') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.submissions';
    END LOOP;
END $$;

-- ============================================
-- Step 2: Create simple INSERT policy for submissions
-- ============================================

CREATE POLICY "submissions_insert_public"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- Step 3: Create SELECT policy for submissions
-- ============================================

CREATE POLICY "submissions_select_public"
ON public.submissions
FOR SELECT
TO public
USING (
    status = 'approved' OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
);

-- ============================================
-- Step 4: Drop ALL existing policies on photos
-- ============================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'photos') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.photos';
    END LOOP;
END $$;

-- ============================================
-- Step 5: Create simple INSERT policy for photos
-- ============================================

CREATE POLICY "photos_insert_public"
ON public.photos
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- Step 6: Create SELECT policy for photos
-- ============================================

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
-- Step 7: Verify policies
-- ============================================

SELECT '=== SUBMISSIONS POLICIES ===' as info;

SELECT 
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies 
WHERE tablename = 'submissions'
ORDER BY cmd, policyname;

SELECT '=== PHOTOS POLICIES ===' as info;

SELECT 
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies 
WHERE tablename = 'photos'
ORDER BY cmd, policyname;

-- ============================================
-- Step 8: Test insert (optional - will create a test row)
-- ============================================

-- Uncomment the lines below to test if insert works
-- INSERT INTO public.submissions (title, body, consent_given)
-- VALUES ('Test', 'Test submission', true)
-- RETURNING id;
-- 
-- DELETE FROM public.submissions WHERE title = 'Test';
