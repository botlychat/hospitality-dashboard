# 📂 Complete Extraction Roadmap

## Executive Summary

Your 6 HTML files contain **7,529 lines of code** with significant duplication:
- **50-95% CSS duplication** across all files
- **40-80% JavaScript duplication** across all files
- **100% translation duplication** across all files

**Result:** Need to extract into **16 separate files** organized in 4 folders

---

## 📁 Final File Structure

```
hospitality-dashboard/
│
├── 📄 index.html (Landing/alternative dashboard)
├── 📄 login.html (To be created - Authentication)
│
├── 📁 css/ (9 files - NO DUPLICATION)
│   ├── global.css          (450 lines) ✅ Design system, base styles
│   ├── layout.css          (250 lines) ✅ Sidebar, header, grid
│   ├── components.css      (200 lines) ✅ Buttons, forms, modals
│   ├── responsive.css      (250 lines) ✅ Media queries, RTL
│   ├── dashboard.css       (120 lines) ✅ KPIs, tables, tabs
│   ├── units.css           (150 lines) ✅ Sheets, pricing grids
│   ├── contacts.css        (100 lines) ✅ Filtering, pagination
│   ├── aiagent.css         (100 lines) ✅ Progress, roles
│   └── website.css         (80 lines)  ✅ Color picker, preview
│
├── 📁 js/ (11 files - NO DUPLICATION)
│   ├── utils.js            (80 lines)  ✅ Helpers, formatting
│   ├── translations.js     (600 lines) ✅ i18n EN/AR
│   ├── auth-nav.js         (180 lines) ✅ Auth, navigation
│   ├── data-models.js      (250 lines) ✅ Data structures
│   ├── components.js       (350 lines) ✅ Modals, forms, tables
│   ├── supabase-client.js  (250 lines) ✅ API client (NEW)
│   ├── dashboard.js        (700 lines) ✅ Dashboard logic
│   ├── units.js            (800 lines) ✅ Units management
│   ├── contacts.js         (600 lines) ✅ Contacts management
│   ├── aiagent.js          (700 lines) ✅ AI Agent config
│   └── website.js          (400 lines) ✅ Website settings
│
├── 📁 pages/ (6 minimal files)
│   ├── dashboard.html      (300 lines) ✅ Structure + imports
│   ├── units.html          (250 lines) ✅ Structure + imports
│   ├── contacts.html       (200 lines) ✅ Structure + imports
│   ├── aiagent.html        (250 lines) ✅ Structure + imports
│   ├── website.html        (180 lines) ✅ Structure + imports
│   └── calendar.html       (150 lines) ⏳ To be created
│
├── 📁 lib/ (Utilities)
│   ├── supabase-client.js  (Production copy)
│   └── auth.js             (Optional - Auth utilities)
│
└── 📁 docs/ (Documentation)
    ├── ARCHITECTURE_ANALYSIS.md
    ├── MULTI_TENANT_CONCEPT.md
    ├── CODE_STRUCTURE_PLAN.md
    ├── CODE_EXTRACTION_SUMMARY.md
    ├── CODE_EXTRACTION_VISUAL.md
    └── EXTRACTION_ROADMAP.md (THIS FILE)
```

---

## 🔄 Extraction Flow Diagram

```
CURRENT STATE                              TARGET STATE
─────────────                              ────────────

dashboard.html (2,023 lines)              pages/dashboard.html (300 lines)
├── <style>CSS</style>          ──X───┐   ├── <link> css/global.css
├── <template>HTML</template>   ──X───┼─→ ├── <link> css/layout.css
└── <script>JS</script>         ──X───┤   ├── <link> css/components.css
                                   │   │   ├── <link> css/responsive.css
units.html (1,559 lines)        │   │   ├── <link> css/dashboard.css
├── <style>CSS</style>       ✂️ EXTRACT   ├── <link> ... (shared CSS)
├── <template>HTML</template>    │   │   ├── <script> js/utils.js
└── <script>JS</script>          │   │   ├── <script> js/translations.js
                              ┌──┤   │   └── <script> js/dashboard.js
contacts.html (861 lines)    │  │   │
├── <style>CSS</style>       │  │   └─→ css/global.css (450 lines)
├── <template>HTML</template>│  │       css/layout.css (250 lines)
└── <script>JS</script>      │  │       css/components.css (200 lines)
                             │  │       css/responsive.css (250 lines)
aiagent.html (1,311 lines)   │  └──────┤
├── <style>CSS</style>       │         │ css/dashboard.css (120 lines)
├── <template>HTML</template>│  ┌──────→ css/units.css (150 lines)
└── <script>JS</script>      │  │       css/contacts.css (100 lines)
                             │  │       css/aiagent.css (100 lines)
website.html (494 lines)     │  │       css/website.css (80 lines)
├── <style>CSS</style>   ✂️ EXTRACT
├── <template>HTML</template>│  └──────→ js/utils.js (80 lines)
└── <script>JS</script>      │         js/translations.js (600 lines)
                             │         js/auth-nav.js (180 lines)
index.html (1,281 lines)     │         js/data-models.js (250 lines)
├── <style>CSS</style>       │         js/components.js (350 lines)
├── <template>HTML</template>│         js/dashboard.js (700 lines)
└── <script>JS</script>      │         js/units.js (800 lines)
                             │         js/contacts.js (600 lines)
7,529 LINES TOTAL        ────┴─────→ js/aiagent.js (700 lines)
(50% DUPLICATION!)             js/website.js (400 lines)

                            8,590 LINES ORGANIZED
                            (0% DUPLICATION!)
```

