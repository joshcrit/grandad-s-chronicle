# Fixing 401 Unauthorized Error

A 401 error means Supabase is rejecting your request due to authentication issues.

## Most Common Causes:

### 1. Wrong API Key (Most Likely!)

**Problem:** You're using the `service_role` key instead of the `anon public` key.

**How to check:**
1. Open your `.env` file
2. Look at `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Go to Supabase Dashboard → Settings → API
4. Compare your key with the "anon public" key shown there

**Fix:**
- Make sure you're using the **"anon public"** key (starts with `eyJ`)
- **NEVER** use the "service_role" key in frontend code (it bypasses RLS!)

### 2. API Key Not Set

**Check:**
1. Open browser console
2. Look for error: "Missing Supabase environment variables"
3. Check if the key is actually loaded

**Fix:**
1. Make sure `.env` file exists in project root
2. Make sure it has:
   ```
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key-here"
   ```
3. **Restart your dev server** after changing `.env`

### 3. RLS Policies Still Not Working

Even with the right key, if RLS policies aren't set correctly, you'll get 401.

**Fix:**
1. Run `fix_submissions_rls_final.sql` in Supabase SQL Editor
2. Verify policies exist:
   ```sql
   SELECT policyname, cmd, roles
   FROM pg_policies 
   WHERE tablename = 'submissions' AND cmd = 'INSERT';
   ```
3. Should see policies with `anon` in the roles column

## Step-by-Step Fix:

1. **Verify API Key:**
   - Open Supabase Dashboard → Settings → API
   - Copy the "anon public" key
   - Update your `.env` file with this exact key
   - Restart dev server

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look at the error details
   - Check the "Full error details" log I added
   - Look for the status code and error message

3. **Verify RLS Policies:**
   - Run `debug_submissions_policy.sql` in Supabase SQL Editor
   - Make sure INSERT policies exist for `anon` role
   - If missing, run `fix_submissions_rls_final.sql`

4. **Test Again:**
   - Try submitting the form
   - Check console for detailed error messages
   - Share the error details if it still fails

## Quick Test:

In your browser console, run:
```javascript
// Check if Supabase client is configured
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key length:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.length);
console.log('Key starts with eyJ?', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith('eyJ'));
```

The key should:
- Start with `eyJ` (it's a JWT)
- Be about 200+ characters long
- Match the "anon public" key from Supabase dashboard
