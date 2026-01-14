# Supabase Setup Guide

Follow these steps to set up a new Supabase project and connect it to this application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Project Name**: grandad-s-chronicle (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier is fine for development
5. Click "Create new project" and wait for it to finish setting up (2-3 minutes)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Settings** → **API**
2. You'll see:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public** key: Copy this (long JWT token)

## Step 3: Run the Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/20260114120005_d4a75c60-17da-4315-9d86-43a38c07f635.sql`
4. Paste it into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This will create:
- All database tables (submissions, photos, site_settings, user_roles)
- Row Level Security policies
- Storage bucket for photos
- Default site settings

## Step 4: Update Your .env File

1. Open the `.env` file in the project root
2. Update it with your new credentials:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"
```

Replace:
- `your-project-id` with your actual project ID (from the URL)
- `your-anon-public-key` with your actual anon public key

## Step 5: Create an Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter an email and password for your admin account
4. Click "Create user"
5. Copy the User ID (UUID) of the newly created user
6. Go to **SQL Editor** and run:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

Replace `YOUR_USER_ID_HERE` with the UUID you copied.

## Step 6: Restart Your Dev Server

1. Stop your current dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. Your app should now be connected to the new Supabase project!

## Verify Everything Works

1. Visit http://localhost:8080
2. Try submitting a memory (should work)
3. Go to `/admin/login` and log in with your admin credentials
4. You should be able to see the admin dashboard

## Troubleshooting

- **Can't connect**: Make sure you've restarted the dev server after updating .env
- **Migration errors**: Make sure you're running the SQL in the SQL Editor, not the migration tool
- **Admin login fails**: Make sure you've added the user_roles entry for your user
- **Photos not uploading**: Check that the storage bucket was created (Storage → Buckets → should see "memory-photos")
