# HDTV — Course Student Portal

**HypnoticDream TV | Men's Mastery Program**  
Deployed at → `course.hypnoticdreamtv.com`

---

## Overview

This repository holds the student-facing training portal for the **HDTV Sex Ed 101 — Men's Mastery Program**. It is a static HTML course site styled after Teachable/Udemy and themed to the HDTV brand (dark navy, electric cyan, gold).

---

## Project Structure

```
course-hdtv-student/
├── public/                  # Web root — deploy this folder
│   ├── index.html           # Main course portal page
│   ├── videos/              # Module video files (mod_videohdtv.mp4, etc.)
│   ├── images/              # Course images, instructor photos, banners
│   ├── thumbnails/          # Module and course card thumbnail images
│   └── documents/           # Student guides, worksheets (PDF)
├── src/                     # Source files for future JS/CSS builds
├── assets/                  # Design assets, brand files, raw exports
└── README.md
```

---

## Media Naming Convention

| File | Location | Description |
|------|----------|-------------|
| `mod_videohdtv.mp4` | `public/videos/` | Placeholder — replace per module (mod1_videohdtv.mp4, etc.) |
| `module-{N}-thumb.jpg` | `public/thumbnails/` | Thumbnail for each module card |
| `instructor-photo.jpg` | `public/images/` | Instructor profile photo |
| `hdtv-og-banner.jpg` | `public/images/` | Open Graph / social share banner |
| `Module1_Student_Guide.pdf` | `public/documents/` | Downloadable student guide |

---

## Deployment

### Vercel (Recommended)
```bash
# From project root
vercel --prod
```
Set the **Output Directory** to `public` in Vercel project settings.  
Assign the custom domain: `course.hypnoticdreamtv.com`

### Manual / Any Static Host
Upload the contents of `public/` to your host's web root.  
Point the `course` subdomain DNS A/CNAME record to your host.

---

## Brand Tokens

| Token | Value |
|-------|-------|
| Dark background | `#0a0a0a` / `#111318` |
| Card background | `#161b24` |
| Gold accent | `#c9a84c` |
| Gold light | `#e8c97a` |
| Text | `#d4cfc6` |
| Muted | `#7a8099` |
| Headline font | Cormorant Garamond (Google Fonts) |
| Body font | DM Sans (Google Fonts) |

---

## Modules

| # | Title | Theme |
|---|-------|-------|
| 1 | Reclaim Your Wandering Attention | Focus & Intentionality |
| 2 | Turn Raw Desire Into Focused Power | Drive & Transmutation |
| 3 | Build That Calm, Unshakable Masculine Edge | Composure & Presence |
| 4 | Become the Man She Can't Stop Thinking About | Presence, Polarity & Purpose |
| 5 | Mastering Emotional Intelligence | Self-Awareness & Regulation |
| 6 | Communication That Commands Respect | Language, Assertion & Clarity |
| 7 | The Integration — Becoming That Man | Identity & Long-Term Embodiment |

---

## Contact & Support

- Support email: `support@hypnoticdreamtv.com`
- Domain: `hypnoticdreamtv.com`
- Course subdomain: `course.hypnoticdreamtv.com`
- Vercel team: `hypnovala`
