# WealthAnchor — UI Design System & Frontend Specification Reference

> **Executive Reference Document**  
> This specification serves as the primary ground-truth reference for all UI/UX development, styling rules, typography hierarchy, color tokens, and micro-interaction animations across WealthAnchor.

---

## 1. Design Philosophy & Aesthetic Identity

| Principle | Guideline |
|---|---|
| **Institutional Authority** | Visual language mirrors Tier-1 private wealth management institutions and structured finance desks. Avoid playful startup cliches or generic AI-generated templates. |
| **Meaningful Minimalism** | Zero placeholder "blah-blah" copy. Every headline, label, badge, and paragraph must deliver direct, factual, and actionable financial information. |
| **Balanced Proportions** | Generous breathing room (`px-6` to `px-12`, section padding `py-16` to `py-24`). Content must never feel cramped or excessively sparse. |
| **Dynamic Micro-Interactions** | Interfaces feel responsive, tactile, and alive. Interactive elements react with spring physics (`cubic-bezier(0.34, 1.56, 0.64, 1)`), smooth lifts, and icon morphing. |

---

## 2. Typography System

### Font Families
- **Headings & Display**: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`  
  *Characteristics*: Geometric yet human, tight letter spacing, high visual authority.
- **Body, UI Controls & Labels**: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`  
  *Characteristics*: Ultra-clean neutral sans-serif optimized for small-screen readability, dense financial figures, and forms.
- **Financial Metrics & Numbers**: `font-feature-settings: "tnum" 1` (tabular numbers enabled for aligned calculation values).

### Type Hierarchy & Scaling

| Level | Font Size | Weight | Tracking (Letter Spacing) | Line Height | Usage |
|---|---|---|---|---|---|
| **Display H1** | `52px` – `64px` (`3.25rem` – `4rem`) | `700` Bold / `800` Extrabold | `-0.025em` | `1.12` | Hero headline |
| **Section Title H2** | `32px` – `40px` (`2rem` – `2.5rem`) | `700` Bold | `-0.025em` | `1.2` | Major section headers |
| **Subsection H3** | `22px` – `26px` (`1.375rem` – `1.625rem`) | `600` Semibold | `-0.02em` | `1.3` | Card titles, modal headers |
| **Card / Item Title H4** | `18px` – `20px` (`1.125rem` – `1.25rem`) | `600` Semibold | `-0.015em` | `1.35` | Service titles, feature blocks |
| **Eyebrow / Badge** | `11px` – `12px` (`0.6875rem` – `0.75rem`) | `700` Bold | `+0.08em` (Uppercase) | `1.4` | Category tags, verification badges |
| **Body Large (Lead)** | `17px` – `18px` (`1.0625rem` – `1.125rem`) | `400` Regular / `500` Medium | `-0.01em` | `1.65` | Hero subtext, section intros |
| **Body Regular** | `15px` – `16px` (`0.9375rem` – `1rem`) | `400` Regular | `0em` | `1.6` | Paragraphs, descriptions |
| **Body Small** | `13px` – `14px` (`0.8125rem` – `0.875rem`) | `400` Regular / `500` Medium | `-0.005em` | `1.5` | Helper text, secondary specs |
| **Legal / Microcopy** | `11px` – `12px` (`0.6875rem` – `0.75rem`) | `400` Regular | `0em` | `1.4` | Regulatory disclaimers, timestamps |
| **Desktop Nav Link** | `14.5px` (`0.906rem`) | `600` Semibold | `-0.015em` | `1.2` | Top navigation items |

---

## 3. Color Tokens & Palette

### Primary Brand Colors
```css
--brand-teal:       #187C78;  /* rgb(24, 124, 120) — Core accent, primary CTAs, active states */
--brand-teal-hover: #126763;  /* rgb(18, 103, 99)  — Button hover, active gradient stop */
--brand-teal-dark:  #105955;  /* rgb(16, 89, 85)   — Deep gradient anchor */
--brand-teal-tint:  #F1F5F4;  /* rgb(241, 245, 244) — Pill badges, icon badge backgrounds */
--brand-teal-glow:  rgba(24, 124, 120, 0.35); /* Button glow & active element halos */
```

### Dark Authority & Text Shades
```css
--text-navy-primary:   #183247;  /* rgb(24, 50, 71)   — Main dark text, headings, prominent labels */
--text-navy-strong:    #112536;  /* rgb(17, 37, 54)   — Nav links, high-contrast dark text */
--text-slate-secondary: #667085; /* rgb(102, 112, 133) — Explanatory copy, subtitles, hints */
--text-slate-muted:    #94A3B8;  /* rgb(148, 163, 184) — Inactive tabs, disabled states, borders */
```

