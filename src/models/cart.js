// cartStorage.js

const CART_KEY = 'cartItems';

// Get all items from cart
export const getCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

// Add a product to cart (and manage quantity)
export const addToCart = (product) => {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
        // Product already exists, increase quantity
        cart[index].quantity += 1;
    } else {
        // New product, set quantity = 1
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Remove a product from cart by productId
export const removeFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Decrease quantity of a product
export const decreaseQuantity = (productId) => {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            // If quantity becomes 0, remove product
            cart.splice(index, 1);
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
};

// Clear the entire cart
export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
};
