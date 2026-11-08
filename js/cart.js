// Retrieve cart from browser storage
function getCart() {
  const savedCart = localStorage.getItem("bookstore_cart");
  return savedCart ? JSON.parse(savedCart) : [];
}

// Save cart to browser storage
function saveCart(cart) {
  localStorage.setItem("bookstore_cart", JSON.stringify(cart));
}

// Add an item to the cart
function addToCart(title, price, type) {
  const cart = getCart();
  cart.push({ title, price: Number(price), type });
  saveCart(cart);
  updateCartBadge();
  alert(`${title} added to your cart!`);
}

// Remove an item by index
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartBadge();
}

// Update the badge count in the navbar
function updateCartBadge() {
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    const cart = getCart();
    countElement.textContent = cart.length;
  }
}

// Run updateCartBadge on initial page load
document.addEventListener("DOMContentLoaded", updateCartBadge);
