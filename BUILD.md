# Build System & Template Layout

This project now uses a build system to eliminate header/sidebar repetition across HTML pages.

## Setup

### Installation

```bash
npm install
```

### Development

To run locally during development:

```bash
npm run dev
```

This starts a Vite development server at `http://localhost:5173` with hot reload.

### Building for Production

To build the project for GitHub Pages deployment:

```bash
npm run build
```

This generates optimized HTML files in the `dist/` folder with the shared layout template injected into each page.

## Architecture

### Shared Layout Template

The header and sidebar are now stored in a single template file: `src/components/layout.html`

This template contains:
- `<aside class="sidebar">` - Navigation sidebar
- `<header class="header">` - Top header with search and profile menu
- Placeholder for page-specific content

### Build Process

1. **Read** `src/components/layout.html`
2. **Extract** page-specific content from each original HTML file
3. **Inject** the layout template + page content into a new HTML file
4. **Copy** static assets (css, js, service-worker.js) to dist/
5. **Output** optimized HTML files to `dist/`

### Source vs. Built Files

**Source files** (for development/editing):
- `dashboard.html`, `units.html`, etc. in project root
- Still contain the inline header/sidebar (unchanged for backward compatibility)

**Built files** (for deployment):
- Located in `dist/` folder
- Generated automatically by `npm run build`
- Used for GitHub Pages deployment

## Updating the Layout

To update the header or sidebar for **all pages**, edit: `src/components/layout.html`

Then rebuild: `npm run build`

All pages will automatically have the updated layout.

## GitHub Pages Deployment

Deploy the contents of the `dist/` folder to GitHub Pages:

```bash
npm run build
# Copy contents of dist/ to GitHub Pages branch
```

Or use GitHub Actions to automate this.

## File Structure

```
hospitality-dashboard/
├── src/
│   └── components/
│       └── layout.html          # Shared header/sidebar template
├── css/                          # Global styles
├── js/                           # JavaScript files
├── dashboard.html, units.html... # Source HTML pages
├── build.js                      # Build script
├── vite.config.js               # Vite configuration
├── package.json                  # NPM dependencies & scripts
└── dist/                         # Generated output (gitignored)
```

## Notes

- The original HTML files in the project root are not modified
- The build script is a simple Node.js script (no Webpack complexity)
- All built files maintain the same structure and functionality
- Static assets are automatically copied to dist/
- Service Worker and all other functionality remains unchanged
