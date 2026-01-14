# How to Find Your Data in Supabase

## Tables (in Table Editor)

You should see these tables:
- ✅ `photos` - Photo metadata (paths, captions, links to submissions)
- ✅ `site_settings` - Site configuration
- ✅ `submissions` - Memory submissions (title, body, contributor info)
- ✅ `user_roles` - Admin user roles

## Storage Buckets (in Storage section)

The actual photo **files** are stored here:
- 📁 `memory-photos` - Storage bucket containing the actual image files

## Step-by-Step: Finding Your Data

### 1. View Submissions (Memory Text)

1. Go to **Table Editor** (left sidebar)
2. Click on **`submissions`** table
3. You'll see columns like:
   - `id` - Unique ID
   - `title` - Memory title
   - `body` - Memory content
   - `contributor_name` - Who submitted it
   - `status` - `pending`, `approved`, or `rejected`
   - `created_at` - When it was submitted

**To see new submissions:**
- Filter by `status = 'pending'`
- Or sort by `created_at` descending

### 2. View Photo Metadata

1. Go to **Table Editor**
2. Click on **`photos`** table
3. You'll see:
   - `id` - Photo ID
   - `submission_id` - Links to the submission
   - `storage_path` - Path to the file (e.g., `uuid/uuid.jpg`)
   - `caption` - Photo caption
   - `order_index` - Order of photos

### 3. View Actual Photo Files

1. Go to **Storage** (left sidebar, different from Table Editor!)
2. Click on **`memory-photos`** bucket
3. You'll see folders (one per submission)
4. Click into a folder to see the actual image files
5. Click on an image to view/download it

## Quick SQL Query to See Everything

Run this in **SQL Editor** to see submissions with their photos:

```sql
-- See submissions with photo count
SELECT 
    s.id,
    s.title,
    s.contributor_name,
    s.status,
    s.created_at,
    COUNT(p.id) as photo_count
FROM public.submissions s
LEFT JOIN public.photos p ON s.id = p.submission_id
GROUP BY s.id
ORDER BY s.created_at DESC;
```

Or see the full details:

```sql
-- See everything together
SELECT 
    s.title,
    s.body,
    s.contributor_name,
    s.status,
    s.created_at,
    p.storage_path,
    p.caption
FROM public.submissions s
LEFT JOIN public.photos p ON s.id = p.submission_id
ORDER BY s.created_at DESC, p.order_index;
```

## If You Don't See `memory-photos` Bucket

If the `memory-photos` bucket doesn't exist in Storage:

1. Go to **Storage** → **Buckets**
2. Check if `memory-photos` exists
3. If not, run this in **SQL Editor**:

```sql
-- Create the storage bucket if it's missing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'memory-photos',
    'memory-photos',
    true,
    20971520, -- 20MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;
```

Then refresh the Storage page.
