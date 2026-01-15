-- Simple view of the submissions INSERT policy
-- Run this and share ALL the output

SELECT 
    policyname,
    roles::text as roles,
    with_check::text as with_check
FROM pg_policies 
WHERE tablename = 'submissions' 
AND schemaname = 'public'
AND cmd = 'INSERT';
