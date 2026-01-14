# Supabase Backend Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Cannot insert into submissions" or RLS Policy Errors

**Symptoms:**
- Form submissions fail with permission errors
- Console shows: "new row violates row-level security policy"
- Error code: `42501` or `PGRST301`

**Solution:**
1. Go to your Supabase Dashboard → SQL Editor
2. Run the `fix_supabase_backend.sql` script
3. This will fix all RLS policies to allow anonymous inserts

**Quick Fix:**
```sql
-- Allow anonymous users to insert submissions
CREATE POLICY "submissions_insert_anon"
ON public.submissions
FOR INSERT
TO anon
WITH CHECK (true);
```

### Issue 2: Photos Not Uploading

**Symptoms:**
- Form submits but photos don't appear
- Storage upload errors in console
- Error: "new row violates row-level security policy" for storage.objects

**Solution:**
1. Check if the storage bucket exists:
   - Go to Storage → Buckets
   - Should see "memory-photos" bucket
   
2. If missing, run this in SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'memory-photos',
    'memory-photos',
    true,
    20971520,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
);
```

3. Fix storage policies (included in `fix_supabase_backend.sql`)

### Issue 3: Environment Variables Not Loading

**Symptoms:**
- Console shows: "Missing Supabase environment variables"
- Connection errors
- App can't connect to Supabase

**Solution:**
1. Check your `.env` file has these variables:
   ```
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   ```

2. **Important:** Restart your dev server after changing `.env`:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. Verify variables are loaded:
   - Open browser console
   - Check for the error message about missing variables
   - If you see it, the variables aren't loading

### Issue 4: Can't See Submissions in Gallery

**Symptoms:**
- Gallery page is empty
- Submissions exist but don't show

**Solution:**
1. Check if submissions have `status = 'approved'`
2. Only approved submissions are visible to public
3. Admins can see all submissions in the admin panel

### Issue 5: Admin Login Not Working

**Symptoms:**
- Can't log in to admin panel
- Redirected back to login page

**Solution:**
1. Make sure you've created an admin user:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_ID', 'admin');
   ```

2. Get your user ID:
   - Go to Authentication → Users
   - Find your user and copy the UUID

## Step-by-Step Fix Process

### Complete Reset (if nothing works)

1. **Run the comprehensive fix script:**
   - Open Supabase Dashboard → SQL Editor
   - Copy entire contents of `fix_supabase_backend.sql`
   - Run it
   - Check for any errors

2. **Verify environment variables:**
   ```bash
   # Check .env file exists and has correct values
   cat .env
   
   # Restart dev server
   npm run dev
   ```

3. **Test the connection:**
   - Open browser console
   - Try submitting a form
   - Check for any error messages

4. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for any errors related to your requests

## Diagnostic Queries

Run these in Supabase SQL Editor to check your setup:

### Check RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('submissions', 'photos');
```

### Check policies exist:
```sql
SELECT tablename, policyname, cmd, roles
FROM pg_policies 
WHERE tablename IN ('submissions', 'photos')
ORDER BY tablename, cmd;
```

### Check storage bucket:
```sql
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'memory-photos';
```

### Check storage policies:
```sql
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%memory-photos%';
```

## Still Not Working?

1. **Check browser console** for specific error messages
2. **Check Supabase logs** in the dashboard
3. **Verify your Supabase project is active** (not paused)
4. **Check network tab** to see the actual API requests/responses
5. **Try a simple test query** in SQL Editor:
   ```sql
   SELECT * FROM public.submissions LIMIT 1;
   ```
