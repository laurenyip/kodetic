# Kodetic

Portfolio site for Ezra Gillera — editorial photography and mixed media.

## Live site

https://laurenyip.github.io/kodetic/

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub Pages build

```bash
# PowerShell
$env:GITHUB_PAGES="true"; npm run build
```

Static output is written to `out/`. Pushes to `main` deploy to the `gh-pages` branch via GitHub Actions.

### One-time GitHub Pages setup

Pushes to `main` deploy to `gh-pages` and the workflow tries to enable Pages automatically.

If the site still shows a GitHub 404:

1. Open [repository Pages settings](https://github.com/laurenyip/kodetic/settings/pages)
2. Set **Source** to **Deploy from a branch**
3. Branch **`gh-pages`**, folder **`/ (root)`**, then **Save**
4. Confirm the repository is **Public** (private repos need GitHub Pro for Pages)

Live URL: https://laurenyip.github.io/kodetic/

