# ShopMart — Product Overview

ShopMart is a client-side e-commerce storefront. Users can browse a product catalog, view individual product detail pages, manage a shopping cart, and simulate checkout.

## Key Features
- Product listing grid with category badges and pricing
- Product detail page with quantity selector and customer reviews
- Persistent shopping cart via `localStorage`
- Light/dark theme toggle with `localStorage` persistence
- Toast notifications for user feedback
- Responsive layout for mobile and desktop

## Pages
| File | Purpose |
|---|---|
| `index.html` | Home — product grid + hero banner |
| `product.html` | Product detail — image, description, qty, add-to-cart, reviews |
| `cart.html` | Cart — line items, quantity controls, order summary, checkout |

## Data
- Products and sample reviews are static arrays defined in `js/data.js`
- No backend or API — all state lives in the browser
