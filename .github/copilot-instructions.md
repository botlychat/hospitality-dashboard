# AI Coding Agent Instructions - Hospitality Dashboard

## Overview

This is a vanilla JavaScript hospitality admin dashboard with no frameworks. Single-page navigation to multiple HTML files, comprehensive localStorage wrapper, and i18n support (English/Arabic + RTL).

**Key Tech Stack:** HTML5, CSS3, ES6+ JavaScript, localStorage, Service Workers, Font Awesome 6.5.1, GitHub Pages deployment

## Architecture

### Multi-Page Application Structure

- **8 Main Pages:** `dashboard.html`, `units.html`, `calendar.html`, `contacts.html`, `aiagent.html`, `website.html`, `business-info.html`, `index.html`
- **Navigation:** Via `data-link` attributes and `navigateToPage(page)` in `utils.js`
- **Routing:** Path detection handles both GitHub Pages (`/hospitality-dashboard/`) and local development via `getPagePath()` utility

### Storage Architecture (CRITICAL)

**All localStorage access must use the `Storage` helper** in `js/storage.js` (429 lines). This wrapper provides error handling for:
- Corrupted JSON data (automatic removal + fallback)
- QuotaExceededError when storage full
- SecurityError in private browsing mode
- Invalid data types and null/undefined values

**Do NOT use raw `localStorage.getItem()` or `JSON.parse()` anywhere.** Use instead:
```javascript
// ✅ CORRECT
const data = Storage.getJSON('bookings', []);
Storage.setJSON('bookings', newData);

// ❌ NEVER
const data = JSON.parse(localStorage.getItem('bookings')); // FORBIDDEN
```

### CSS Architecture

**Variables-First Approach** (css/variables.css):
- Custom properties: `--accent` (orange), `--sidebar` (dark blue), `--text-primary`, `--bg-gradient`, etc.
- Use `var(--propertyName)` everywhere - never hardcode colors
- Responsive breakpoints defined in `css/responsive.css`

**File Organization:**
- `variables.css` - All CSS custom properties
- `global.css` - Base styles, layout, components
- `responsive.css` - Media queries (mobile-first)
- `profile.css` - Profile sidebar component
- Page-specific: `dashboard.css`, `units.css`, `calendar.css`, etc.

## Data Patterns & Storage Keys

### Core Data Structures (all stored as JSON via `Storage.setJSON/getJSON`)

- **bookings:** Array of booking objects `{ id, clientId, unitId, checkIn, checkOut, status, price }`
- **units:** Array of unit objects `{ id, name, group, capacity, basePrice, ... }`
- **groups:** Array of unit groups `{ id, name, color }`
- **contacts:** Array of client objects `{ id, name, email, phone, ... }`
- **aiConfig:** Object with AI agent settings `{ discount, bookingMethod, welcomeMessage, ... }`
- **websiteSettings:** Object with site config `{ groups, menuStructure, ... }`

### Language & Theme Persistence

- `language`: 'en' or 'ar' (triggers `dir="ltr"` / `dir="rtl"` and rebuilds UI)
- `theme_color`: Hex color for theme switching
- All UI labels use `data-i18n="keyName"` attributes - see `loadTranslations()` in `utils.js`

## Component Patterns

### Modal System

```javascript
// Always create modals using these helpers
openModal(htmlString, { closeOnBackdropClick: true });
closeModal();
confirmDialog(message, onConfirmCallback, 'Confirm', 'Cancel');
```

Modal backdrop auto-created if missing. Content goes in `#modalContent` div.

### Form Handling

- Use inline event handlers (`onclick="functionName()"`) in HTML
- Parse form data manually (no form libraries)
- Always validate before `Storage.setJSON()` - handle user errors gracefully
- Show feedback via simple `alert()` or custom success messages

### Navigation Links

Use `data-link="filename.html"` on buttons/divs, handled by global click listener:
```javascript
document.addEventListener('click', (e) => {
  if (e.target.dataset.link) {
    navigateToPage(e.target.dataset.link);
  }
});
```

## Development Workflow

### Build System & Deployment (AUTOMATED)

**The project uses a build system with automatic deployment workflow:**

