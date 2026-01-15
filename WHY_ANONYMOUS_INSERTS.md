# Why Anonymous Inserts Are Necessary

## The Problem

Your "Add Memories" feature allows **anyone** (including people who aren't logged in) to submit memories. This is by design - you want visitors to be able to share memories without creating an account.

However, Supabase has **Row Level Security (RLS)** enabled by default. When RLS is on, the database blocks **all operations** unless there's an explicit policy allowing it.

## What Happens Without Anonymous Insert Policy

```
User fills out form → Clicks Submit → Frontend sends INSERT request → 
Supabase checks: "Is this user allowed to insert?" → 
No policy found → ❌ BLOCKED → Error: "new row violates row-level security policy"
```

## What Happens With Anonymous Insert Policy

```
User fills out form → Clicks Submit → Frontend sends INSERT request → 
Supabase checks: "Is this user allowed to insert?" → 
Policy says: "Yes, public role can insert" → ✅ ALLOWED → Data saved
```

## Understanding Roles in Supabase

Supabase has different user roles:

1. **`anon`** - Anonymous users (not logged in)
2. **`authenticated`** - Logged-in users
3. **`public`** - Both anonymous AND authenticated users (everyone)
4. **`service_role`** - Backend/admin operations (bypasses RLS - don't use in frontend!)

## Why Use `public` Role?

When you create a policy with `TO public`, it allows:
- ✅ Anonymous visitors (not logged in)
- ✅ Authenticated users (logged in)

This is perfect for your use case because you want **anyone** to be able to submit memories.

## The Policy You Need

```sql
CREATE POLICY "submissions_insert_public"
ON public.submissions
FOR INSERT
TO public              -- Allows both anonymous and authenticated users
WITH CHECK (true);     -- No restrictions - anyone can insert
```

This policy says: "Anyone (logged in or not) can insert rows into the submissions table, with no restrictions."

## Alternative: Require Login

If you wanted to require users to log in first, you'd use:

```sql
CREATE POLICY "submissions_insert_authenticated"
ON public.submissions
FOR INSERT
TO authenticated       -- Only logged-in users
WITH CHECK (true);
```

But this would break your feature because visitors aren't logged in!

## Why RLS Exists

RLS is a security feature that:
- ✅ Prevents unauthorized access to data
- ✅ Allows fine-grained control over who can do what
- ✅ Protects your database from malicious requests
- ✅ Works even if someone bypasses your frontend code

## The Trade-off

**Without RLS:**
- ❌ Anyone with your API key could insert/delete/update anything
- ❌ No protection if frontend code has bugs
- ❌ Harder to control access later

**With RLS (and proper policies):**
- ✅ Only allowed operations work
- ✅ Database-level security (can't be bypassed)
- ✅ Easy to change permissions later
- ✅ But requires policies for everything

## Your Specific Case

Your feature needs anonymous inserts because:
1. Users don't need to create accounts
2. You want to make it easy to share memories
3. The form is public-facing
4. You'll moderate submissions later (via the `status` field)

So the policy `TO public WITH CHECK (true)` is exactly what you need!

## Summary

- **Anonymous inserts** = allowing non-logged-in users to insert data
- **Necessary** because your form is public and users aren't logged in
- **RLS blocks everything by default** - you need policies to allow operations
- **`TO public`** means "everyone" (both logged in and anonymous users)

Without this policy, Supabase will block the insert and show the error you're seeing.
