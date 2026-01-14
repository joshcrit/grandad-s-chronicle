# Hero Carousel Setup Guide

## Overview

The hero carousel displays 40 photos in 4 rows on the home page, with each row sliding continuously left to right (or right to left for alternating rows).

## Setup Steps

### 1. Create Database Table

Run `create_hero_carousel.sql` in Supabase SQL Editor:
- Creates `hero_carousel_photos` table
- Sets up RLS policies (public can view, admins can manage)
- Creates indexes for efficient queries

### 2. Upload Photos

1. Go to your admin panel (`/admin/login`)
2. Click the **"Hero Carousel"** tab
3. Drag and drop or click to upload photos
4. Photos will automatically be distributed across 4 rows (10 per row)
5. You can upload all 40 at once, or upload in batches

### 3. View on Home Page

The carousel will automatically appear at the top of your home page once photos are uploaded.

## Features

- **4 Rows**: Each row displays 10 photos
- **Continuous Animation**: Photos slide smoothly in a continuous loop
- **Alternating Directions**: Rows alternate between left-to-right and right-to-left
- **Different Speeds**: Each row has a slightly different speed for visual interest
- **Responsive**: Works on mobile, tablet, and desktop

## Managing Photos

### Upload Photos
- Go to Admin → Hero Carousel tab
- Drag and drop or click to upload
- Maximum 40 photos total (10 per row)
- Maximum 20MB per photo

### Delete Photos
- Hover over a photo in the admin panel
- Click the trash icon to remove it
- The photo will be removed from both storage and database

### Automatic Distribution
- Photos are automatically assigned to rows
- System tries to balance photos evenly across rows
- If a row is full (10 photos), new photos go to the next available row

## Technical Details

- **Storage**: Photos are stored in the `memory-photos` storage bucket
- **Database**: Photo metadata is stored in `hero_carousel_photos` table
- **Animation**: Uses CSS keyframe animations for smooth, infinite scrolling
- **Performance**: Photos are lazy-loaded for better performance

## Troubleshooting

### Photos not showing?
- Check that you've run `create_hero_carousel.sql`
- Verify photos are uploaded in the admin panel
- Check browser console for errors

### Animation not smooth?
- Make sure you have at least 10 photos per row for seamless looping
- Check that photos are properly loaded (not broken images)

### Can't upload photos?
- Check you're logged in as admin
- Verify RLS policies are set correctly
- Check storage bucket permissions
