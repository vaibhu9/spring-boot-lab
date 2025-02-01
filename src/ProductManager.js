import { useState, useEffect } from "react";

function ProductManager({ apiBase }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    productName: "",
    manufactureDate: "",
    expiryDate: "",
    price: "",
    category: "",
  });
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  async function loadProducts() {
    const response = await fetch(`${apiBase}/products`);
    const data = await response.json();
    console.log("Products data:", data); // Log the products data
    setProducts(data.content || []);
  }

  async function loadCategories() {
    const response = await fetch(`${apiBase}/categories`);
    const data = await response.json();
    console.log("Categories data:", data); // Log the categories data

    setCategories(data.content || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = selectedProductId ? "PUT" : "POST";
    const url = selectedProductId
      ? `${apiBase}/products/${selectedProductId}`
      : `${apiBase}/products`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    setProductData({
      productName: "",
      manufactureDate: "",
      expiryDate: "",
      price: "",
      categoryId: "",
    });
    setSelectedProductId(null);
    loadProducts();
  }

  async function deleteProduct(id) {
    await fetch(`${apiBase}/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-green-600 text-2xl mb-4">Products</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
          <input
            type="text"
            value={productData.productName}
            onChange={(e) =>
              setProductData({ ...productData, productName: e.target.value })
            }
            placeholder="Product Name"
            required
            className="input w-full sm:w-auto"
          />
          <input
            type="date"
            value={productData.manufactureDate}
            onChange={(e) =>
              setProductData({
                ...productData,
                manufactureDate: e.target.value,
              })
            }
            required
            className="input w-full sm:w-auto"
          />
          <input
            type="date"
            value={productData.expiryDate}
            onChange={(e) =>
              setProductData({ ...productData, expiryDate: e.target.value })
            }
            required
            className="input w-full sm:w-auto"
          />
          <input
            type="number"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
            placeholder="Price"
            step="0.01"
            required
            className="input w-full sm:w-auto"
          />
          <select
            value={productData.categoryId}
            onChange={(e) =>
              setProductData({ ...productData, categoryId: e.target.value })
            }
            required
            className="input w-full sm:w-auto"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map(({ categoryId, categoryName }) => (
              <option key={categoryId} value={categoryId}>
                {categoryName}
              </option>
            ))}
          </select>
          <button type="submit" className="btn w-full sm:w-auto">
            {selectedProductId ? "Update" : "Add"}
          </button>
        </form>

        {/* Only render products once categories are loaded */}
        {categories.length > 0 && products.length > 0 && (
          <table className="table-auto w-full mt-6 border border-gray-200">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Manufacture Date</th>
                <th className="p-2">Expiry Date</th>
                <th className="p-2">Price</th>
                <th className="p-2">Category</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(
                ({
                  productId,
                  productName,
                  manufactureDate,
                  expiryDate,
                  price,
                  category,
                }) => (
                  <tr key={productId} className="border-b hover:bg-gray-100">
                    <td className="p-2 text-center">{productId}</td>
                    <td className="p-2">{productName}</td>
                    <td className="p-2">{manufactureDate}</td>
                    <td className="p-2">{expiryDate}</td>
                    <td className="p-2">${price}</td>
                    <td className="p-2">{category.categoryName}</td>
                    <td className="p-2 flex justify-center gap-2">
                      <button
                        onClick={() =>
                          setProductData({
                            productName,
                            manufactureDate,
                            expiryDate,
                            price,
                            category,
                          }) || setSelectedProductId(productId)
                        }
                        className="btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(productId)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductManager;
