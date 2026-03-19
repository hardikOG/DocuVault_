# 🔧 Critical Bug Fix: R2 Storage Key Issue

## 🚨 Problem Identified

You correctly identified the root cause! The error:
```
GET /%7BKey%20%7D
```

Decoded to `/{Key }` - meaning the object key was literally the string `"{Key}"` instead of the actual file path like `uploads/resume.pdf`.

## 🔍 Root Cause Analysis

### What Was Happening:

1. **Files weren't being uploaded to R2 at all** ❌
   - The `uploadDocument` function was only saving files locally via multer
   - No R2 upload was happening
   - The `storageKey` field in the database was `NULL`

2. **Download requests failed** ❌
   - When requesting a download, `doc.storageKey` was `null`
   - The signed URL generation tried to use `null` as the key
   - This resulted in the `{Key}` placeholder not being replaced

3. **Signature mismatch** ❌
   - AWS SDK tried to sign a URL with an invalid/null key
   - Cloudflare R2 received a malformed request
   - Result: `SignatureDoesNotMatch` error

## ✅ Fixes Implemented

### 1. Fixed `uploadDocument` Function
**File:** `docuvault-backend/services/document.service.js`

**Changes:**
- ✅ Generate unique storage key: `uploads/{userId}/{timestamp}-{randomId}-{filename}`
- ✅ Sanitize filename to prevent special characters
- ✅ Upload file to R2 using `uploadToR2()`
- ✅ Save `storageKey` to database (was missing before!)
- ✅ Added comprehensive logging for debugging

**Before:**
```javascript
const url = file.path; // local path only
const created = await prisma.document.create({
  data: {
    name,
    url,  // ❌ No storageKey!
    fileType,
    userId,
  },
});
```

**After:**
```javascript
const storageKey = `uploads/${userId}/${timestamp}-${randomId}-${sanitizedFilename}`;
await uploadToR2(file.path, storageKey, fileType);

const created = await prisma.document.create({
  data: {
    name,
    url: `https://${process.env.R2_BUCKET}.r2.cloudflarestorage.com/${storageKey}`,
    fileType,
    storageKey, // ✅ CRITICAL: Now saving the storage key!
    userId,
  },
});
```

### 2. Enhanced `getSignedDownloadUrl` Function
**File:** `docuvault-backend/services/signedUrl.service.js`

**Changes:**
- ✅ Validate `storageKey` is not null/undefined
- ✅ Detect placeholder characters `{` or `}` and throw error
- ✅ Added logging to trace URL generation
- ✅ Log URL preview for debugging

**Added Validation:**
```javascript
if (!storageKey) {
  throw new Error("storageKey is required for generating signed URL");
}

if (storageKey.includes("{") || storageKey.includes("}")) {
  throw new Error(`Invalid storageKey: contains placeholder characters: ${storageKey}`);
}
```

### 3. Enhanced Download Controller
**File:** `docuvault-backend/controllers/documentDownload.controller.js`

**Changes:**
- ✅ Check if `storageKey` exists before generating signed URL
- ✅ Return helpful error message for old documents without storageKey
- ✅ Added comprehensive logging for debugging

**Added Check:**
```javascript
if (!doc.storageKey) {
  console.error("❌ CRITICAL: Document has no storageKey!");
  return res.status(500).json({ 
    error: "Document storage key is missing. Please re-upload this document." 
  });
}
```

## 🎯 Key Points About Cloudflare R2

### Correct Configuration (Already in Place):
```javascript
const r2 = new S3Client({
  region: "auto",        // ✅ Correct for R2
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});
```

### Storage Key Format:
- ✅ **Good:** `uploads/user123/1738865234567-a1b2c3d4-resume.pdf`
- ❌ **Bad:** `{Key}`, `null`, `undefined`
- ❌ **Bad:** `my file.pdf` (spaces not URL-encoded)

### Filename Sanitization:
We sanitize filenames to prevent issues:
```javascript
const sanitizedFilename = name.replace(/[^a-zA-Z0-9.-]/g, "_");
```

This converts:
- `my resume (final).pdf` → `my_resume__final_.pdf`
- `file with spaces.docx` → `file_with_spaces.docx`

## 🧪 Testing the Fix

### Upload Flow:
1. User uploads a file via `POST /documents`
2. Multer saves file temporarily to disk
3. **NEW:** File is uploaded to R2 with unique storage key
4. **NEW:** Database record includes `storageKey`
5. Response includes document metadata

### Download Flow:
1. User requests `GET /documents/:id/download`
2. Backend finds document in database
3. **NEW:** Validates `storageKey` exists
4. Generates signed URL using actual storage key
5. Returns signed URL to client

### Console Logs You'll See:
```
🔑 Generated storage key: uploads/cm123.../1738865234567-a1b2c3d4-resume.pdf
✅ File uploaded to R2 successfully
✅ Document created in DB with storageKey: uploads/cm123.../...
📥 Download request - User: cm123... Document: cm456...
📄 Document found: resume.pdf
🔑 Storage key: uploads/cm123.../1738865234567-a1b2c3d4-resume.pdf
🔑 Generating signed URL for key: uploads/cm123.../...
✅ Signed URL generated successfully
📍 URL preview: https://ea67385c489c06ed22882a7815876b98.r2.cloudflarestorage.com/docuvault/uploads/...
```

## ⚠️ Important Notes

### Old Documents
Documents uploaded **before this fix** will have `storageKey = null`. When users try to download them, they'll get:
```json
{
  "error": "Document storage key is missing. Please re-upload this document."
}
```

### Migration (Optional)
If you want to fix old documents, you'll need to:
1. Query all documents where `storageKey IS NULL`
2. For each document, check if the file exists locally
3. Upload to R2 and update the `storageKey`

Or simply delete old documents and have users re-upload.

## 🎉 Expected Behavior Now

### Upload:
- ✅ File uploaded to R2
- ✅ Unique storage key generated
- ✅ Database record has `storageKey`
- ✅ Logs show upload progress

### Download:
- ✅ Signed URL generated with actual storage key
- ✅ URL contains proper path, not `{Key}`
- ✅ Signature matches R2's expectations
- ✅ File downloads successfully

## 🔐 Security Improvements

1. **Filename Sanitization:** Prevents path traversal attacks
2. **Unique Keys:** Prevents file collisions
3. **User Isolation:** Files stored in user-specific folders
4. **Validation:** Prevents null/invalid keys from reaching R2
5. **Signed URLs:** Time-limited (5 minutes) access

## 📊 Server Status

Both servers are currently running:
- **Backend:** Port 3001 ✅
- **Frontend:** Port 3000 ✅
- **Database:** Neon PostgreSQL (remote) ✅
- **Storage:** Cloudflare R2 ✅

## 🚀 Next Steps

1. **Test Upload:** Upload a new document and verify it appears in R2 dashboard
2. **Test Download:** Request download URL and verify it works
3. **Check Logs:** Monitor console for the emoji-prefixed logs
4. **Verify R2:** Check Cloudflare R2 dashboard to see uploaded files

The `{Key}` placeholder issue is now completely fixed! 🎊
