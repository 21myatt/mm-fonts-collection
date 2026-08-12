# Burmese Text Engine

A responsive, searchable preview for **132 Myanmar font faces**, powered
by the production [`mm-fonts-cdn`](https://github.com/21myatt/mm-fonts-cdn)
catalog.

**Live site:** <https://21myatt.github.io/open-source-fonts/>

## Features

- Preview custom Myanmar text across the catalog
- Search and filter by style or source
- Adjust preview size and line height
- Copy ready-to-use `@font-face` CSS
- Download individual font files from the pinned CDN release
- Review creator, source, checksum, risk, and available license metadata
- Read complete contributor credits

The original collection was curated by
**[SaturnGod (Htain Lin Shwe)](https://github.com/saturngod/myanmar-unicode-fonts)**.
Additional sources and font creators are credited through the CDN catalog and
its [credits document](https://github.com/21myatt/mm-fonts-cdn/blob/main/CREDITS.md).

## Local development

Install dependencies, then run the app:

```sh
npm install
npm run dev
```

The app loads its catalog, font previews, downloads, and credits from the pinned
`myanmar-fonts-cdn` v1.0.1 release on jsDelivr.

## Production build

```sh
npm run build
npm run preview
```

The pinned CDN base URL is declared once in `src/App.tsx`. Update that constant
when publishing and adopting a new CDN release.

## GitHub Pages deployment

Every push to `main` runs [the Pages workflow](./.github/workflows/deploy-pages.yml):

1. Install the locked dependencies with `npm ci`.
2. Run the TypeScript and Vite production build.
3. Upload only the generated `dist` directory.
4. Deploy the artifact to GitHub Pages.

The Vite base path is `/`. The app routes `/` to the Burmese Text Engine home
and `/open-source-fonts` to the font browser. The production build also copies
`dist/index.html` to
`dist/404.html` so GitHub Pages can fall back to the SPA on direct route loads.
No deployment secrets are required; the workflow uses GitHub's short-lived
Pages identity token and repository-scoped permissions.

For the first deployment, open **Settings → Pages** in the GitHub repository
and set **Source** to **GitHub Actions**. A previous deployment can be restored
by reverting its commit on `main` and running the workflow again.

## Font licensing

This application is a catalog and preview interface; it does not grant rights
to the included fonts. Check each font's source and license metadata before
redistribution, web embedding, modification, or commercial use. See the CDN
[NOTICE](https://github.com/21myatt/mm-fonts-cdn/blob/main/NOTICE.md) for details.
