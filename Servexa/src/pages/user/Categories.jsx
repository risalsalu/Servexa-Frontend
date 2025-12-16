import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/categoryService";
import CategoryCard from "../../components/category/CategoryCard";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            onClick={() => navigate(`/user/shops/${c.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
