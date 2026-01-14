# Where Your Data is Stored in Supabase

## Overview

When someone submits a memory through your form, the data is saved in **two places**:

### 1. Submission Data → `submissions` Table

**Location:** Supabase Dashboard → Table Editor → `submissions` table

**Contains:**
- `id` - Unique identifier (UUID)
- `title` - Memory title
- `body` - Memory text/content
- `contributor_name` - Person's name (optional)
- `contributor_relationship` - Relationship (optional)
- `contributor_email` - Email (optional)
- `consent_given` - Whether consent was given
- `status` - `pending`, `approved`, or `rejected` (defaults to `pending`)
- `created_at` - When it was submitted
- `updated_at` - Last update time
- `tags` - Array of tags (optional)
- `display_order` - Order for display (optional)

**How to view:**
1. Go to Supabase Dashboard
2. Click "Table Editor" in the left sidebar
3. Click on `submissions` table
4. You'll see all submissions with status `pending` (waiting for approval)

### 2. Photos → Storage Bucket + `photos` Table

**Photo Files:** Supabase Dashboard → Storage → `memory-photos` bucket

**Photo Metadata:** Supabase Dashboard → Table Editor → `photos` table

**Contains:**
- `id` - Unique identifier (UUID)
- `submission_id` - Links to the submission (foreign key)
- `storage_path` - Path to the file in storage (e.g., `uuid/uuid.jpg`)
- `caption` - Photo caption (optional)
- `order_index` - Order of photos (0, 1, 2, etc.)
- `created_at` - When photo was uploaded

**How to view photos:**
1. **View photo files:**
   - Go to Supabase Dashboard
   - Click "Storage" in the left sidebar
   - Click on `memory-photos` bucket
   - You'll see folders (one per submission) with photos inside

2. **View photo metadata:**
   - Go to "Table Editor"
   - Click on `photos` table
   - You'll see all photo records with their paths and captions

## How It Works

1. **Form Submission:**
   - User fills out the form and clicks "Share This Memory"
   - Submission data is inserted into `submissions` table with `status = 'pending'`

2. **Photo Upload:**
   - Each photo file is uploaded to Storage bucket `memory-photos`
   - Photo metadata (path, caption, etc.) is inserted into `photos` table
   - Photos are linked to the submission via `submission_id`

3. **Admin Approval:**
   - Admin logs in at `/admin/login`
   - Views pending submissions in the admin panel
   - Can approve/reject submissions
   - When approved, `status` changes to `approved`
   - Approved submissions appear in the Gallery (`/gallery`)

## Viewing Your Data

### Quick Check:
Run this SQL in Supabase SQL Editor:

```sql
-- See all submissions
SELECT 
    id,
    title,
    contributor_name,
    status,
    created_at
FROM public.submissions
ORDER BY created_at DESC;

-- See all photos with their submission info
SELECT 
    p.id,
    p.storage_path,
    p.caption,
    s.title as submission_title,
    s.status
FROM public.photos p
JOIN public.submissions s ON p.submission_id = s.id
ORDER BY p.created_at DESC;
```

### In Supabase Dashboard:

1. **Submissions:**
   - Table Editor → `submissions`
   - Filter by `status = 'pending'` to see new submissions

2. **Photos:**
   - Storage → `memory-photos` → Browse folders
   - Table Editor → `photos` → See metadata

3. **Approved Memories:**
   - Table Editor → `submissions` → Filter `status = 'approved'`
   - These appear in your Gallery page

## Next Steps

1. **Approve Submissions:**
   - Go to `/admin/login` in your app
   - Log in with your admin credentials
   - Review and approve pending submissions

2. **View in Gallery:**
   - Once approved, submissions appear at `/gallery`
   - Photos are displayed with their captions
