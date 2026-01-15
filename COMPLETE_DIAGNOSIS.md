# Complete Diagnosis Guide for "Add Memories" Feature

Since your RLS policies are now correct, let's check other potential issues.

## Step 1: Check Storage Policies

Run `check_storage_policies.sql` in Supabase SQL Editor to verify:
- Storage bucket exists
- Storage INSERT policy exists (for uploading photos)
- Storage SELECT policy exists (for viewing photos)

**If storage policies are missing**, run `fix_storage_policies.sql`

## Step 2: Check Browser Console

1. Open your app in the browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try submitting a memory
5. **Look for the exact error message**

The error will tell us what's wrong:
- **"new row violates row-level security policy"** → RLS issue (but we fixed this)
- **"Bucket not found"** → Storage bucket doesn't exist
- **"new row violates row-level security policy" for storage.objects** → Storage policies missing
- **"401 Unauthorized"** → API key issue
- **"Missing Supabase environment variables"** → .env file issue

## Step 3: Test the Submission Flow

Try submitting a memory **without photos first**:
1. Fill out the form
2. Leave photos empty
3. Submit
4. Check if it works

If it works without photos but fails with photos → Storage policy issue

## Step 4: Verify Environment Variables

In browser console, run:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
console.log('Key length:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.length);
console.log('Key starts with eyJ:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith('eyJ'));
```

**Expected:**
- URL should be set
- Key should exist and be 200+ characters
- Key should start with `eyJ` (JWT) or `sb_publishable_` (new format)

## Step 5: Restart Dev Server

After any changes:
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

## Common Issues After RLS Fix

### Issue: "Bucket not found" or storage errors
**Solution:** Run `fix_storage_policies.sql`

### Issue: Still getting 401 errors
**Solution:** 
1. Check API key is the anon public key (not service_role)
2. Restart dev server
3. Hard refresh browser

### Issue: Form submits but nothing happens
**Solution:**
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify you're redirected to /thank-you page

### Issue: Photos upload but submission fails
**Solution:** This means storage works but submissions table insert fails
- Check if RLS policies are actually applied (run `show_exact_policy.sql` again)
- Check for any triggers or constraints on submissions table

## Quick Test Script

Run this in Supabase SQL Editor to test everything:

```sql
-- Test if we can insert a submission
INSERT INTO public.submissions (title, body, consent_given)
VALUES ('TEST - DELETE ME', 'Test submission', true)
RETURNING id;

-- If that works, delete it
DELETE FROM public.submissions WHERE title = 'TEST - DELETE ME';
```

If this fails, there's still an RLS issue. If it works, the issue is in the frontend code or environment variables.
