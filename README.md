# Voxel World

A browser-based voxel world.

## Run locally

Open `index.html` in a modern browser, or serve this directory with a static web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project layout

- `index.html` — application entry point and page metadata.
- `styles.css` — extracted page and Tailwind styles.
- `js/voxel-world-loader.js` — loads the numbered JavaScript fragments in order.
- `js/voxel-world-01.js` through `js/voxel-world-08.js` — consecutive pieces of the original production bundle.

The JavaScript is the production bundle from the supplied export. Its React
runtime and application code are bundled together; safely separating those
internal modules requires the original unbundled source and build configuration.


The bundle is split into consecutive source fragments to keep each file manageable in GitHub's file viewer. The loader joins them in order at runtime, so the original code executes unchanged. The fragments are not independent application modules.
