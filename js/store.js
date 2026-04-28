// LocalStorage keys
var CART_KEY = 'ec_cart';

var Store = {
  getCart: function () {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  saveCart: function (cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  addToCart: function (productId, quantity) {
    var cart = Store.getCart();
    var existing = cart.find(function (i) { return i.id === productId; });
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity: quantity });
    }
    Store.saveCart(cart);
  },

  updateQuantity: function (productId, quantity) {
    var cart = Store.getCart();
    var item = cart.find(function (i) { return i.id === productId; });
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        Store.removeFromCart(productId);
        return;
      }
    }
    Store.saveCart(cart);
  },

  removeFromCart: function (productId) {
    var cart = Store.getCart().filter(function (i) { return i.id !== productId; });
    Store.saveCart(cart);
  },

  clearCart: function () {
    localStorage.removeItem(CART_KEY);
  },

  getCartCount: function () {
    return Store.getCart().reduce(function (sum, i) { return sum + i.quantity; }, 0);
  },

  getProduct: function (id) {
    return PRODUCTS.find(function (p) { return p.id === id; }) || null;
  }
};
