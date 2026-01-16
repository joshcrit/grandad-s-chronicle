# Hero Section Visual Design Code

## Context
This is a memorial website hero section. The hero text sits on top of a scrolling photo carousel background (4 rows of photos sliding horizontally). The backdrop card was added to improve text contrast against the varied scrolling images.

## Design System Colors
```css
/* Warm gold accent */
--accent: 38 70% 50%;  /* hsl(38, 70%, 50%) - warm gold */

/* Text colors in hero */
- Title: white
- Intro text: white
- Heart icon: accent color (warm gold)
```

## Hero Section Structure (React/JSX)

```tsx
{/* Hero Section */}
<header className="relative z-10">
  <div className="container max-w-4xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20">
    <div className="hero-backdrop animate-fade-in">
      <div className="text-center">
        {/* Decorative Element */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center backdrop-blur-sm">
            <Heart className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-6">
          {siteTitle}
        </h1>

        {/* Divider */}
        <div className="gold-divider mb-6" />

        {/* Intro */}
        <p className="text-lg sm:text-xl text-white leading-relaxed mb-10 max-w-2xl mx-auto">
          {introText}
        </p>

        {/* CTA Button */}
        <Link
          to="/add"
          className="btn-memorial text-lg px-8 py-4 inline-flex"
        >
          Add a Memory
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  </div>
</header>
```

## CSS Styling

### Hero Backdrop Card (Main Visual Element)
```css
.hero-backdrop {
  /* Layout */
  position: relative;
  border-radius: 1rem; /* rounded-2xl */
  padding: 2rem 2rem; /* p-8 */
  /* sm: 3rem 3rem (p-12) */
  /* md: 4rem 4rem (p-16) */

  /* Background - Semi-transparent dark gradient */
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.25) 100%
  );

  /* Backdrop blur effect */
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);

  /* Border */
  border: 1px solid rgba(255, 255, 255, 0.05);

  /* Shadow */
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}
```

### Gold Divider
```css
.gold-divider {
  height: 1px;
  width: 4rem; /* w-16 */
  margin: 0 auto;
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsl(38 70% 50% / 0.6) 50%, /* warm gold at 60% opacity */
    transparent 100%
  );
}
```

### Button Styling
```css
.btn-memorial {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 200ms;
  
  background-color: hsl(220 20% 22%); /* primary - deep charcoal */
  color: hsl(40 33% 97%); /* primary-foreground - warm ivory */
  
  /* Hover */
  background-color: hsl(220 20% 22% / 0.9);
}
```

### Heart Icon Container
```css
/* Decorative heart icon circle */
.w-16.h-16 {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px; /* rounded-full */
  background-color: hsl(38 70% 50% / 0.2); /* accent at 20% opacity */
  backdrop-filter: blur(4px);
}
```

## Typography

### Title (h1)
- Font: 'Cormorant Garamond' (serif)
- Sizes: 
  - Mobile: 2.25rem (36px) - text-4xl
  - Small: 3rem (48px) - text-5xl
  - Medium+: 3.75rem (60px) - text-6xl
- Color: white
- Tracking: tight
- Weight: semibold (from base h1 styles)

### Intro Text (p)
- Font: 'Inter' (sans-serif) - default body font
- Sizes:
  - Mobile: 1.125rem (18px) - text-lg
  - Small+: 1.25rem (20px) - text-xl
- Color: white
- Leading: relaxed
- Max width: 42rem (max-w-2xl)

## Background Context

The hero backdrop sits on top of:
- A fixed-position photo carousel (z-0)
- 4 rows of photos scrolling horizontally
- Photos are square aspect ratio
- Full viewport coverage
- The backdrop has z-10 to sit above the carousel

## Responsive Breakpoints
- Default (mobile): padding 2rem, title 2.25rem
- sm (640px+): padding 3rem, title 3rem
- md (768px+): padding 4rem, title 3.75rem

## Current Design Intent
The backdrop card should be:
- Subtle and unobtrusive
- Provide enough contrast for white text readability
- Not overpower the scrolling photo background
- Maintain the dignified, warm memorial aesthetic