---

## ✅ Step-by-Step Extraction Tasks

### PHASE 1: Global CSS (Most Duplicated - 95%)

#### Task 1.1: Create global.css (450 lines)
Extract from **dashboard.html** lines ~10-460:
```css
:root { /* All CSS variables */ }
* { box-sizing: border-box; }
html, body { height: 100%; }
body { /* Base styles */ }
body::before { /* Gradient overlay */ }
@keyframes slideUp { /* Animation */ }
html[dir="rtl"] { /* RTL support */ }
```
**Status:** ⏳ Not started

#### Task 1.2: Create layout.css (250 lines)
Extract from **dashboard.html** lines ~461-710:
```css
.app { display: flex; }
.sidebar { width: 260px; }
.brand { }
nav { }
.nav-item { }
.main { }
.header { }
.profile { }
.avatar { }
.profile-menu { }
.content { }
```
**Status:** ⏳ Not started

#### Task 1.3: Create components.css (200 lines)
Extract from **dashboard.html** lines ~711-910:
```css
.kpi { }
.btn { }
.btn.primary { }
.btn.ghost { }
.panel { }
table { }
th, td { }
.status { }
.modal-backdrop { }
.modal { }
.form-group { }
```
**Status:** ⏳ Not started

#### Task 1.4: Create responsive.css (250 lines)
Extract from **dashboard.html** lines ~911-1160:
```css
/* @media queries for: 1140px, 980px, 768px, 480px, 380px */
html[dir="rtl"] { }
```
**Status:** ⏳ Not started

#### Task 1.5: Update dashboard.html
Remove `<style>` block, add:
```html
<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="css/dashboard.css">
```
**Status:** ⏳ Not started

#### Task 1.6: Create dashboard.css (120 lines)
Extract dashboard-specific styles from **dashboard.html**:
```css
.tab-section { }
.kpi .icon { }
.kpi .label { }
.kpi .value { }
/* ... other dashboard-specific styles ... */
```
**Status:** ⏳ Not started

#### Task 1.7: Extract page-specific CSS files
- **units.css** (150 lines) - Sheet, pricing grids, dynamic cards
- **contacts.css** (100 lines) - Filters, pagination, modals
- **aiagent.css** (100 lines) - Progress bars, roles, campaigns
- **website.css** (80 lines) - Color picker, preview

**Status:** ⏳ Not started

---

### PHASE 2: Global JavaScript (Also 100% Duplicated)

#### Task 2.1: Create utils.js (80 lines)
Extract from **any HTML file** (all have identical copies):
```javascript
function getPagePath(filename) { ... }
function saveToLocalStorage(key, data) { ... }
function getFromLocalStorage(key) { ... }
function formatDate(date) { ... }
function formatCurrency(amount, currency) { ... }
function generateId(prefix) { ... }
```
**Location:** Around line ~1650 in dashboard.html
**Status:** ⏳ Not started

#### Task 2.2: Create translations.js (600 lines)
Extract from **any HTML file** (all have identical 100% copy):
```javascript
const translations = {
  en: { dashboard: '...', units: '...', ... },
  ar: { dashboard: '...', units: '...', ... }
};

function setLanguage(lang) { ... }
function getTranslation(key) { ... }
function setCurrency(currency) { ... }
```
**Location:** Around line ~1700-2300 in dashboard.html
**Status:** ⏳ Not started

