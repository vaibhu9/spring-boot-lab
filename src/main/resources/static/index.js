const API_BASE = "http://localhost:9090/com.amazingcode.in/api";

const categoryForm = document.getElementById("category-form");
const productForm = document.getElementById("product-form");
const categoriesTable = document.getElementById("categories-table").querySelector("tbody");
const productsTable = document.getElementById("products-table").querySelector("tbody");
const categorySelect = document.getElementById("category-id");

let selectedCategoryId = null;
let selectedProductId = null;

// Fetch and populate categories
async function loadCategories() {
    const response = await fetch(`${API_BASE}/categories`);
    const data = await response.json();

    categoriesTable.innerHTML = "";
    categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
    data.content.forEach(category => {
        const row = categoriesTable.insertRow();
        row.innerHTML = `
            <td>${category.categoryId}</td>
            <td>${category.categoryName}</td>
            <td>
                <button onclick="editCategory(${category.categoryId}, '${category.categoryName}')">Edit</button>
                <button onclick="deleteCategory(${category.categoryId})">Delete</button>
            </td>
        `;
        const option = document.createElement("option");
        option.value = category.categoryId;
        option.text = category.categoryName;
        categorySelect.appendChild(option);
    });
}

// Fetch and populate products
async function loadProducts() {
    const response = await fetch(`${API_BASE}/products`);
    const data = await response.json();

    productsTable.innerHTML = "";
    data.content.forEach(product => {
        const row = productsTable.insertRow();
        row.innerHTML = `
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td>${product.manufactureDate}</td>
            <td>${product.expiryDate}</td>
            <td>${product.price}</td>
            <td>${product.category?.categoryName || "N/A"}</td>
            <td>
                <button onclick="editProduct(${product.productId}, '${product.productName}', '${product.manufactureDate}', '${product.expiryDate}', ${product.price}, ${product.category.categoryId})">Edit</button>
                <button onclick="deleteProduct(${product.productId})">Delete</button>
            </td>
        `;
    });
}

// Handle category form submission
categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoryName = document.getElementById("category-name").value;

    const method = selectedCategoryId ? "PUT" : "POST";
    const url = selectedCategoryId ? `${API_BASE}/categories/${selectedCategoryId}` : `${API_BASE}/categories`;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName })
    });

    categoryForm.reset();
    selectedCategoryId = null;
    loadCategories();
});

// Handle product form submission
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const productName = document.getElementById("product-name").value;
    const manufactureDate = document.getElementById("manufacture-date").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const price = parseFloat(document.getElementById("price").value);
    const categoryId = parseInt(document.getElementById("category-id").value);

    const method = selectedProductId ? "PUT" : "POST";
    const url = selectedProductId ? `${API_BASE}/products/${selectedProductId}` : `${API_BASE}/products`;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, manufactureDate, expiryDate, price, categoryId })
    });

    productForm.reset();
    selectedProductId = null;
    loadProducts();
});

// Edit category
function editCategory(id, name) {
    selectedCategoryId = id;
    document.getElementById("category-name").value = name;
}

// Delete category
async function deleteCategory(id) {
    await fetch(`${API_BASE}/categories/${id}`, { method: "DELETE" });
    loadCategories();
}

// Edit product
function editProduct(id, name, manufactureDate, expiryDate, price, categoryId) {
    selectedProductId = id;
    document.getElementById("product-name").value = name;
    document.getElementById("manufacture-date").value = manufactureDate;
    document.getElementById("expiry-date").value = expiryDate;
    document.getElementById("price").value = price;
    document.getElementById("category-id").value = categoryId;
}

// Delete product
async function deleteProduct(id) {
    await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    loadProducts();
}

// Initial load
loadCategories();
loadProducts();
