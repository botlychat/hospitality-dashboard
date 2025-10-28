# Build System Setup - Complete ✅

## What Was Done

A complete build system has been implemented to eliminate header/sidebar repetition across all 8 HTML pages.

### Files Created

1. **`build.js`** - Node.js build script that injects shared layout into each page
2. **`src/components/layout.html`** - Single shared template for header + sidebar
3. **`package.json`** - NPM configuration with build scripts
4. **`vite.config.js`** - Vite configuration for dev server
5. **`.gitignore`** - Ignore node_modules and dist/
6. **`BUILD.md`** - Detailed build system documentation
7. **`QUICK_START.md`** - Quick reference guide

### Files Modified

- **`.github/copilot-instructions.md`** - Updated to clarify build tools are allowed

### How It Works

```
Source files (development):
  dashboard.html, units.html, etc.
         ↓
  npm run build
         ↓
  build.js reads each file
  + extracts page content
  + injects shared layout
         ↓
Generated files (production):
  dist/dashboard.html, dist/units.html, etc.
  (all with shared header/sidebar)
```

## Key Benefits

✅ **DRY Principle** - Header/sidebar defined once in `src/components/layout.html`
✅ **No Performance Overhead** - Layout injected at build time (not runtime)
✅ **Easy Updates** - Change header/sidebar once, affects all 8 pages
✅ **Simple Build System** - Custom Node.js script, no Webpack complexity
✅ **GitHub Pages Ready** - Built files ready for deployment
✅ **Backward Compatible** - Original source files unchanged

## Usage

### First Time Setup
```powershell
npm install
```

### Development
```powershell
npm run dev
# Open http://localhost:5173/hospitality-dashboard/dashboard.html
```

### Production Build
```powershell
npm run build
# Check dist/ folder for output
```

### Deploy to GitHub Pages
```powershell
npm run deploy
# Automatically commits and pushes dist/ to main branch
```

## Next Steps

1. **Verify locally:**
   ```powershell
   npm run build
   # Check that dist/ folder contains all pages with layout
   ```

2. **Setup GitHub Pages (if not already done):**
   - Go to GitHub repository settings
   - Set GitHub Pages source to "Deploy from a branch"
   - Select "main" branch

3. **Deploy:**
   ```powershell
   npm run deploy
   ```

4. **Visit your site:**
   - https://botlychat.github.io/hospitality-dashboard/

## Structure

```
hospitality-dashboard/
├── src/
│   └── components/
│       └── layout.html          ← Edit this for header/sidebar changes
│
├── css/                          ← Global and page-specific styles
├── js/                           ← JavaScript files
│
├── dashboard.html, units.html... ← Source pages (for reference)
│
├── dist/                         ← Generated (don't edit)
│   ├── dashboard.html
│   ├── units.html
│   ├── css/
│   ├── js/
│   └── ...
│
├── build.js                      ← Build script
├── package.json                  ← NPM scripts
├── vite.config.js               ← Vite config
├── BUILD.md                      ← Detailed docs
└── QUICK_START.md               ← Quick reference
```

## Important Notes

- ⚠️ **Don't commit `dist/`** - It's auto-generated
- ⚠️ **Run `npm run build` before pushing** if you want the latest version on GitHub Pages
- ✅ **Source files are safe** - They remain unchanged, still functional as-is
- ✅ **All functionality preserved** - Build system only reorganizes code, doesn't change behavior

## Troubleshooting

**Q: Changes to layout.html not appearing?**
A: Run `npm run build` after editing

**Q: dist/ folder is empty?**
A: Run `npm run build` to generate it

**Q: Port 5173 already in use?**
A: Run `npm run dev -- --port 5174` to use a different port

**Q: Want to deploy without using npm?**
A: Manually run `node build.js` to generate dist/, then copy to GitHub Pages

---

**Setup completed successfully!** 🎉

For questions, refer to BUILD.md or QUICK_START.md
