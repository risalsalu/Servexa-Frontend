export default function CategoryCard({ category, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow p-5 hover:shadow-lg"
    >
      <h2 className="text-lg font-semibold">{category.name}</h2>
      <p className="text-sm text-gray-500 mt-1">
        {category.description}
      </p>
    </div>
  );
}
