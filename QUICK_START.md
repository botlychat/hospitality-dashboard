# Quick Start Guide - Build System

## Setup (One Time)

```powershell
npm install
```

## Development Workflow

```powershell
# Start dev server with hot reload
npm run dev

# Open browser to http://localhost:5173/hospitality-dashboard/dashboard.html
```

## Production Deployment

```powershell
# Build optimized files
npm run build

# Files are in dist/ folder
# Deploy dist/* to your server or GitHub Pages
```

## Automatic Deployment to GitHub Pages

```powershell
npm run deploy
```

This will:
1. Build the project
2. Commit dist/ folder
3. Push to GitHub
4. GitHub Pages automatically deploys

## Editing the Layout

**To change the header or sidebar across all pages:**

1. Edit: `src/components/layout.html`
2. Run: `npm run build`
3. All pages in `dist/` are automatically updated

## Project Structure

```
src/components/
├── layout.html           ← Edit this to change header/sidebar

css/, js/                 ← Your styles and scripts

dashboard.html, ...       ← Source pages (development)

dist/                     ← Built pages (production, auto-generated)

build.js                  ← The build script
```

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (http://localhost:5173) |
| `npm run build` | Generate dist/ folder with optimized HTML |
| `npm run deploy` | Build + commit + push to GitHub Pages |
| `npm run preview` | Preview built files locally |

## Notes

- Source files in root remain unchanged
- dist/ is auto-generated (don't edit directly)
- dist/ is not committed to git
- Each page can still have its own unique content
- Layout is only for header/sidebar (page content stays separate)
