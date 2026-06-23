# Sandeep Sharma — Personal Website

A fast, single-page personal site built with plain HTML, CSS and vanilla JS — no build
step, no framework. Theme: **Aurora Dark** (animated aurora background, glassmorphism,
cyan→violet→pink gradient accents). Fully responsive and accessible.

## Structure

```
personal_webpage/
├── index.html                 # all content & markup
├── css/style.css              # Aurora Dark theme
├── js/main.js                 # nav, scroll reveal, count-up, active link, tilt
├── assets/
│   ├── profile.png            # hero photo
│   └── Sandeep_Sharma_CV.pdf  # downloadable CV
├── .nojekyll                  # tell GitHub Pages not to run Jekyll
└── README.md
```

## Preview locally

Any static server works. From this folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a repo. For a site at `https://<username>.github.io`, name it
   **`<username>.github.io`**; otherwise any name works (it serves at
   `https://<username>.github.io/<repo>/`).

   ```bash
   cd personal_webpage
   git init
   git add .
   git commit -m "Personal website"
   git branch -M main
   git remote add origin https://github.com/sandy283/sandy283.github.io.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**,
   branch **`main`**, folder **`/ (root)`**. Save.

3. Wait ~1 minute, then visit your Pages URL. Done.

> The `.nojekyll` file ensures every file (including ones starting with `_`) is served as-is.

## Editing content

Everything lives in `index.html` — sections are clearly commented
(`<!-- ============ EXPERIENCE ============ -->`, etc.). Colors and spacing are CSS custom
properties at the top of `css/style.css` (`:root { … }`) — change `--accent` /
`--accent-2` / `--accent-3` to re-skin the whole site.
