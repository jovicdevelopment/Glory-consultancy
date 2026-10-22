# Life Consultancy (static website)
HTML + Tailwind (CDN) + vanilla JS. Tailwind CDN is used so there is no build step; swap to the Tailwind CLI later if you want a purged CSS file.
## Run
`npx serve .` or `python3 -m http.server 8000` → http://localhost:8000
## Edit
- Shared nav/footer/CTA and the 7 services: `js/main.js`
- Products: `js/resources.js` (array `P`); detail pages use `resource-detail.html?id=<slug>`
- Page copy: edit the HTML directly, or edit `build.py` and run `python3 build.py`
- Images: drop files in `assets/images/` and replace the `.ph` placeholder divs with `<img alt="…">`
- Contact form: validation only; connect Formspree/Netlify Forms in `js/contact.js`
## Deploy
Upload the folder to Netlify, Vercel (static), GitHub Pages or Cloudflare Pages. For clean URLs (/services) enable the host's "pretty URLs".

How to maintain it

Where things live

To change...	Edit...
Colors, fonts, buttons, spacing	css/styles.css (the variables at the top, e.g. --brn for the brown accent)
Navbar, footer, closing call-to-action, the 7 services	js/main.js
The 6 products and cart logic	js/resources.js
Form validation	js/contact.js
Page copy	The HTML files directly
Images	Put files in assets/images/ and replace the .ph placeholder blocks with <img> tags