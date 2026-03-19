# 🧪 Testing Guide: R2 Storage & UI Improvements

## ✅ What Was Fixed

### Backend (R2 Storage Key Issue)
- Files now upload to Cloudflare R2
- `storageKey` is saved to database
- Signed URLs generate correctly
- No more `{Key}` placeholder errors

### Frontend (UI/UX Improvements)
- Better spacing and breathing room
- Clear visual hierarchy
- Simplified status filters
- Narrower sidebar (224px)
- Better dark mode contrast
- Improved layout balance

## 🧪 Testing Steps

### 1. Test Frontend UI
1. Open http://localhost:3000 in your browser
2. Login to your account
3. Navigate to Documents page
4. **Check:**
   - ✅ Page title is large and bold (4xl)
   - ✅ Sidebar is narrower (224px)
   - ✅ Content has good spacing
   - ✅ Status filters are simplified (inline format)
   - ✅ Dark mode has good contrast

### 2. Test Theme Toggle
1. Click the Sun/Moon icon in navbar
2. **Check:**
   - ✅ Background changes color
   - ✅ Text colors invert
   - ✅ Preference persists on reload
   - ✅ Icon switches (Sun ↔ Moon)

### 3. Test File Upload (R2 Fix)
1. Go to Upload page
2. Upload a test document (PDF, image, etc.)
3. **Check backend logs for:**
   ```
   🔑 Generated storage key: uploads/cm.../1738865234567-a1b2c3d4-filename.pdf
   ✅ File uploaded to R2 successfully
   ✅ Document created in DB with storageKey: uploads/...
   ```
4. **Verify:**
   - ✅ Document appears in list
   - ✅ Has proper name and status badge

### 4. Test File Download (Critical!)
1. Click the ⋮ menu on a document
2. Click "Download"
3. **Check backend logs for:**
   ```
   📥 Download request - User: cm... Document: cm...
   📄 Document found: filename.pdf
   🔑 Storage key: uploads/cm.../...
   🔑 Generating signed URL for key: uploads/...
   ✅ Signed URL generated successfully
   📍 URL preview: https://ea67385c489c06ed22882a7815876b98.r2...
   ```
4. **Verify:**
   - ✅ File downloads successfully
   - ✅ No `SignatureDoesNotMatch` error
   - ✅ No `{Key}` in URL

### 5. Test Old Documents
If you have documents uploaded **before** the fix:
1. Try to download an old document
2. **Expected behavior:**
   ```
   ❌ CRITICAL: Document has no storageKey!
   Error: "Document storage key is missing. Please re-upload this document."
   ```
3. **Action:** Delete old documents and re-upload them

## 🔍 Troubleshooting

### Theme Toggle Not Working?
**Check browser console:**
```javascript
// Should toggle between true/false
localStorage.getItem('darkMode')

// Should contain 'dark' class when dark mode is on
document.documentElement.classList
```

**If broken:**
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Download Fails?
**Check backend logs for:**
- ❌ `storageKey is null` → Document needs re-upload
- ❌ `Invalid storageKey: contains placeholder` → Backend code issue
- ❌ `SignatureDoesNotMatch` → R2 credentials or region issue

**Verify R2 credentials in `.env`:**
```bash
R2_ENDPOINT=https://...r2.cloudflarestorage.com
R2_BUCKET=docuvault
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
```

### Upload Fails?
**Check backend logs for:**
- ❌ `R2 upload failed` → Check R2 credentials
- ❌ `Failed to upload file to storage` → Network or permissions issue

**Verify Cloudflare R2:**
1. Login to Cloudflare dashboard
2. Go to R2 → Buckets
3. Verify `docuvault` bucket exists
4. Check API tokens are valid

## 📊 Expected Results

### Successful Upload Flow:
```
1. User uploads file
2. Backend generates unique storage key
3. File uploaded to R2
4. Database record created with storageKey
5. Document appears in list
```

### Successful Download Flow:
```
1. User clicks download
2. Backend finds document
3. Validates storageKey exists
4. Generates signed URL
5. User downloads file
```

### UI Improvements:
```
Before: Cluttered, tight spacing, weak hierarchy
After:  Clean, generous spacing, clear hierarchy
```

## ✅ Success Criteria

- [ ] Can upload new documents
- [ ] Documents appear in list with correct info
- [ ] Can download documents successfully
- [ ] No `{Key}` errors in logs
- [ ] Theme toggle works
- [ ] UI feels less cluttered
- [ ] Visual hierarchy is clear
- [ ] Sidebar is narrower
- [ ] Dark mode has good contrast

## 🎉 All Tests Pass?

If everything works:
1. Delete any old documents (before the fix)
2. Re-upload important files
3. Enjoy your improved DocuVault! 🚀

## 📝 Notes

- **Old documents** won't work - they need to be re-uploaded
- **Theme preference** is saved in localStorage
- **Signed URLs** expire after 5 minutes
- **Storage keys** are unique per upload