### Surfaces & Background Colors
```css
--bg-primary:          #f8f8f4;  /* Warm executive off-white canvas (body background) */
--bg-alternate:        #F7F7F2;  /* Section alternating background */
--bg-surface-white:    #FFFFFF;  /* Cards, modals, dropdown menus, text input fields */
--bg-section-light:    #F1F5F4;  /* Soft tinted containers and callout boxes */
--bg-dark-hero:        #0c1b29;  /* Hero gradient overlay base */
--bg-footer:           #081420;  /* Institutional footer surface */
```

### Borders & Dividers
```css
--border-subtle:       #E5E7EB;  /* rgba(229, 231, 235, 0.85) — Standard card & divider line */
--border-tinted:       #E2E8F0;  /* Secondary dividers */
--border-focus:        #187C78;  /* Focus state border on inputs, controls */
--focus-ring:          0 0 0 3px rgba(24, 124, 120, 0.15); /* Input focus shadow */
```

---

## 4. Component Layout & Structural Geometry

### A. Navigation Header
- **Position**: Fixed top (`position: fixed; top: 0; left: 0; right: 0; z-index: 1000`)
- **Container Geometry**:
  - Max Width: `1640px` (centered with `margin: 0 auto`)
  - Padding: `16px 36px` (top) $\rightarrow$ `12px 32px` (scrolled)
  - Logo placement: Left edge with `flex-shrink: 0`
  - CTA placement: Right edge with `flex-shrink: 0`
- **Surface**: `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(16px) saturate(180%)`
- **Bottom Border**: `1px solid rgba(229, 231, 235, 0.85)`
- **Shadow**: `0 4px 20px -2px rgba(24, 50, 71, 0.08)` (when scrolled)

### B. Navigation Links (`.nav-link`)
- **Padding**: `8px 15px`
- **Border Radius**: `9999px` (fully rounded pill)
- **Font**: `Inter`, `14.5px`, `font-weight: 600`, color `#112536`, `letter-spacing: -0.015em`
- **Hover State**: Background `rgba(24, 124, 120, 0.08)`, text color `#187C78`
- **Active State (`.nav-link--active`)**: Background `rgba(24, 124, 120, 0.09)`, border `1px solid rgba(24, 124, 120, 0.16)`, text `#187C78`

### C. Primary CTA Buttons (`.cta-button`, `.btn-primary-glow`)
- **Height / Padding**: `10px 24px` (Desktop header), `14px 28px` (Hero / Form)
- **Border Radius**: `9999px` (pill) or `10px` (form actions)
- **Gradient Background**: `linear-gradient(135deg, #187C78 0%, #105955 100%)`
- **Text**: `#ffffff`, `font-weight: 600`, `letter-spacing: -0.01em`
- **Shadow**: `0 4px 18px rgba(24, 124, 120, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
- **Hover Transform**: `translateY(-1.5px)` with shadow `0 8px 24px rgba(24, 124, 120, 0.55)`

### D. Cards & Panels (`.card-hover`)
- **Surface**: `#ffffff`
- **Border**: `1px solid #E5E7EB`
- **Border Radius**: `14px` or `16px`
- **Base Shadow**: `0 1px 3px rgba(24, 50, 71, 0.05)`
- **Hover Transform**: `translateY(-5px)`
- **Hover Shadow**: `0 16px 32px -8px rgba(24, 50, 71, 0.10), 0 6px 12px -3px rgba(24, 50, 71, 0.05)`
- **Cleanliness Rule**: No top accent lines or arbitrary color strips on hover.

---

## 5. Animation & Micro-Interaction Master Catalog

### 1. Creative Nav Icon Morph Animation
When hovering over any navigation link, the default icon rotates, scales down, and fades out, while a creative solid alternate icon springs into view.

```css
/* Container */
.nav-icon-morph {
  position: relative;
  width: 17px;
  height: 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Default & Hover Layers */
.nav-icon-default,
.nav-icon-hover {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #187C78;
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-icon-default {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.nav-icon-hover {
  opacity: 0;
  transform: scale(0.3) rotate(-45deg);
  pointer-events: none;
}

/* On Link Hover */
.nav-link:hover .nav-icon-default {
  opacity: 0;
  transform: scale(0.2) rotate(45deg);
}

.nav-link:hover .nav-icon-hover {
  opacity: 1;
  transform: scale(1.15) rotate(0deg);
}
```

