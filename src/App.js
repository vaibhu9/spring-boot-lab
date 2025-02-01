import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CategoryManager from "./CategoryManager";
import ProductManager from "./ProductManager";
import "./App.css";

const API_BASE = "http://localhost:9090/com.amazingcode.in/api";

export default function App() {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          Category & Product Management
        </h1>
        <nav className="flex gap-4 justify-center mb-4">
          <Link to="/categories" className="btn">
            Manage Categories
          </Link>
          <Link to="/products" className="btn">
            Manage Products
          </Link>
        </nav>
        <Routes>
          <Route
            path="/categories"
            element={<CategoryManager apiBase={API_BASE} />}
          />
          <Route
            path="/products"
            element={<ProductManager apiBase={API_BASE} />}
          />
        </Routes>
      </div>
    </Router>
  );
}
