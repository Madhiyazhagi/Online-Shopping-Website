/* ================= ULTRA PRO LEVEL JS ================= */

/* ---------- HAMBURGER MENU TOGGLE ---------- */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

/* ---------- CART MANAGEMENT ---------- */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to Cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showCartPopup(name);
    updateCartCount();
}

// Remove from Cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Update Quantity
function updateQuantity(index, value) {
    cart[index].quantity = parseInt(value);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Display Cart on cart.html
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)"></td>
            <td>$${subtotal.toFixed(2)}</td>
            <td><button class="btn btn-remove" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button></td>
        `;
        cartItemsContainer.appendChild(tr);
    });

    totalEl.textContent = total.toFixed(2);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert(`Checkout successful! Total: $${cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartIcon = document.querySelector('.nav-links a[href="cart.html"]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (!cartIcon) return;

    if (!cartIcon.querySelector('.cart-count')) {
        const span = document.createElement('span');
        span.className = 'cart-count';
        cartIcon.appendChild(span);
    }
    cartIcon.querySelector('.cart-count').textContent = count;
}

/* ---------- CART POPUP ANIMATION ---------- */
function showCartPopup(name) {
    const popup = document.createElement('div');
    popup.className = 'cart-popup';
    popup.textContent = `${name} added to cart!`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2500);
}

/* ---------- HERO TYPING ANIMATION ---------- */
const typingText = document.querySelector('.hero-content h1');
if (typingText) {
    const fullText = typingText.textContent;
    typingText.textContent = '';
    let i = 0;
    const typingInterval = setInterval(() => {
        typingText.textContent += fullText[i];
        i++;
        if (i >= fullText.length) clearInterval(typingInterval);
    }, 100);
}

/* ---------- PRODUCTS FILTER & SORT (products.html) ---------- */
const productGrid = document.querySelector('.product-grid');
const categorySelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');

if (productGrid && categorySelect && sortSelect) {
    const products = Array.from(productGrid.children).map(card => ({
        card,
        name: card.querySelector('h3').textContent,
        price: parseFloat(card.querySelector('.product-info p').textContent.replace('$', '')),
        category: card.querySelector('h3').textContent.toLowerCase()
    }));

    function filterAndSort() {
        const category = categorySelect.value;
        const sort = sortSelect.value;

        let filtered = products;

        if (category !== 'all') {
            filtered = filtered.filter(p => p.category.includes(category));
        }

        if (sort === 'low') filtered.sort((a, b) => a.price - b.price);
        if (sort === 'high') filtered.sort((a, b) => b.price - a.price);

        productGrid.innerHTML = '';
        filtered.forEach(p => productGrid.appendChild(p.card));
    }

    categorySelect.addEventListener('change', filterAndSort);
    sortSelect.addEventListener('change', filterAndSort);
}

/* ---------- INITIALIZE ---------- */
displayCart();
updateCartCount();