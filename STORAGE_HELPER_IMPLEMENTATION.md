# Storage Helper Implementation Guide

**Date**: October 28, 2025  
**Commit**: 92dba06  
**Status**: ✅ Completed

## Overview

Created `js/storage.js` - a comprehensive safe localStorage wrapper with full error handling, preventing app crashes from corrupted data, quota issues, and private browsing mode.

---

## What Was Created

### File: `js/storage.js`
- **Size**: ~350 lines
- **Methods**: 16 safe functions
- **All wrapped in try/catch** with fallback values and error logging

---

## Available Methods

### Read Operations

#### `Storage.getJSON(key, fallback = {})`
Get JSON data safely with fallback
```javascript
const unitsGroups = Storage.getJSON('unitsGroups', [
  { id: 'group_1', name: 'Main Hotel' }
]);
// Returns [] if corrupted, missing, or error
```

#### `Storage.getString(key, fallback = '')`
Get string data safely
```javascript
const language = Storage.getString('language', 'en');
```

#### `Storage.getNumber(key, fallback = 0)`
Get number data safely (auto-parses)
```javascript
const count = Storage.getNumber('itemCount', 0);
```

---

### Write Operations

#### `Storage.setJSON(key, value)`
Save JSON data safely - returns boolean
```javascript
const success = Storage.setJSON('unitsGroups', groupsArray);
if (!success) console.log('Failed to save - storage full?');
```

#### `Storage.setString(key, value)`
Save string data safely - returns boolean
```javascript
Storage.setString('language', 'ar');
```

#### `Storage.setNumber(key, value)`
Save number data safely - returns boolean
```javascript
Storage.setNumber('bookingCount', 42);
```

---

### Utility Operations

#### `Storage.hasKey(key)`
Check if key exists
```javascript
if (Storage.hasKey('userPreferences')) { ... }
```

#### `Storage.remove(key)`
Remove a single key
```javascript
Storage.remove('tempData');
```

#### `Storage.removeMultiple([key1, key2, ...])`
Remove multiple keys at once
```javascript
Storage.removeMultiple(['theme', 'language', 'currency']);
```

#### `Storage.clear()`
Clear all storage
```javascript
Storage.clear(); // Clears everything
```

#### `Storage.getAllKeys()`
Get all storage keys
```javascript
const keys = Storage.getAllKeys();
// Returns: ['language', 'currency', 'theme', ...]
```

#### `Storage.getSizeInfo()`
Get storage size information
```javascript
const info = Storage.getSizeInfo();
console.log(info.approximateSizeKB); // Size in KB
console.log(info.itemCount);         // Number of items
console.log(info.keys);              // Array of all keys
```

---

### Backup & Restore

#### `Storage.exportAll()`
Export all storage as JSON (for backup)
```javascript
const backup = Storage.exportAll();
console.log(JSON.stringify(backup, null, 2));
```

#### `Storage.importData(data, merge = true)`
Import data from backup
```javascript
Storage.importData(backupData, true);  // Merge with existing
Storage.importData(backupData, false); // Replace all
```

---

### Time-Based Expiration (TTL)

#### `Storage.getWithTTL(key, ttlSeconds, fallback)`
Get value and check if expired
```javascript
const data = Storage.getWithTTL('sessionToken', 3600, null);
// Returns data if exists and not expired (within 3600 seconds)
// Returns null if expired or doesn't exist
```

#### `Storage.setWithTTL(key, value, ttlSeconds)`
Save value with expiration time
```javascript
Storage.setWithTTL('sessionToken', token, 3600); // 1 hour expiration
```

---

## Error Handling

All errors are caught and logged to console:

### Handled Errors

| Error | What Happens | Console Message |
|-------|---|---|
| **Invalid JSON** | Returns fallback, removes corrupted data | `[Storage] Invalid JSON for key...` |
| **Quota Exceeded** | Returns false, suggests cleanup | `[Storage] Quota exceeded: storage is full` |
| **Private Browsing** | Returns fallback gracefully | `[Storage] Security error: localStorage may be disabled` |
| **Missing Key** | Returns fallback (no error) | (silent) |
| **Type Mismatch** | Auto-converts or returns fallback | (depends on method) |

---

## Changes Made to calendar.html

### Before (Dangerous)
```javascript
let unitsGroups = JSON.parse(localStorage.getItem('unitsGroups')) || [];
// ❌ Crashes if JSON corrupted!

let currentLanguage = localStorage.getItem('language') || 'en';
// ❌ No error handling

localStorage.setItem('currentGroupId', value);
// ❌ Fails silently on quota exceed
```

