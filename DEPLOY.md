# SiteScout — Deployment Guide
## Fix the Vercel 404 + Connect Real Google Places Data

---

## Step 1: Replace your GitHub repo files

Your repo needs this exact folder structure. Replace/create each file:

```
sitescout/
├── index.html              ← root level
├── package.json            ← root level
├── vite.config.js          ← root level
├── vercel.json             ← root level
├── .gitignore              ← root level
├── src/
│   ├── main.jsx            ← MUST be in src/
│   ├── App.jsx             ← MUST be in src/
│   ├── App.css             ← MUST be in src/
│   └── index.css           ← MUST be in src/
└── api/
    └── places.js           ← MUST be in api/ (Vercel serverless function)
```

**The 404 was happening because Vercel couldn't find `index.html` at the root, 
or the `src/` and `api/` folders were missing/misplaced.**

---

## Step 2: Add your Google Places API key to Vercel

1. Go to **vercel.com** → your SiteScout project
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `GOOGLE_PLACES_API_KEY`
   - **Value:** (paste your actual API key)
   - **Environment:** Production, Preview, Development (check all three)
4. Click **Save**

⚠️ Never put your API key directly in the code files — Vercel env vars keep it safe.

---

## Step 3: Push to GitHub

If using GitHub web UI (easiest):
- Go to your repo at github.com/farrisA-blip/sitescout
- Delete old files and upload the new ones, maintaining the folder structure above

If using git CLI:
```bash
git add .
git commit -m "Fix folder structure, add Google Places API integration"
git push origin main
```

---

## Step 4: Trigger a Vercel redeploy

Vercel auto-deploys when you push to GitHub. 
Or manually: **Vercel Dashboard → Your Project → Deployments → Redeploy**

---

## Step 5: Enable required Google APIs

In **Google Cloud Console** (console.cloud.google.com):
- Make sure **Places API** is enabled for your project
- Make sure **Places API (New)** is enabled (if you want the newer endpoint)
- Your API key should have no HTTP referrer restrictions, OR add `sitescout-pi.vercel.app/*` as allowed

---

## Step 6: Test it

1. Go to `sitescout-pi.vercel.app`
2. Enter a city like **"Houston, TX"** and type **"restaurant"**
3. You should see real businesses from Google Maps with no websites

---

## How the real data works

- `/api/places.js` is a Vercel serverless function (runs on the server, keeps your API key secret)
- It calls Google Places **Text Search** to find businesses by type + city
- Filters for **rating ≥ 4.0** and **50+ reviews**
- Then fetches **Place Details** for each to check for a `website` field
- Returns only businesses **without a website** — those are your leads

---

## Pitch-ready checklist for June 9th

- [ ] Files pushed to GitHub in correct structure
- [ ] `GOOGLE_PLACES_API_KEY` added to Vercel env vars
- [ ] App loads at sitescout-pi.vercel.app (no 404)
- [ ] Search returns real business leads
- [ ] Demo city ready (try your pitch city in advance so you know results exist)