#### Established Icon Pairing Reference:
All icons **MUST** use solid fill (`fill="currentColor"`) without stroke lines:
1. **Home**: Solid House $\rightarrow$ **Solid Key** (unlocking real estate)
2. **About Us**: Solid Office Building $\rightarrow$ **Solid ShieldCheck** (institutional verified trust)
3. **How It Works**: Solid Process 4-Block $\rightarrow$ **Solid Lightning Bolt** (rapid digital approval)
4. **EMI Calculator**: Solid Calculator $\rightarrow$ **Solid Analytics Bar Chart** (financial breakdown)
5. **FAQs**: Solid Question Circle $\rightarrow$ **Solid Lightbulb** (instant illumination & answers)
6. **Contact**: Solid Phone Receiver $\rightarrow$ **Solid Chat Bubble** (live advisory dialogue)
7. **Loan Solutions**: Solid Executive Briefcase $\rightarrow$ **Solid Bank Landmark** (lender network)

---

### 2. Continuous Sliding Marquee Animation
Used for Lender Partner banks and client testimonials.
- **Speed**: Controlled slow speed (`90s` and `95s`) for maximum legibility.
- **Hardware Acceleration**: Uses `translate3d` to prevent CPU frame drops.
- **Pause on Interaction**: Automatically pauses animation on `:hover`, `:active`, and `:focus-within`.

```css
@keyframes continuousScroll {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

.animate-continuous-scroll {
  display: flex;
  width: max-content;
  animation: continuousScroll 90s linear infinite;
  will-change: transform;
}

.animate-continuous-scroll:hover,
.animate-continuous-scroll:active,
.animate-continuous-scroll:focus-within {
  animation-play-state: paused !important;
}

/* Reverse Direction */
@keyframes continuousScrollReverse {
  0% { transform: translate3d(-50%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

.animate-continuous-scroll-reverse {
  display: flex;
  width: max-content;
  animation: continuousScrollReverse 95s linear infinite;
  will-change: transform;
}

.animate-continuous-scroll-reverse:hover,
.animate-continuous-scroll-reverse:active,
.animate-continuous-scroll-reverse:focus-within {
  animation-play-state: paused !important;
}
```

---

### 3. Shimmer Light Sweep (`.shimmer-effect`)
Used for high-priority CTA buttons or featured highlights to create subtle organic motion.

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

.shimmer-effect {
  position: relative;
  overflow: hidden;
}

.shimmer-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transform: skewX(-20deg);
  animation: shimmer 4s infinite;
}
```

---

### 4. Subtle Pulse Badge (`.pulse-badge`)
Used for live advisory status indicators, 40+ lender badges, and instant sanction tags.

```css
@keyframes pulseSubtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.88; transform: scale(1.04); }
}

.pulse-badge {
  animation: pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

### 5. Kinetic Typography Assembly (Hero Headline)
Letter breaking and re-assembling animation for hero headline transition:

```css
@keyframes letterBreakOut {
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: translate3d(calc(var(--scatter-x, 0px) * 2.2), -34px, 0) rotate(calc(var(--scatter-rot, 0deg) * 2)) scale(0.65);
    filter: blur(10px);
  }
}

@keyframes letterAssembleIn {
  0% {
    opacity: 0;
    transform: translate3d(var(--enter-x, 0px), 30px, 0) rotate(var(--enter-rot, 0deg)) scale(0.72);
    filter: blur(10px);
  }
  65% {
    opacity: 1;
    transform: translate3d(0, -3px, 0) rotate(0deg) scale(1.05);
    filter: blur(0px);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    filter: blur(0px);
  }
}
```

---

## 6. Implementation Checklist & Rules

### ✅ What To Do:
1. **Always use Solid Filled Icons**: Icons must be filled with `fill="currentColor"` and tinted with `text-brand-teal` (`#187C78`). Do not use hollow outline-only icons for primary nav controls.
2. **Respect Width Boundaries**: Keep the header and top-level containers wide (`maxWidth: 1640px`) so that the logo stays to the left and CTAs stay to the right.
3. **Keep Copy Direct**: State numerical facts (e.g., *8.40% p.a.*, *24–48h Sanction*, *40+ Partner Banks*, *₹25 Lakh to ₹50 Crore*).
4. **Use Established Spring Timing**: For micro-interactions, use `cubic-bezier(0.34, 1.56, 0.64, 1)` to give elements a delightful organic spring.

### ❌ What Not To Do:
1. **Never use generic blue/red primary colors**: Only use the calibrated `#187C78` teal, `#183247` navy, and `#f8f8f4` warm canvas.
2. **Never add AI-cliche decorative cards**: No top colored borders or excessive rainbow gradients on card hover.
3. **Never use fast marquees**: Sliding marquees must remain slow (`90s`–`95s`) and must pause on user hover.
4. **Never let content touch the screen edges**: Always ensure `padding: 0 24px` on mobile and `0 36px` on desktop.