1. **Single Source of Truth for Layout:** Header and sidebar are in `src/components/layout.html`
2. **Build Process:** `npm run build` regenerates all HTML files in `dist/` with the layout template injected
3. **GitHub Pages Deployment:** Files in `dist/` are automatically served by GitHub Pages

**IMPORTANT: After any edits, you MUST:**
1. Run `npm run build` to regenerate dist/
2. Run `git add dist/` to stage the changes
3. Run `git commit -m "your message"` to commit
4. Run `git push` to deploy to live site

**Or use the shortcut:** `npm run deploy` (if deploy script is configured)

### Automatic Build & Deploy After Edits

**AI Agent Instructions:** When you make ANY edit to:
- Source HTML files (dashboard.html, units.html, etc.)
- CSS files (css/*.css)
- JavaScript files (js/*.js)
- Layout template (src/components/layout.html)

**AUTOMATICALLY EXECUTE:**
```powershell
npm run build
git add dist/
git commit -m "auto: rebuild after edits"
git push
```

This ensures all changes are immediately deployed to the live site without manual intervention.

### Local Testing

```powershell
# Start dev server with hot reload
npm run dev
# Open http://localhost:5173/hospitality-dashboard/dashboard.html

# OR: Start simple HTTP server (for testing dist/ folder)
python -m http.server 8000
# Open http://localhost:8000/hospitality-dashboard/dist/dashboard.html
```

### Deployment

- GitHub Pages enabled on `main` branch
- `.nojekyll` file prevents Jekyll processing
- Service Worker (`service-worker.js`) handles offline caching
- `<base href="/hospitality-dashboard/">` in HTML heads for correct routing
- **dist/ folder is what gets deployed** (not source files)

### Common Tasks

**Adding a new page:**
1. Create `newpage.html` (copy structure from `dashboard.html`)
2. Include all CSS files + `js/storage.js`
3. Add Service Worker registration (16 lines in `<head>`)
4. Add nav link in sidebar
5. Use `navigateToPage()` for internal links, `Storage` helper for data

**Adding a feature to existing page:**
1. Add HTML in tab section
2. Add CSS to page-specific CSS file using `var(--cssVariable)`
3. Add JavaScript inline (most pages do this for single-page logic)
4. Use `Storage.getJSON()` and `Storage.setJSON()` for persistence
5. Use `data-i18n="key"` for labels + update translation object in `utils.js`

**Fixing i18n:**
- All text labels use `data-i18n="translationKey"` attributes
- Translation object is in `loadTranslations()` inside `utils.js`
- Add new keys to both `en` and `ar` objects
- UI updates via `updateTranslations()` function called on language toggle

## Important Files Reference

- **`js/storage.js`** (429 lines) - Storage helper with 16 safe methods - READ CAREFULLY before working with data
- **`js/utils.js`** (510 lines) - Navigation, path routing, translations, utility functions
- **`js/components.js`** (424 lines) - Reusable modal, sheet, form components
- **`css/variables.css`** - Define all CSS custom properties here
- **`css/responsive.css`** - Mobile breakpoints (never inline media queries)

## Critical Constraints

1. **No frameworks** - No Vue, React, Svelte. Vanilla DOM manipulation only.
2. **Storage-first** - All data persists locally. Treat localStorage as your database.
3. **Error recovery** - Corrupted data must be handled gracefully with fallbacks, never crash the app.
4. **GitHub Pages paths** - Always use `getPagePath()` for navigation, never hardcode paths.

## Build Tools & Optimization

Build tools (webpack, Vite, Gulp, etc.) and npm scripts are **allowed and encouraged** for:
- Eliminating HTML/CSS/JavaScript repetition (shared layouts, components)
- Minification and bundling for production
- Task automation and file processing
- Development workflow improvements

**Current build system status:** ✅ **ACTIVE**
- Using custom Node.js build script (`build.js`)
- Shared layout template in `src/components/layout.html`
- All HTML pages use shared header/sidebar (no duplication)
- NPM scripts: `npm run dev`, `npm run build`, `npm run deploy`

## Refactoring Status

✅ **Build System:** Fully implemented with template injection for header/sidebar elimination
✅ **Storage Helper:** All 55+ localStorage calls refactored to use `Storage` helper (REFACTORING_COMPLETE.md documents full details and git commits). Do not revert this pattern.
✅ **GitHub Pages Deployment:** dist/ folder tracked in git for immediate deployment
