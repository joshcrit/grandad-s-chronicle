-- Fix RLS Policies for submissions table
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit memories" ON public.submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.submissions;

-- Recreate INSERT policy - allow anyone to insert (public form)
CREATE POLICY "Anyone can submit memories"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Recreate SELECT policy - admins/moderators can see all, public can see approved
CREATE POLICY "Admins can view all submissions"
ON public.submissions
FOR SELECT
TO public
USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'moderator') OR
    status = 'approved'
);

-- Recreate UPDATE policy - only admins/moderators
CREATE POLICY "Admins can update submissions"
ON public.submissions
FOR UPDATE
TO public
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Recreate DELETE policy - only admins
CREATE POLICY "Admins can delete submissions"
ON public.submissions
FOR DELETE
TO public
USING (public.has_role(auth.uid(), 'admin'));

-- Also fix photos policies
DROP POLICY IF EXISTS "Anyone can upload photos" ON public.photos;
DROP POLICY IF EXISTS "Photos visible with submissions" ON public.photos;
DROP POLICY IF EXISTS "Admins can update photos" ON public.photos;
DROP POLICY IF EXISTS "Admins can delete photos" ON public.photos;

-- Recreate photos INSERT policy
CREATE POLICY "Anyone can upload photos"
ON public.photos
FOR INSERT
TO public
WITH CHECK (true);

-- Recreate photos SELECT policy
CREATE POLICY "Photos visible with submissions"
ON public.photos
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.submissions s
        WHERE s.id = photos.submission_id
        AND (
            public.has_role(auth.uid(), 'admin') OR 
            public.has_role(auth.uid(), 'moderator') OR
            s.status = 'approved'
        )
    )
);

-- Recreate photos UPDATE policy
CREATE POLICY "Admins can update photos"
ON public.photos
FOR UPDATE
TO public
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Recreate photos DELETE policy
CREATE POLICY "Admins can delete photos"
ON public.photos
FOR DELETE
TO public
USING (public.has_role(auth.uid(), 'admin'));
