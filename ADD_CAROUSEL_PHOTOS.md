# How to Add Carousel Photos

## The Problem
Your carousel folder is currently **empty**. You need to add your 40 photos to make the carousel work.

## Step-by-Step Instructions

### Option 1: Using Finder (Mac) or File Explorer (Windows)

1. **Navigate to your project folder:**
   ```
   /Users/joshcritchlow/Downloads/grandpas cronicles/grandad-s-chronicle/public/carousel/
   ```

2. **Copy your 40 photos into this folder**

3. **Rename them to match the expected names:**
   - `photo1.jpg` (or `.png`, `.jpeg`, `.webp`)
   - `photo2.jpg`
   - `photo3.jpg`
   - ... up to `photo40.jpg`

### Option 2: Using Terminal

```bash
# Navigate to your project
cd "/Users/joshcritchlow/Downloads/grandpas cronicles/grandad-s-chronicle"

# Copy your photos to the carousel folder
# Replace /path/to/your/photos with your actual photo location
cp /path/to/your/photos/*.jpg public/carousel/

# Rename them (if needed)
cd public/carousel
# If your photos are already numbered, you might need to rename them
```

### Option 3: If Your Photos Have Different Names

If your photos have different names (like `IMG_001.jpg`, `DSC_1234.jpg`, etc.), you have two options:

**Option A:** Rename them to `photo1.jpg`, `photo2.jpg`, etc.

**Option B:** Update the component to use your actual file names. Edit `src/components/HeroCarousel.tsx` and change the `CAROUSEL_PHOTOS` array to match your file names.

## File Location

Your photos MUST be in:
```
public/carousel/photo1.jpg
public/carousel/photo2.jpg
...
public/carousel/photo40.jpg
```

## Supported Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`

## Quick Check

After adding photos, verify they're there:
```bash
ls -la public/carousel/
```

You should see 40 image files listed.

## After Adding Photos

1. **Restart your dev server** (if it's running):
   - Stop it (Ctrl+C)
   - Start it again: `npm run dev`

2. **Refresh your browser** (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)

3. The carousel should now display your photos!

## Troubleshooting

**Still not showing?**
- Check browser console (F12) for errors
- Verify file names match exactly (case-sensitive on some systems)
- Make sure file extensions match (.jpg vs .jpeg vs .png)
- Check that images are actually image files (not corrupted)
