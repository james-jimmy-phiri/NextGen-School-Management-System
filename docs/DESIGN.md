---
name: Academic Excellence
colors:
  surface: '#faf9fc'
  surface-dim: '#dbd9dd'
  surface-bright: '#faf9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f6'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f2f0f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#485f83'
  primary: '#001b39'
  on-primary: '#ffffff'
  primary-container: '#163051'
  on-primary-container: '#8098bf'
  inverse-primary: '#afc8f1'
  secondary: '#016686'
  on-secondary: '#ffffff'
  secondary-container: '#93dbff'
  on-secondary-container: '#006180'
  tertiary: '#291600'
  on-tertiary: '#ffffff'
  tertiary-container: '#452900'
  on-tertiary-container: '#b98f5c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#afc8f1'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2f486a'
  secondary-fixed: '#c0e8ff'
  secondary-fixed-dim: '#87d0f4'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d66'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#edbe87'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#604014'
  background: '#faf9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e3e2e5'
  heritage-gold: '#DFAC29'
  stanner-blue: '#0072CE'
  surface-alt: '#F2F5F8'
typography:
  headline-xl:
    fontFamily: IBM Plex Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: IBM Plex Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Oswald
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: IBM Plex Serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system embodies a prestigious, established institutional identity that balances heritage with a forward-thinking educational vision. It is designed to evoke trust, intellectual rigor, and community pride.

The visual style is **Corporate / Modern** with a **Bold** branding influence. It utilizes high-fidelity photography, expansive white space to denote quality, and a structured, authoritative grid. The aesthetic is "premium academic," characterized by deep, traditional colors paired with crisp, modern execution to ensure the interface feels both historically rooted and technologically current.

## Colors

The palette is anchored by a deep **Navy Primary**, representing stability and institutional authority. A vibrant **Secondary Blue** (extracted from the UI accents in the reference) provides modern energy and is used for calls to action and highlights.

**Heritage Gold** is reserved for high-importance accents, honors, and specific brand markers to maintain its perceived value. The neutral palette leans toward cool grays and pure whites to maintain a clean, high-fidelity professional look.

## Typography

The typography strategy uses a "Serif for Authority, Sans for Utility" approach. 

- **Headlines:** Use a structured serif to convey academic prestige and tradition. 
- **Body Text:** Uses a highly legible sans-serif for long-form reading and functional clarity. 
- **Labels:** A condensed sans-serif is utilized for navigation and category headers, mirroring the "Bold" callouts seen in the institutional branding. 

Text should maintain high contrast against backgrounds to ensure accessibility and a crisp, high-fidelity finish.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain an editorial, "brochure-ware" quality that feels intentional and curated. On larger screens, the content container is capped at 1280px.

A 12-column grid is used with generous gutters (24px) to allow content to breathe. Section-to-section spacing is intentionally large (up to 120px) to separate distinct academic pillars. On mobile, the system transitions to a fluid 4-column layout with reduced vertical padding but maintains the same relative hierarchy.

## Elevation & Depth

To maintain a "High-Fidelity" look, this design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**. 

Depth is achieved through:
1. **Background Blocks:** Large areas of Primary Navy or light gray to separate sections.
2. **Hard Overlays:** Text overlays on high-quality photography using semi-transparent dark gradients or solid color blocks.
3. **Ghost Borders:** Subtle 1px borders in a slightly darker or lighter shade than the background to define cards without adding visual "clutter" from shadows.

## Shapes

The shape language is conservative and professional. We use **Soft** roundedness (4px) for most interactive elements like buttons and input fields to feel modern but not "playful." 

Large containers like cards or image frames may remain **Sharp** (0px) to reinforce the structured, institutional grid. Buttons can occasionally use a pill-shape if they are high-priority global CTAs (e.g., "Apply Now"), but the default remains soft-rectangular.

## Components

### Buttons
Primary buttons use the Primary Navy background with White text and a subtle 4px radius. Secondary buttons use the Secondary Blue to draw attention to specific actions. Tertiary buttons are text-only with the Condensed Label font and a chevron icon.

### Cards
Cards are designed as "vessels for content." They use sharp corners, no shadows, and 1px light gray borders. When used for news or spotlights, the image should occupy the top 60% of the card with the Serif headline below.

### Input Fields
Fields use a white background, 1px gray border, and the Sans-Serif body font. The active state is signaled by a 2px Primary Navy border.

### Chips & Badges
Small, all-caps labels using the Heritage Gold or Secondary Blue backgrounds. These are used for status indicators like "Honors" or "Upcoming Event."

### Navigation
The main navigation uses the Condensed Sans-Serif for a clean, horizontal bar. Active states are indicated by a 3px bottom border in Secondary Blue.