#### Task 2.3: Create auth-nav.js (180 lines)
Extract from **any HTML file**:
```javascript
// Profile menu toggle
document.getElementById('profileBtn').addEventListener('click', ...)

// Currency buttons
document.getElementById('currencyUSD').addEventListener('click', ...)
document.getElementById('currencySAR').addEventListener('click', ...)
document.getElementById('currencyEUR').addEventListener('click', ...)

// Language buttons
document.getElementById('langEnglish').addEventListener('click', ...)
document.getElementById('langArabic').addEventListener('click', ...)

// Logout
document.getElementById('logoutBtn').addEventListener('click', ...)

// Navigation
document.querySelectorAll('.nav-item').forEach(item => { ... })
```
**Location:** Around line ~1850-2050 in dashboard.html
**Status:** ⏳ Not started

#### Task 2.4: Create components.js (350 lines)
Extract from **any HTML file**:
```javascript
function openModal(content) { ... }
function closeModal() { ... }
function showConfirmation(message) { ... }
function showNotification(message) { ... }
function renderTable(data) { ... }
function sortTable(column) { ... }
function filterTable(filters) { ... }
```
**Location:** Around line ~2050-2400 in dashboard.html
**Status:** ⏳ Not started

#### Task 2.5: Create data-models.js (250 lines)
Extract from **units.html** (~line 950) - Currently only in units.html:
```javascript
class Unit {
  constructor(data) { ... }
  validate() { ... }
}

class Booking {
  constructor(data) { ... }
}

class Contact {
  constructor(data) { ... }
}
```
**Status:** ⏳ Not started

#### Task 2.6: Create supabase-client.js (250 lines) - NEW FILE
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function getCurrentUser() { ... }
export async function getUserOrganization() { ... }
export async function getUserUnits() { ... }
export async function signInWithPassword(email, password) { ... }
export async function fetchData(table, filters) { ... }
export async function insertData(table, data) { ... }
```
**Status:** ⏳ To be created

#### Task 2.7: Update all HTML files
Add to each HTML file (before closing `</body>`):
```html
<script src="js/utils.js"></script>
<script src="js/translations.js"></script>
<script src="js/auth-nav.js"></script>
<script src="js/components.js"></script>
<script src="js/data-models.js"></script>
```
**Status:** ⏳ Not started

---

### PHASE 3: Page-Specific JavaScript

#### Task 3.1: Extract dashboard.js (700 lines)
From **dashboard.html** - Everything inside the `<script>` tag except shared functions:
```javascript
let sampleBookings = [...]
let sampleUnits = [...]

function calculateOccupancy() { ... }
function calculateRevenue() { ... }
function renderKPIs() { ... }
function renderRecentBookings() { ... }
function switchSection(section) { ... }

document.addEventListener('DOMContentLoaded', () => { ... })
```
**Status:** ⏳ Not started

#### Task 3.2: Extract units.js (800 lines)
From **units.html** - All unit-specific logic:
```javascript
let unitDataset = [...]
let unitGroups = [...]

function createUnit() { ... }
function updateUnit() { ... }
function deleteUnit() { ... }
function renderTable() { ... }
function openSheet(mode, id) { ... }
function saveUnit() { ... }
function calculateAvgRate() { ... }
function addBedroom() { ... }
function renderBedrooms() { ... }

document.addEventListener('DOMContentLoaded', () => { ... })
```
**Status:** ⏳ Not started

#### Task 3.3: Extract contacts.js (600 lines)
From **contacts.html** - All contact-specific logic:
```javascript
let clientsDatabase = [...]
let filteredClients = [...]

function createContact() { ... }
function updateContact() { ... }
function deleteContact() { ... }
function renderClientsTable() { ... }
function applyFilters() { ... }
function exportClientsCSV() { ... }
function openCampaignModal() { ... }
function sendCampaign() { ... }

document.addEventListener('DOMContentLoaded', () => { ... })
```
**Status:** ⏳ Not started

#### Task 3.4: Extract aiagent.js (700 lines)
From **aiagent.html** - All AI agent logic:
```javascript
let aiAgentConfig = { ... }
let customRoles = [...]
let selectedClients = new Set()

function saveBookingMethod() { ... }
function saveDiscountSettings() { ... }
function saveWelcomeMessage() { ... }
function addCustomRole() { ... }
function removeCustomRole() { ... }
function openCampaignModal() { ... }
function sendWhatsAppCampaign() { ... }

document.addEventListener('DOMContentLoaded', () => { ... })
```
**Status:** ⏳ Not started

#### Task 3.5: Extract website.js (400 lines)
From **website.html** - All website settings logic:
```javascript
let websiteSettings = { ... }

function saveThemeColor() { ... }
function uploadHomePicture() { ... }
function showThemePreview() { ... }
function saveSettings() { ... }
function loadSettings() { ... }

