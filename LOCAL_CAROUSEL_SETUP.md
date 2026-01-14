# Local Carousel Setup Guide

## Quick Setup

1. **Create the carousel folder:**
   - Create a folder: `public/carousel/`
   - Add your 40 photos there

2. **Name your photos:**
   - Name them: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, ... `photo40.jpg`
   - Or update the paths in `HeroCarousel.tsx` to match your naming

3. **That's it!** The carousel will automatically display your photos.

## File Structure

```
public/
  └── carousel/
      ├── photo1.jpg
      ├── photo2.jpg
      ├── photo3.jpg
      ...
      └── photo40.jpg
```

## Customizing Photo Paths

If you want to use different names or organize differently, edit `src/components/HeroCarousel.tsx`:

```tsx
const CAROUSEL_PHOTOS = [
  "/carousel/your-photo-name-1.jpg",
  "/carousel/your-photo-name-2.jpg",
  // ... etc
];
```

## Photo Organization

- **Row 1**: photos 1-10
- **Row 2**: photos 11-20
- **Row 3**: photos 21-30
- **Row 4**: photos 31-40

The component automatically splits them into 4 rows.

## Supported Formats

- JPG/JPEG
- PNG
- WebP
- Any image format supported by browsers

## Tips

- Keep file sizes reasonable (under 500KB each for faster loading)
- Use consistent dimensions for best visual effect
- Photos will be automatically resized to fit the carousel
