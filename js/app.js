// ─── Theme ────────────────────────────────────────────────────────────────────

function initTheme() {
  var saved = localStorage.getItem('ec_theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ec_theme', theme);
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function updateCartBadge() {
  var badge = document.getElementById('cart-badge');
  if (badge) {
    var count = Store.getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

function stars(rating) {
  var s = '';
  for (var i = 1; i <= 5; i++) s += i <= rating ? '★' : '☆';
  return s;
}

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2200);
}

// ─── Home page ───────────────────────────────────────────────────────────────

function initHome() {
  var grid = document.getElementById('product-grid');
  if (!grid) return;

  PRODUCTS.forEach(function (p) {
    var card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML =
      '<div class="product-emoji">' + p.emoji + '</div>' +
      '<div class="product-info">' +
        '<span class="product-category">' + p.category + '</span>' +
        '<h3 class="product-name">' + p.name + '</h3>' +
        '<p class="product-price">$' + p.price.toFixed(2) + '</p>' +
      '</div>' +
      '<a class="btn btn-primary" href="product.html?id=' + p.id + '">View Product</a>';
    grid.appendChild(card);
  });

  updateCartBadge();
}

// ─── Product page ─────────────────────────────────────────────────────────────

function initProduct() {
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get('id'), 10);
  var product = Store.getProduct(id);

  if (!product) {
    document.getElementById('product-detail').innerHTML =
      '<p class="error">Product not found. <a href="index.html">Go back</a></p>';
    return;
  }

  document.title = product.name + ' — ShopMart';
  document.getElementById('product-detail').innerHTML =
    '<div class="product-image-box">' + product.emoji + '</div>' +
    '<div class="product-meta">' +
      '<span class="product-category">' + product.category + '</span>' +
      '<h1>' + product.name + '</h1>' +
      '<p class="detail-price">$' + product.price.toFixed(2) + '</p>' +
      '<p class="detail-desc">' + product.description + '</p>' +
      '<div class="qty-row">' +
        '<label for="qty">Quantity:</label>' +
        '<div class="qty-control">' +
          '<button onclick="changeQty(-1)">−</button>' +
          '<input id="qty" type="number" value="1" min="1" max="99">' +
          '<button onclick="changeQty(1)">+</button>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn-primary btn-large" onclick="addToCartFromPage(' + product.id + ')">🛒 Add to Cart</button>' +
      '<a class="btn btn-outline" href="cart.html">View Cart</a>' +
    '</div>';

  // Reviews
  var reviewsEl = document.getElementById('reviews');
  if (reviewsEl) {
    var html = '<h2>Customer Reviews</h2>';
    SAMPLE_REVIEWS.forEach(function (r) {
      html +=
        '<div class="review-card">' +
          '<div class="review-header">' +
            '<span class="review-avatar">' + r.avatar + '</span>' +
            '<strong>' + r.user + '</strong>' +
            '<span class="review-stars">' + stars(r.rating) + '</span>' +
          '</div>' +
          '<p>' + r.comment + '</p>' +
        '</div>';
    });
    reviewsEl.innerHTML = html;
  }

  updateCartBadge();
}

function changeQty(delta) {
  var input = document.getElementById('qty');
  var val = parseInt(input.value, 10) + delta;
  input.value = Math.max(1, Math.min(99, val));
}

function addToCartFromPage(productId) {
  var qty = parseInt(document.getElementById('qty').value, 10) || 1;
  Store.addToCart(productId, qty);
  updateCartBadge();
  showToast('Added to cart!');
}

// ─── Cart page ───────────────────────────────────────────────────────────────

function initCart() {
  renderCart();
  updateCartBadge();
}

function renderCart() {
  var cart = Store.getCart();
  var container = document.getElementById('cart-items');
  var summaryEl = document.getElementById('cart-summary');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="empty-cart">' +
        '<span>🛒</span>' +
        '<p>Your cart is empty.</p>' +
        '<a class="btn btn-primary" href="index.html">Start Shopping</a>' +
      '</div>';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (summaryEl) summaryEl.style.display = '';

  var total = 0;
  var html = '';

  cart.forEach(function (item) {
    var p = Store.getProduct(item.id);
    if (!p) return;
    var subtotal = p.price * item.quantity;
    total += subtotal;
    html +=
      '<div class="cart-row" id="cart-row-' + p.id + '">' +
        '<div class="cart-emoji">' + p.emoji + '</div>' +
        '<div class="cart-item-info">' +
          '<a href="product.html?id=' + p.id + '" class="cart-item-name">' + p.name + '</a>' +
          '<span class="cart-item-price">$' + p.price.toFixed(2) + ' each</span>' +
        '</div>' +
        '<div class="cart-qty-control">' +
          '<button onclick="cartChangeQty(' + p.id + ', -1)">−</button>' +
          '<input type="number" value="' + item.quantity + '" min="1" max="99" ' +
            'onchange="cartSetQty(' + p.id + ', this.value)">' +
          '<button onclick="cartChangeQty(' + p.id + ', 1)">+</button>' +
        '</div>' +
        '<div class="cart-subtotal">$' + subtotal.toFixed(2) + '</div>' +
        '<button class="btn-remove" onclick="cartRemove(' + p.id + ')" title="Remove">✕</button>' +
      '</div>';
  });

  container.innerHTML = html;

  document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
  document.getElementById('item-count').textContent =
    cart.reduce(function (s, i) { return s + i.quantity; }, 0);
}

function cartChangeQty(productId, delta) {
  var cart = Store.getCart();
  var item = cart.find(function (i) { return i.id === productId; });
  if (!item) return;
  var newQty = item.quantity + delta;
  if (newQty <= 0) {
    cartRemove(productId);
  } else {
    Store.updateQuantity(productId, newQty);
    renderCart();
    updateCartBadge();
  }
}

function cartSetQty(productId, value) {
  var qty = parseInt(value, 10);
  if (isNaN(qty) || qty <= 0) {
    cartRemove(productId);
  } else {
    Store.updateQuantity(productId, qty);
    renderCart();
    updateCartBadge();
  }
}

function cartRemove(productId) {
  Store.removeFromCart(productId);
  renderCart();
  updateCartBadge();
  showToast('Item removed.');
}

function cartClear() {
  if (confirm('Clear your entire cart?')) {
    Store.clearCart();
    renderCart();
    updateCartBadge();
  }
}

function cartCheckout() {
  alert('🎉 Order placed! Thank you for shopping with ShopMart.');
  Store.clearCart();
  renderCart();
  updateCartBadge();
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

// Apply theme immediately to avoid flash of wrong theme
(function () { initTheme(); })();

document.addEventListener('DOMContentLoaded', function () {
  initTheme(); // re-run to sync button icon once DOM is ready
  updateCartBadge();
  var page = document.body.dataset.page;
  if (page === 'home')    initHome();
  if (page === 'product') initProduct();
  if (page === 'cart')    initCart();
});
