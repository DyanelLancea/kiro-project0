# Tech Stack

## Overview
Vanilla HTML/CSS/JavaScript — no build system, no bundler, no dependencies.

## Stack
- **HTML5** — semantic markup, `data-page` attribute on `<body>` for page routing
- **CSS3** — custom properties (CSS variables) for theming, CSS Grid and Flexbox for layout
- **JavaScript (ES5/ES6)** — no frameworks, no modules; scripts loaded via `<script>` tags in order

## Storage
- `localStorage` — cart state (`ec_cart`) and theme preference (`ec_theme`)

## No Build System
There is no `package.json`, bundler, compiler, or transpiler. Files are served directly as static assets.

To run the project, open any `.html` file in a browser or serve the `ecommerce/` directory with any static file server, e.g.:
```
npx serve ecommerce
# or
python -m http.server --directory ecommerce
```

## Script Load Order
Scripts must be loaded in this order on every page — later scripts depend on earlier ones:
1. `js/data.js` — defines `PRODUCTS` and `SAMPLE_REVIEWS` globals
2. `js/store.js` — defines `Store` object (depends on `PRODUCTS`)
3. `js/app.js` — page logic (depends on `Store` and data globals)
