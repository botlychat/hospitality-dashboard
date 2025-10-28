# CSS Extraction Roadmap — Next Steps

## ✅ Step 1: Completed — calendar.html

**Extracted**: 268 lines of CSS → `css/calendar.css`  
**Commit**: `b4ccee8` — Extract calendar.html embedded CSS to external css/calendar.css  
**Status**: Pushed to main ✓

---

## 🔄 Step 2: Ready — Extract remaining pages

The following pages have significant inline or embedded styles that should be extracted:

### High Priority (Large embedded style blocks)
- **aiagent.html** (~586 lines)
  - Contains inline styles throughout
  - Recommendation: Extract custom component styles to `css/aiagent-custom.css`
  
- **contacts.html** (~384 lines)
  - Modal and campaign styles mixed with HTML
  - Recommendation: Extract to `css/contacts-custom.css`

- **business-info.html** (~294 lines)
  - Form styling mixed in HTML
  - Recommendation: Extract to `css/business-info.css`

- **units.html** (~1004 lines, large file)
  - Tab styles, sheet styles, form layout
  - Recommendation: Extract to `css/units-custom.css`

- **website.html** (~282 lines)
  - Theme color picker and settings styles
  - Recommendation: Extract to `css/website-custom.css`

- **dashboard.html** (~1934 lines, largest)
  - Multiple panel styles, KPI cards, tables
  - Recommendation: Extract to `css/dashboard-custom.css`

### Medium Priority (Mostly external CSS already)
- **index.html** — Already minimal (27-line redirect), skip
- **calendar.html** — ✅ Already done

---

## 📝 Extraction Strategy

For each page, follow this pattern:

1. **Identify** all `<style>` blocks and inline `style="..."` attributes that are unique to that page
2. **Extract** to a dedicated CSS file (e.g., `css/pagename-custom.css`)
3. **Keep** shared rules in `css/global.css` (sidebar, header, profile, nav, form basics)
4. **Replace** the embedded `<style>` with a `<link>` tag in the head
5. **Commit** with message: `refactor: Extract pagename.html CSS to css/pagename-custom.css`
6. **Push** to GitHub

---

## 🎯 Estimated effort per page

| Page | Lines | Est. Time | Complexity |
|------|-------|-----------|-----------|
| aiagent.html | 586 | 15 min | Medium |
| contacts.html | 384 | 12 min | Medium |
| business-info.html | 294 | 10 min | Low |
| units.html | 1004 | 20 min | High |
| website.html | 282 | 10 min | Low |
| dashboard.html | 1934 | 30 min | Very High |

**Total estimated**: ~1.5 hours for full CSS extraction across all pages

---

## 💡 Notes

- **No functional changes**: All extractions preserve style behavior exactly
- **Caching benefit**: Each CSS file can be cached independently by the browser
- **Maintenance**: Easier to update page styles when they're in dedicated files
- **Shared patterns**: After extraction, we can identify common inline styles and create utility classes in `css/global.css`

---

## 🚀 Next immediate action

Choose one page to extract next (suggest starting with **business-info.html** as it's small, low complexity):

1. Read the file to identify all embedded/inline CSS
2. Extract to `css/business-info-custom.css`
3. Replace with `<link>` tag
4. Commit and push
5. Move to next page

Would you like to proceed with **business-info.html** next, or would you prefer a different page?

---

**Created**: 2025-10-28  
**Related**: CSS_EXTRACTION_STATUS.md, WEBSITE_ANALYSIS_2025-10-28.md
