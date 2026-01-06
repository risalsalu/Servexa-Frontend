import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import serviceService from "../../services/serviceService";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const data = await serviceService.getAllShops();
      setShops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Shops</h1>
      {isLoading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200">
                {shop.imageUrl ? (
                  <img src={shop.imageUrl} alt={shop.shopName} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900">{shop.shopName}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{shop.description}</p>
                <p className="text-gray-500 mt-2 text-sm">{shop.address}</p>
                <Link
                  to={`/shop/${shop.id}`}
                  className="mt-4 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Services
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Shops;
