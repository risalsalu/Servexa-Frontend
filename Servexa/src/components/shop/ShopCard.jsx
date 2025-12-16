export default function ShopCard({ shop, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow p-5 hover:shadow-lg"
    >
      <h2 className="text-lg font-semibold">{shop.shopName}</h2>
      <p className="text-sm text-gray-500">{shop.address}</p>
      <p className="text-xs text-gray-400 mt-1">
        {shop.homeServiceAvailable ? "Home Service Available" : "In-Shop Only"}
      </p>
    </div>
  );
}
