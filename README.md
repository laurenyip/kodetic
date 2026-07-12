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

1. Open [repository Pages settings](https://github.com/laurenyip/kodetic/settings/pages)
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Choose branch **`gh-pages`** and folder **`/ (root)`**
4. Save, then wait for the latest workflow run to finish

