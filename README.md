# LoveLens Wedding Photography: proposed demo site

Static HTML/CSS/vanilla JS. No build step. Prepared as a MeroTech sales demo; it is **not** an official LoveLens site.

## Run locally
`python3 -m http.server 8000` in this folder, then open http://localhost:8000 (or just open `index.html`).

## Replace placeholder photos
Placeholders are abstract SVGs in `assets/images/` (sizes listed in `_manifest.json`).
1. Add your optimised JPG/WebP files using the same base names (e.g. `hero-wedding.jpg`; about 1600px wide for hero, 800 to 1200px for others).
2. Hero, about and service images: edit the `src` in `index.html`. Add meaningful alt text; hero/services use empty alt (decorative).
3. Portfolio: edit `GALLERY` in `js/main.js` (id, category, width, height, alt) and set `EXT` to `".jpg"`/`".webp"`. Add or remove entries freely.
4. Replace the about alt text with the photographer's real photo description.

## Edit content
- Services, headlines, copy: `index.html` (services are marked UNVERIFIED in comments: confirm or delete each).
- Gallery categories: `CATEGORIES` in `js/main.js`. Remove any LoveLens does not offer.
- Colours/fonts: CSS variables at the top of `css/style.css`.
- Footer links Instagram only. No address, phone, email, prices, reviews or stats were invented.

## Connect the enquiry form
**Status: demo-only.** With `FORM_ENDPOINT = ""` the form validates and shows a "not sent" message; it never claims delivery.
To go live: create a form on a service such as Formspree or Web3Forms, paste its endpoint URL into `FORM_ENDPOINT` in `js/main.js`. Success is shown only when the server returns an OK response. Never place secret keys in the frontend (public form IDs are fine). Confirm the destination email/WhatsApp with LoveLens first.

## Deploy to GitHub Pages
1. Create a GitHub repo and push these files to the `main` branch root:
   `git init && git add . && git commit -m "LoveLens demo" && git branch -M main && git remote add origin <repo-url> && git push -u origin main`
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save**.
3. After about a minute the site is at `https://<username>.github.io/<repo>/`.

## Before going live
Confirm services and categories; replace all placeholders; add a real favicon/Open Graph image only from supplied assets; connect the form.
