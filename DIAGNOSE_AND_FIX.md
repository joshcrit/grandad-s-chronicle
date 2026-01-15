# Diagnose and Fix "Add Memories" Feature

## Quick Diagnosis Steps

### Step 1: Check Browser Console
1. Open your app in the browser
2. Open Developer Tools (F12 or Cmd+Option+I)
3. Go to the Console tab
4. Try submitting a memory
5. Look for error messages - they will tell you exactly what's wrong

### Step 2: Check Environment Variables
Open your browser console and run:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
console.log('Key length:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.length);
console.log('Key starts with eyJ:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith('eyJ'));
```

**Expected results:**
- URL should be something like `https://xxxxx.supabase.co`
- Key should exist and be 200+ characters long
- Key should start with `eyJ` (JWT format) or `sb_publishable_` (new format)

**If key is missing or wrong:**
1. Check your `.env` file in the project root
2. Make sure it has:
   ```
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key-here"
   ```
3. **RESTART your dev server** after changing `.env`

### Step 3: Check RLS Policies in Supabase
1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the left sidebar
3. Run the `show_exact_policy.sql` script
4. This will show you if INSERT policies exist

**What to look for:**
- Should see at least one INSERT policy for `submissions` table
- The policy should have `public` in the roles column
- The `with_check` should be `true` or allow all inserts

## The Fix

### Option 1: Quick Fix (Recommended)
Run this in Supabase SQL Editor:

```sql
-- Drop existing INSERT policies
DROP POLICY IF EXISTS "submissions_insert_public" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_anon" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can submit memories" ON public.submissions;

-- Create new INSERT policy
CREATE POLICY "submissions_insert_public"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Same for photos
DROP POLICY IF EXISTS "photos_insert_public" ON public.photos;
DROP POLICY IF EXISTS "photos_insert_anon" ON public.photos;

CREATE POLICY "photos_insert_public"
ON public.photos
FOR INSERT
TO public
WITH CHECK (true);
```

### Option 2: Complete Fix
Run the `fix_rls_complete.sql` script in Supabase SQL Editor. This will:
- Remove all existing policies
- Create correct INSERT policies
- Create SELECT policies (for viewing approved memories)
- Create UPDATE/DELETE policies (for admins only)

## Common Error Messages and Solutions

### Error: "new row violates row-level security policy"
**Solution:** RLS policies are not configured. Run Option 1 or Option 2 above.

### Error: "401 Unauthorized" or "PGRST301"
**Solution:** 
1. Check you're using the **anon public** key (not service_role)
2. Get it from: Supabase Dashboard → Settings → API → anon public
3. Update `.env` file
4. Restart dev server

### Error: "Missing Supabase environment variables"
**Solution:**
1. Check `.env` file exists in project root
2. Make sure variables are named correctly (VITE_ prefix required)
3. Restart dev server

### Error: "relation does not exist"
**Solution:** Tables haven't been created. Run the migration in `supabase/migrations/`

## Testing After Fix

1. **Restart your dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Hard refresh browser:**
   - Mac: Cmd+Shift+R
   - Windows/Linux: Ctrl+Shift+R

3. **Try submitting a memory:**
   - Fill out the form
   - Submit
   - Check browser console for any errors
   - Should redirect to /thank-you page

4. **Verify in Supabase:**
   - Go to Table Editor → `submissions` table
   - You should see your test submission with status `pending`

## Still Not Working?

If it's still not working after following these steps:

1. **Check the exact error message** in browser console
2. **Run the diagnostic SQL** (`show_exact_policy.sql`) to see current policy state
3. **Verify your API key** matches the anon public key from Supabase dashboard
4. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs → API Logs
   - Look for recent errors when you try to submit
