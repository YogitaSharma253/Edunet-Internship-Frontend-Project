
const products = [
    { id: 1, name: "Health & Personal Care", category: "Health & Personal Care", price: 499, img: "box1_image.jpg" },
    { id: 2, name: "Fashion", category: "Fashion", price: 999, img: "box2_image.jpg" },
    { id: 3, name: "Finds for Home", category: "Home & Kitchen", price: 1299, img: "box3_image.jpg" },
    { id: 4, name: "Best Sellers in Electronics", category: "Electronics", price: 4999, img: "box4_image.jpg" },
    { id: 5, name: "Beauty picks", category: "Beauty & Wellness", price: 799, img: "box5_image.jpg" },
    { id: 6, name: "Books", category: "Books & Stationery", price: 299, img: "box6_image.jpg" },
    { id: 7, name: "Study Supplies", category: "Stationery", price: 599, img: "box7_image.jpg" },
    { id: 8, name: "Discover Fashion Trends", category: "Fashion", price: 1099, img: "box8_image.jpg" },
    { id: 9, name: "Get your game on", category: "Gaming & Accessories", price: 2599, img: "box9_image.jpg" },
    { id: 10, name: "Top categories in Kitchen appliances", category: "Home & Kitchen", price: 1599, img: "box10_image.jpg" },
    { id: 11, name: "Backpacks", category: "Fashion", price: 1299, img: "box11_image.jpg" },
    { id: 12, name: "Footwear", category: "Footwear", price: 1499, img: "box12_image.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render Products
function renderProducts(filter = "All", search = "") {
    const shop = document.getElementById("shop-section");
    shop.innerHTML = "";

    products.forEach(p => {
        if ((filter === "All" || p.category === filter) &&
            p.name.toLowerCase().includes(search.toLowerCase())) {

            const div = document.createElement("div");
            div.classList.add("box");
            div.innerHTML = `
                <div class="box-content">
                    <div class="box-img" style="background-image:url('${p.img}');"></div>
              
                    <h2>${p.name}</h2>
                    <p>Price: ₹${p.price}</p>
                    <div class="card-buttons">
                      <button class="see-more-btn">See More</button>
                      <button class="add-cart-btn">Add to Cart</button>
                    </div> 
                </div>

                    
            `;

            shop.appendChild(div);

            // Add to Cart click for the new button
            const addBtn = div.querySelector(".add-cart-btn");
            addBtn.addEventListener("click", (e) => {
                e.stopPropagation();  // Prevent card click from firing
                const product = products.find(p2 => p2.name === addBtn.dataset.product);
                addToCart(p.id);
            });

            // Add click for See More button
            const seeMoreBtn = div.querySelector(".see-more-btn");
            seeMoreBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                showModal(p.id);
            });

            // Optional: keep card image clickable
            div.querySelector(".box-img").addEventListener("click", () => showModal(p.id));
        }
    });
}

// Render Cart
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "space-between";
        div.style.marginBottom = "10px";
        div.style.padding = "8px";
        div.style.border = "1px solid #ccc";
        div.style.borderRadius = "6px";
        div.style.backgroundColor = "#fff";

        div.innerHTML = `
        <div style="flex:2;">${item.name}</div>
            <div style="flex:1; text-align:center;">₹${item.price * item.qty}</div>
            <div style="flex:1; display:flex; justify-content:center; gap:5px; align-items:center;">
              <span>${item.name}</span>
              <span>Qty: ${item.qty}</span>
              <span>₹${item.price * item.qty}</span>
              <button  style="padding:2px 6px; border-radius:4px; cursor:pointer;" onclick="decreaseQty(${item.id})">-</button>
              <button style="padding:2px 6px; border-radius:4px; cursor:pointer;" onclick="increaseQty(${item.id})">+</button>
              <button  style="padding:2px 6px; border-radius:4px; cursor:pointer; background-color:#ff4d4f; color:white;" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    cartTotal.innerText = `Total: ₹${total}`;
    cartTotal.style.fontWeight = "bold";
    cartTotal.style.fontSize = "1.1rem";
    cartTotal.style.marginTop = "15px";
}

// Cart Operations
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) cartItem.qty += 1;
    else cart.push({ ...product, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function increaseQty(id) {
    const item = cart.find(c => c.id === id);
    if (item) item.qty += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function decreaseQty(id) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.qty -= 1;
        if (item.qty <= 0) removeFromCart(id);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Modal
function showModal(id) {
    const product = products.find(p => p.id === id);
    const modal = document.getElementById("product-modal");
    const modalContent = document.getElementById("modal-content");

    modalContent.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.img}" alt="${product.name}" style="width:100%; margin-bottom:10px;">
        <p>Price: ₹${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button onclick="closeModal()">Close</button>
    `;

    modal.style.display = "flex";
    setTimeout(() => modalContent.style.transform = "scale(1)", 10);
}

function closeModal() {
    const modal = document.getElementById("product-modal");
    modal.style.display = "none";
    document.getElementById("modal-content").style.transform = "scale(0.8)";
}

// Filter & Search
document.getElementById("category-filter").addEventListener("change", e => {
    renderProducts(e.target.value, document.getElementById("search-input").value);
});

document.getElementById("search-input").addEventListener("input", e => {
    renderProducts(document.getElementById("category-filter").value, e.target.value);
});

// Initialize
window.onload = function () {
    renderProducts();
    renderCart();
};