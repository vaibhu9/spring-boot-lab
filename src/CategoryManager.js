import { useState, useEffect } from "react";

function CategoryManager({ apiBase }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const response = await fetch(`${apiBase}/categories`);
    const data = await response.json();
    console.log("Categories data:", data); // Log the categories data
    setCategories(data.content || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = selectedCategoryId ? "PUT" : "POST";
    const url = selectedCategoryId
      ? `${apiBase}/categories/${selectedCategoryId}`
      : `${apiBase}/categories`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryName }),
    });
    setCategoryName("");
    setSelectedCategoryId(null);
    loadCategories();
  }

  async function deleteCategory(id) {
    await fetch(`${apiBase}/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-green-600 text-2xl mb-4">Categories</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            required
            className="input w-full sm:w-auto"
          />
          <button type="submit" className="btn w-full sm:w-auto">
            {selectedCategoryId ? "Update" : "Add"}
          </button>
        </form>
        <table className="table-auto w-full mt-6 border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(({ categoryId, categoryName }) => (
              <tr key={categoryId} className="border-b hover:bg-gray-100">
                <td className="p-2 text-center">{categoryId}</td>
                <td className="p-2">{categoryName}</td>
                <td className="p-2 flex justify-center  gap-2">
                  <button
                    onClick={() => {
                      setCategoryName(categoryName);
                      setSelectedCategoryId(categoryId);
                    }}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(categoryId)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryManager;
