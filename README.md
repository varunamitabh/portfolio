# Varun Amitabh — Portfolio

Single-page portfolio site (React + Vite) designed for recruiters: hero, about,
skills, projects (with PDF report links), experience, education, IEEE
publications, and a contact form powered by Netlify Forms.

## Run locally

```bash
npm install
npm run dev
```

Note: the contact form only actually delivers messages when deployed on
Netlify — locally the submit will hit the error state.

## Before deploying

1. Put your resume at `public/resume.pdf`.
2. Put project report PDFs in `public/reports/` — see
   `public/reports/README.md` for the expected filenames.
3. All site content lives in the constant blocks at the top of
   `src/Portfolio.jsx` (`PROFILE`, `INTRO`, `FEATURED_PROJECTS`,
   `SIDE_PROJECTS`, `EXPERIENCE`, `SKILLS`, `PUBLICATIONS`, `EDUCATION`,
   `INTERESTS`). Colours, type and motion live as tokens at the top of
   `src/styles.css`.

## Deploy to Netlify

1. Push this folder to a GitHub repo.
2. On [netlify.com](https://netlify.com): **Add new site → Import an existing
   project → GitHub** and pick the repo. `netlify.toml` already sets the build
   command (`npm run build`) and publish directory (`dist`), so accept the
   defaults and deploy.
3. Enable form notifications so submissions reach your inbox: **Site
   configuration → Forms → Form notifications → Add notification → Email**,
   and point it at username@your_domain.com. (Netlify also stores every
   submission in the Forms tab regardless.)
4. Optional: change the site name (Site configuration → Site details) to get a
   cleaner URL or attach a custom domain.
