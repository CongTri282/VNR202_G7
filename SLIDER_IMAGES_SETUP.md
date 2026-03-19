# Setup Guide for Historical Slider Images

The SectionDetailPage now includes 6 historical images in the slider section. Follow these steps to add the images:

## Instructions

1. **Save the 6 historical images** to the `src/assets/` folder with these names:
   - `vnr_historical_1.jpg` - Government officials at formal event
   - `vnr_historical_2.jpg` - Party National Congress
   - `vnr_historical_3.jpg` - Leaders greeting citizens
   - `vnr_historical_4.jpg` - Party Congress IV
   - `vnr_historical_5.jpg` - National leaders visiting mountain region
   - `vnr_historical_6.jpg` - Party leaders reviewing plans

2. **Verify the images are in the correct location:**
   ```
   src/
   └── assets/
       ├── vnr_historical_1.jpg
       ├── vnr_historical_2.jpg
       ├── vnr_historical_3.jpg
       ├── vnr_historical_4.jpg
       ├── vnr_historical_5.jpg
       └── vnr_historical_6.jpg
   ```

3. **Start the development server** if not already running:
   ```bash
   npm run dev
   ```

4. **Navigate to any detail page** (e.g., presentation page → click on a section) - You'll see the historical images in the slider at the bottom of the page, with automatic carousel functionality and navigation controls.

## How It Works

- The slider is located at the bottom of each section detail page under "Thư viện ảnh tư liệu" (Documentary Photo Library)
- Images are automatically loaded from `src/assets/vnr_historical_*.jpg`
- The data is managed in `src/data/historicalSliderImages.js`
- The component updates `SectionDetailPage.jsx` to prioritize these historical images in the slider

## Features

- **Auto-scroll**: Images automatically rotate every 3.5 seconds
- **Navigation buttons**: Use ‹ and › buttons to manually navigate
- **Dot indicators**: Click any dot to jump to a specific image
- **Responsive**: Displays 1-3 images based on screen size:
  - Mobile (≤640px): 1 image
  - Tablet (≤1080px): 2 images
  - Desktop (>1080px): 3 images
- **Lazy loading**: Images load efficiently as needed

## Files Modified

- `src/pages/SectionDetailPage.jsx` - Updated to import and use historical slider images
- `src/data/historicalSliderImages.js` - New file with image data
- `SLIDER_IMAGES_SETUP.md` - This setup guide

## Customization

To modify image descriptions, alt text, or order, edit `src/data/historicalSliderImages.js`.

## Troubleshooting

If images don't appear:
1. Check that image files are in `src/assets/` with the correct names
2. Verify the development server is running
3. Clear browser cache and reload
4. Check browser console for any error messages

