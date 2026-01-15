-- Quick Fix for RLS Policy Errors
-- Run this in Supabase SQL Editor to fix submission errors

-- ============================================
-- Fix Submissions INSERT Policy
-- ============================================

-- Drop all existing INSERT policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can submit memories" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_anon" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_all" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_public" ON public.submissions;

-- Create a single, simple INSERT policy that allows everyone
CREATE POLICY "submissions_insert_public"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- Fix Photos INSERT Policy
-- ============================================

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Anyone can upload photos" ON public.photos;
DROP POLICY IF EXISTS "photos_insert_anon" ON public.photos;
DROP POLICY IF EXISTS "photos_insert_authenticated" ON public.photos;

-- Create a single, simple INSERT policy that allows everyone
CREATE POLICY "photos_insert_public"
ON public.photos
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- Verify Policies
-- ============================================

SELECT 
    '=== SUBMISSIONS POLICIES ===' as check_type;

SELECT 
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies 
WHERE tablename = 'submissions' AND cmd = 'INSERT';

SELECT 
    '=== PHOTOS POLICIES ===' as check_type;

SELECT 
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies 
WHERE tablename = 'photos' AND cmd = 'INSERT';
