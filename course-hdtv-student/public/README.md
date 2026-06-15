# /public — Web Root

This folder is the deployment root. Everything here is served at `course.hypnoticdreamtv.com/`.

## Subfolders

### /videos
Module video files. Name them consistently:

```
mod1_videohdtv.mp4     ← Module 1
mod2_videohdtv.mp4     ← Module 2
mod3_videohdtv.mp4     ← Module 3
mod4_videohdtv.mp4     ← Module 4
mod5_videohdtv.mp4     ← Module 5
mod6_videohdtv.mp4     ← Module 6
mod7_videohdtv.mp4     ← Module 7
```

Recommended specs: H.264, 1080p, AAC audio, max 4GB per file.  
For large files, consider Vimeo/Wistia embed or Vercel Blob Storage.

### /images
Static images used in the portal:

```
instructor-photo.jpg       ← Instructor profile (used in #instructor section)
hdtv-logo.png              ← Brand logo
hdtv-og-banner.jpg         ← Social share / Open Graph (1200×630px)
hero-bg.jpg                ← Optional hero background
```

### /thumbnails
Module and advanced course card thumbnails:

```
mod1-thumb.jpg
mod2-thumb.jpg
...
mod7-thumb.jpg
advanced-course-1.jpg
advanced-course-2.jpg
advanced-course-3.jpg
advanced-course-4.jpg
```
Recommended size: 800×500px, JPEG, <150KB each.

### /documents
Student-facing downloadable PDFs:

```
Module1_Student_Guide_HDTV.pdf
Module1_Worksheet_HDTV.pdf
Module2_Student_Guide_HDTV.pdf
Module2_Worksheet_HDTV.pdf
...
```

## Notes
- `.gitkeep` files exist only to track empty folders in git — safe to delete once real files are added.
- Video files > 100MB should be tracked via **Git LFS** (`git lfs track "*.mp4"`) or hosted externally.
