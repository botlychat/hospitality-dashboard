# 🧪 TEST URLS - LOCAL SERVER

**Server Status:** ✅ RUNNING on localhost:8000  
**Date:** October 27, 2025

---

## 🌐 Main URLs

### Dashboard Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | http://localhost:8000/dashboard.html | Main dashboard with KPIs |
| **Units** | http://localhost:8000/units.html | Units management |
| **AI Agent** | http://localhost:8000/aiagent.html | AI Agent configuration |
| **Contacts** | http://localhost:8000/contacts.html | Contacts management |
| **Website** | http://localhost:8000/website.html | Website settings |
| **Index** | http://localhost:8000/index.html | Alternative dashboard |

---

## 🧪 Quick Test Links

**Click to open:**

1. **[Dashboard](http://localhost:8000/dashboard.html)** - Main page
2. **[Units](http://localhost:8000/units.html)** - Units page
3. **[AI Agent](http://localhost:8000/aiagent.html)** - AI Agent page
4. **[Contacts](http://localhost:8000/contacts.html)** - Contacts page
5. **[Website](http://localhost:8000/website.html)** - Website settings
6. **[Index](http://localhost:8000/index.html)** - Index/Dashboard 2

---

## ✅ What to Test

### Test Profile Component (NEW - UNIFIED)
- ✅ Profile button visible on all pages
- ✅ Click profile button to open menu
- ✅ Menu should look CONSISTENT on all pages
- ✅ Click logout option (with confirmation)
- ✅ Close menu by clicking outside

### Test Basic Features
- ✅ Navigation works (click menu items)
- ✅ Language switching (EN/AR buttons - if present)
- ✅ Currency switching (USD/SAR/EUR buttons - if present)
- ✅ Responsive design (resize browser)

### Check Console
- ✅ Open DevTools (F12)
- ✅ Check Console tab for errors
- ✅ Should see initialization messages
- ✅ No 404 errors for CSS/JS files

---

## 🔍 Checklist

**Visual Inspection:**
- [ ] Dashboard page loads without styling issues
- [ ] Units page loads correctly
- [ ] AI Agent page loads correctly
- [ ] Contacts page loads correctly
- [ ] Website page loads correctly
- [ ] Index page loads correctly

**Profile Menu (NEW):**
- [ ] Profile button visible on all pages
- [ ] Profile menu opens when clicked
- [ ] Profile menu closes when clicking outside
- [ ] Logout option present
- [ ] Profile menu styling consistent everywhere

**Functionality:**
- [ ] Navigation links work
- [ ] No console errors
- [ ] Styles load properly
- [ ] Responsive on mobile view

---

## 📱 Test in Different Sizes

**Desktop:**
```
http://localhost:8000/dashboard.html (1920x1080)
```

**Tablet:**
```
http://localhost:8000/dashboard.html (768x1024)
```

**Mobile:**
```
http://localhost:8000/dashboard.html (375x667)
```

---

## 🛑 Known Issues (Not Yet Fixed)

⚠️ **HTML files still contain old code:**
- Old `<style>` blocks still present (not cleaned)
- Old `<script>` blocks still present (not cleaned)
- New CSS/JS files ARE NOT linked yet

**This means:**
- Pages should still work (using old inline code)
- Extracted files are ready but not being used yet
- Next phase: Clean up HTML files to link new files

---

## 📋 Next Phase: HTML Cleanup

To fully use the extracted files:

1. Remove `<style>` blocks from HTML
2. Remove `<script>` blocks from HTML
3. Add `<link>` tags for CSS files
4. Add `<script>` tags for JS files

**See:** `HTML_CLEANUP_GUIDE.md` for step-by-step instructions

---

## 💡 How to Test

1. **Open any URL above in your browser**
2. **F12 to open Developer Tools**
3. **Check Console for errors**
4. **Test profile button:**
   - Click profile button (top right)
   - Should see menu open
   - Should have logout option
   - Click outside to close

5. **Check different pages** for consistency

---

## 🚀 URLs Summary

```
Dashboard:  http://localhost:8000/dashboard.html
Units:      http://localhost:8000/units.html
AI Agent:   http://localhost:8000/aiagent.html
Contacts:   http://localhost:8000/contacts.html
Website:    http://localhost:8000/website.html
Index:      http://localhost:8000/index.html
```

---

**Server:** Running on localhost:8000 ✅  
**Status:** Ready to test ✅  
**Files:** All on GitHub ✅

**Start testing!** 🧪
