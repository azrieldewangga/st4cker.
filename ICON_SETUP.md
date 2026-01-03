# Icon Setup Guide for st4cker

## Current Issue
App is using default Electron icon in taskbar. We need to create and add a custom icon.

## Steps to Fix

### 1. Create Icon File

You need to create `icon.ico` file with these specifications:
- **Format:** Windows ICO
- **Sizes included:** 16x16, 32x32, 48x48, 64x64, 128x128, 256x256 pixels
- **Location:** Save as `d:\Project\CampusDash\public\icon.ico`

### 2. Tools to Create Icon

**Option A: Online Converter (Recommended - Easiest)**
1. Go to: https://convertio.co/png-ico/ or https://www.icoconverter.com/
2. Upload a square PNG image (512x512 or 1024x1024 recommended)
3. Download the generated `.ico` file
4. Rename to `icon.ico` and place in `public/` folder

**Option B: Using GIMP (Free Software)**
1. Download GIMP: https://www.gimp.org/downloads/
2. Open your image
3. Export as → ICO format
4. Select multiple sizes when prompted

**Option C: Using icon-gen (npm)**
```bash
npm install -g icon-gen
icon-gen -i your-image.png -o public --icns --ico
```

### 3. Configuration Already Done
✅ Package.json already updated with:
```json
"win": {
  "icon": "public/icon.ico"
}
```

### 4. Rebuild After Adding Icon
```bash
npm run build
```

## Icon Design Recommendations

For st4cker, consider:
- 📚 Book/stack icon (matches "stacker" theme)
- 🎓 Graduation cap
- 📊 Dashboard/graph icon
- 📝 Notebook icon
- Use brand colors (blue/emerald from app)
- Keep design simple and recognizable at small sizes

## Quick Fix: Use Emoji as Icon

If you want a quick placeholder:
1. Go to https://favicon.io/emoji-favicons/
2. Search for "books" 📚 or "notebook" 📓
3. Download and convert to ICO

---

**After adding the icon file, rebuild with `npm run build` to see changes!**
