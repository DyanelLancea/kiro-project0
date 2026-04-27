# Project Structure

```
ecommerce/
├── index.html        # Home page
├── product.html      # Product detail page
├── cart.html         # Shopping cart page
├── css/
│   └── style.css     # All styles (single stylesheet)
└── js/
    ├── data.js       # Static product and review data (globals: PRODUCTS, SAMPLE_REVIEWS)
    ├── store.js      # Cart state management via localStorage (global: Store)
    └── app.js        # Page initialization and DOM logic
```

## Conventions

### JavaScript
- Global variables only — no ES modules, no `import`/`export`
- `var` used throughout (ES5 style); avoid `let`/`const` for consistency
- Page logic is split into `initHome()`, `initProduct()`, `initCart()` — called from a single `DOMContentLoaded` listener that checks `document.body.dataset.page`
- `Store` is the sole object for cart operations; never manipulate `localStorage` directly outside of `store.js`
- New data (products, reviews) belongs in `data.js` as additions to the existing arrays

### CSS
- All styles live in `css/style.css` — no inline styles except one-off overrides in HTML
- Theming uses CSS custom properties on `:root` and `[data-theme="dark"]`; always use `var(--token)` rather than hard-coded colors
- Layout uses CSS Grid for page-level structure and Flexbox for component-level alignment
- Responsive breakpoints: `768px` (tablet) and `480px` (mobile)

### HTML
- Every page includes the same `<nav>`, `<footer>`, `<div id="toast">`, and the three `<script>` tags in the correct order
- `<body data-page="...">` must be set on each page (`home`, `product`, `cart`) for routing in `app.js`
- No external CDN links or third-party scripts