### After (Safe)
```javascript
let unitsGroups = Storage.getJSON('unitsGroups', []);
// ✅ Returns [] if error, app continues

let currentLanguage = Storage.getString('language', 'en');
// ✅ Safe, with error logging

Storage.setString('currentGroupId', value);
// ✅ Returns boolean, can check success
```

### Updated Calls in calendar.html
1. ✅ `localStorage.getItem('currency')` → `Storage.getString('currency', 'SAR')`
2. ✅ `JSON.parse(localStorage.getItem('unitsGroups'))` → `Storage.getJSON('unitsGroups', [...])`
3. ✅ `localStorage.getItem('currentGroupId')` → `Storage.getString('currentGroupId', 'group_1')`
4. ✅ `localStorage.getItem('language')` → `Storage.getString('language', 'en')`
5. ✅ 4x `localStorage.setItem('currentGroupId')` → `Storage.setString('currentGroupId', ...)`
6. ✅ 1x `localStorage.setItem('language')` → `Storage.setString('language', ...)`
7. ✅ 4x `JSON.parse(localStorage.getItem(...))` → `Storage.getJSON(...)`
8. ✅ 4x `localStorage.setItem(..., JSON.stringify(...))` → `Storage.setJSON(...)`

**Total**: 8 dangerous calls replaced with safe equivalents

---

## How to Use in Your Pages

### Step 1: Add Script Reference
In the `<head>` section of any HTML file:
```html
<link rel="stylesheet" href="css/calendar.css">
<!-- Storage helper with error handling -->
<script src="js/storage.js"></script>
```

### Step 2: Replace localStorage Calls

Replace this pattern:
```javascript
const data = JSON.parse(localStorage.getItem('key') || '{}');
```

With this:
```javascript
const data = Storage.getJSON('key', {});
```

Replace this:
```javascript
localStorage.setItem('key', JSON.stringify(value));
```

With this:
```javascript
Storage.setJSON('key', value);
```

---

## Benefits Summary

| Benefit | Impact |
|---------|--------|
| **Prevents Crashes** | No more JSON.parse errors breaking the app |
| **Better Debugging** | Console logs show exactly what went wrong |
| **Consistent Code** | One unified way to access storage everywhere |
| **Production Ready** | Handles private mode, quota, corrupted data |
| **Easy Maintenance** | Fix bugs in one place, all files benefit |
| **Graceful Fallbacks** | App continues working even if storage fails |
| **Error Transparency** | Clear console messages for troubleshooting |
| **TTL Support** | Auto-expiring data for sessions/tokens |

---

## Next Steps

### To implement in other files:

1. **Add script reference** to each HTML file:
   ```html
   <script src="js/storage.js"></script>
   ```

2. **Find all localStorage calls** in that file:
   ```bash
   grep -n "localStorage" filename.html
   ```

3. **Replace with Storage helper**:
   - `localStorage.getItem()` → `Storage.getString()`
   - `JSON.parse(localStorage.getItem())` → `Storage.getJSON()`
   - `localStorage.setItem()` → `Storage.setString()` or `Storage.setJSON()`

4. **Commit and push**

---

## Files Already Updated

- ✅ `calendar.html` - 8 localStorage calls refactored

---

## Files Still Needing Update

- [ ] `dashboard.html` - Uses multiple localStorage calls
- [ ] `units.html` - Unit data storage
- [ ] `website.html` - Theme color, website settings
- [ ] `business-info.html` - Business information storage
- [ ] `aiagent.html` - AI Agent configuration
- [ ] `contacts.html` - Contact data storage

---

## Testing

To test the Storage helper:

```javascript
// Open browser console (F12) and try these:

// Write
Storage.setJSON('test', { message: 'Hello' });

// Read
console.log(Storage.getJSON('test', {})); // Shows: { message: 'Hello' }

// List all
console.log(Storage.getAllKeys()); 

// Get size
console.log(Storage.getSizeInfo());

// With TTL
Storage.setWithTTL('token', 'abc123', 3600); // 1 hour
console.log(Storage.getWithTTL('token', 3600)); // Returns token
```

---

## Commit History

- **92dba06**: "refactor: Create js/storage.js with safe localStorage wrapper and error handling"
  - Created js/storage.js (16 methods)
  - Refactored calendar.html (8 localStorage calls)
  - All with comprehensive error handling

---

## Questions?

The Storage helper is fully documented in code. Check `js/storage.js` for detailed JSDoc comments on each method.
