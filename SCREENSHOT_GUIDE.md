# Screenshot Guide for Documentation

## Purpose
Visual proof of UI improvements makes documentation more impactful and easier to review.

## Required Screenshots

### 1. Dashboard - Light Mode (Before/After)
**Location:** `/dashboard/documents`  
**What to capture:**
- Full page view showing:
  - Navbar with logo and theme toggle
  - Sidebar navigation
  - Page title "Documents"
  - Status filters
  - 3-5 document cards
  - Some empty space on the right

**How to take:**
1. Open http://localhost:3000/dashboard/documents
2. Ensure light mode is active (click sun/moon icon if needed)
3. Upload 3-5 test documents if list is empty
4. Take full browser window screenshot (F11 for fullscreen, then screenshot)

### 2. Dashboard - Dark Mode (Before/After)
**Same as above but:**
- Click theme toggle to switch to dark mode
- Capture the same view
- Shows color contrast improvements

### 3. Document List Close-up (After only)
**What to capture:**
- Zoomed view of 2-3 document cards
- Shows:
  - Card spacing
  - Icon padding
  - Typography hierarchy
  - Badge styling
  - Meta information

### 4. Mobile View (After only)
**What to capture:**
- Responsive layout on mobile screen size
- Shows:
  - Collapsed sidebar
  - Mobile menu button
  - Stacked filters
  - Responsive cards

**How to take:**
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select iPhone 12 Pro or similar
4. Take screenshot

## Screenshot Naming Convention

```
before-dashboard-light.png
after-dashboard-light.png
before-dashboard-dark.png
after-dashboard-dark.png
after-cards-closeup.png
after-mobile-view.png
```

## Where to Save

Save in: `C:/Users/hardi/OneDrive/Desktop/DocuVault/docs/screenshots/`

Create the directory if it doesn't exist:
```bash
mkdir -p docs/screenshots
```

## Adding to Documentation

Once screenshots are taken, update `UI_IMPROVEMENTS.md`:

```markdown
## Visual Comparison

### Light Mode
| Before | After |
|--------|-------|
| ![Before](docs/screenshots/before-dashboard-light.png) | ![After](docs/screenshots/after-dashboard-light.png) |

### Dark Mode
| Before | After |
|--------|-------|
| ![Before](docs/screenshots/before-dashboard-dark.png) | ![After](docs/screenshots/after-dashboard-dark.png) |

### Card Details (After)
![Card Close-up](docs/screenshots/after-cards-closeup.png)

### Mobile Responsive (After)
![Mobile View](docs/screenshots/after-mobile-view.png)
```

## Tips for Good Screenshots

1. **Clean browser:** Hide bookmarks bar, close unnecessary tabs
2. **Consistent zoom:** Use 100% zoom level (Ctrl+0)
3. **Full content:** Ensure all relevant UI elements are visible
4. **No personal data:** Use test documents with generic names
5. **Good lighting:** If showing dark mode, ensure screen is bright enough
6. **Annotations (optional):** Use arrows/highlights to point out key changes

## Tools

**Windows:**
- Snipping Tool (Win+Shift+S)
- Snagit (if available)
- Browser DevTools screenshot feature

**Browser DevTools:**
1. F12 to open DevTools
2. Ctrl+Shift+P (Command palette)
3. Type "screenshot"
4. Choose "Capture full size screenshot"

## Checklist

Before taking screenshots:
- [ ] Test documents uploaded (3-5 items)
- [ ] Browser zoom at 100%
- [ ] Bookmarks bar hidden
- [ ] Window size consistent between before/after
- [ ] Theme toggle working
- [ ] No personal information visible

After taking screenshots:
- [ ] Files saved with correct names
- [ ] Images are clear and readable
- [ ] File sizes reasonable (<500KB each)
- [ ] Both light and dark modes captured
- [ ] Documentation updated with image paths
