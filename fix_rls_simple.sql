-- Simple fix: Drop all policies and recreate with explicit public access
-- Run this in Supabase SQL Editor

-- First, drop ALL existing policies on submissions
DROP POLICY IF EXISTS "Anyone can submit memories" ON public.submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.submissions;

-- Create a simple INSERT policy that allows anyone (including anonymous users)
CREATE POLICY "submissions_insert_policy"
ON public.submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- SELECT policy - approved submissions are public, admins see all
CREATE POLICY "submissions_select_policy"
ON public.submissions
FOR SELECT
TO anon, authenticated
USING (
    status = 'approved' OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator')
);

-- UPDATE policy - only admins/moderators
CREATE POLICY "submissions_update_policy"
ON public.submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- DELETE policy - only admins
CREATE POLICY "submissions_delete_policy"
ON public.submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix photos policies too
DROP POLICY IF EXISTS "Anyone can upload photos" ON public.photos;
DROP POLICY IF EXISTS "Photos visible with submissions" ON public.photos;
DROP POLICY IF EXISTS "Admins can update photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can delete photos" ON public.photos;

CREATE POLICY "photos_insert_policy"
ON public.photos
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "photos_select_policy"
ON public.photos
FOR SELECT
TO anon, authenticated
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

CREATE POLICY "photos_update_policy"
ON public.photos
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "photos_delete_policy"
ON public.photos
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