document.addEventListener('DOMContentLoaded', () => { ... })
```
**Status:** ⏳ Not started

#### Task 3.6: Add page-specific JS imports
Add to each HTML file:
```html
<!-- dashboard.html -->
<script src="js/dashboard.js"></script>

<!-- units.html -->
<script src="js/units.js"></script>

<!-- contacts.html -->
<script src="js/contacts.js"></script>

<!-- aiagent.html -->
<script src="js/aiagent.js"></script>

<!-- website.html -->
<script src="js/website.js"></script>
```
**Status:** ⏳ Not started

---

### PHASE 4: Cleanup & Organization

#### Task 4.1: Create pages/ folder structure
```bash
mkdir pages/
mv dashboard.html pages/
mv units.html pages/
mv contacts.html pages/
mv aiagent.html pages/
mv website.html pages/
```
**Status:** ⏳ Not started

#### Task 4.2: Update base href in HTML files
In each `pages/*.html`, update:
```html
<!-- From: -->
<base href="/chaletdashboard/">

<!-- To: -->
<base href="/chaletdashboard/pages/">
```
**Status:** ⏳ Not started

#### Task 4.3: Create login.html (TO BE CREATED)
New authentication page:
```html
<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/components.css">
</head>
<body>
  <!-- Login form -->
  <script src="../js/utils.js"></script>
  <script src="../js/supabase-client.js"></script>
</body>
</html>
```
**Status:** ⏳ To be created

#### Task 4.4: Create lib/supabase-client.js (Production version)
Copy from `js/supabase-client.js` for production use.

**Status:** ⏳ Not started

---

## 📊 Task Summary by Phase

| Phase | Tasks | Files | Lines | Status |
|-------|-------|-------|-------|--------|
| 1 | Extract Global CSS | 4 + updates | 1,100 | ⏳ Not started |
| 2 | Extract Global JS | 6 + updates | 1,800 | ⏳ Not started |
| 3 | Extract Page-Specific JS | 5 | 3,700 | ⏳ Not started |
| 4 | Cleanup & Organization | 4 files | — | ⏳ Not started |
| **TOTAL** | **19 tasks** | **20 files** | **6,600** | **⏳ Not started** |

---

## 🎯 Priority Order (Recommended)

1. **HIGH PRIORITY - Do First!**
   - [ ] Task 1.1 → global.css (Removes 450 lines × 6 files)
   - [ ] Task 1.2 → layout.css (Removes 250 lines × 6 files)
   - [ ] Task 1.3 → components.css (Removes 200 lines × 6 files)
   - [ ] Task 1.4 → responsive.css (Removes 250 lines × 6 files)

2. **HIGH PRIORITY - Next**
   - [ ] Task 2.1 → utils.js (Removes 80 lines × 6 files)
   - [ ] Task 2.2 → translations.js (Removes 600 lines × 6 files)
   - [ ] Task 2.3 → auth-nav.js (Removes 150 lines × 6 files)

3. **MEDIUM PRIORITY**
   - [ ] Task 2.4 → components.js
   - [ ] Task 2.5 → data-models.js
   - [ ] Task 3.1 → dashboard.js
   - [ ] Task 3.2 → units.js

4. **LOWER PRIORITY**
   - [ ] Task 3.3 → contacts.js
   - [ ] Task 3.4 → aiagent.js
   - [ ] Task 3.5 → website.js
   - [ ] Task 3.6 → Add imports

5. **FINAL STEPS**
   - [ ] Task 1.5-1.7 → Page CSS files
   - [ ] Task 2.6 → supabase-client.js (NEW)
   - [ ] Task 4.1-4.4 → Organization & cleanup

---

## ✨ Expected Benefits After Completion

✅ **Reduced Duplication:** 60% → 0%  
✅ **Easier Maintenance:** Change once, applies everywhere  
✅ **Better Performance:** Browser caches shared CSS/JS  
✅ **Team Collaboration:** Clear file organization  
✅ **Scalability:** Easy to add new pages  
✅ **Code Reusability:** Component library ready  
✅ **Testing:** Modular structure enables better testing  
✅ **TypeScript Ready:** Easily convert modules to TS  

---

## 🚀 Next Action

**START WITH PHASE 1:**
1. Create `css/` folder
2. Extract `global.css`
3. Extract `layout.css`
4. Extract `components.css`
5. Extract `responsive.css`
6. Update `dashboard.html` to use new CSS files
7. **TEST** - Verify it looks identical
8. **COMMIT** changes to git
9. Repeat for other HTML files
10. Continue to PHASE 2

**Estimated time:** 30-45 minutes for PHASE 1

