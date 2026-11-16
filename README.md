# Company culture and benefits site

Static site. Content lives in `data/culture.json` and `data/benefits.json`; edit those and commit.

## Run locally
    python3 -m http.server 8000
Open http://localhost:8000 (opening index.html directly will not load the JSON).

## Publish on GitHub Pages (free)
1. Create a public repository on GitHub.
2. Upload all files (index.html, css/, js/, data/) to the repository root.
3. Edit `js/app.js` and set `CONFIG.owner` and `CONFIG.repo`.
4. Settings > Pages > Build and deployment > Source: "Deploy from a branch", Branch: main, Folder: / (root). Save.
5. Wait about a minute. Site: https://<username>.github.io/<repo>/
