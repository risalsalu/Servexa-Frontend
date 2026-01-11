import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userShopService from "../../services/userShopService";
import bookingService from "../../services/bookingService";
import { useAuthStore } from "../../store/authStore";
import { useBookingStore } from "../../store/bookingStore";

const ShopServices = () => {
  const { id } = useParams(); // Shop ID
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setDraftBooking } = useBookingStore();

  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShopDetails();
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      setIsLoading(true);
      const data = await userShopService.getShopDetails(id);
      if (data) {
        setShop(data);
        // Backend UserShopDto typically includes services list
        if (data.services && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = (serviceId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/shop/${id}` } });
      return;
    }

    // Navigate to Create Booking Page (Mode Selection Step)
    // We pass the intention (Shop + Service) but do not create the draft yet.
    navigate("/booking/create", {
      state: {
        shopId: id,
        serviceIds: [serviceId]
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center">Loading shop details...</div>;
  if (!shop) return <div className="p-8 text-center text-red-500">Shop not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="relative bg-gray-900 h-64">
        {shop.imageUrl && (
          <img src={shop.imageUrl} alt={shop.shopName} className="w-full h-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white bg-gradient-to-t from-gray-900 to-transparent">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-bold mb-2">{shop.shopName}</h1>
            <p className="text-lg opacity-90">{shop.address}</p>
            {!shop.isActive && (
              <div className="mt-4 bg-red-600 text-white inline-block px-4 py-2 rounded font-bold">
                ⚠️ Currently Offline: {shop.offlineReason}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
          </div>

          {services.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No services available at this shop right now.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {services.map((svc) => (
                <li key={svc.serviceId || svc.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-900">{svc.name}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-1 space-x-4">
                      <span>⏱️ {svc.durationMinutes || svc.duration} mins</span>
                    </div>
                    {svc.description && <p className="text-gray-600 mt-2 text-sm">{svc.description}</p>}
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-6">
                    <span className="text-2xl font-bold text-gray-900">${svc.price}</span>
                    <button
                      onClick={() => handleBookNow(svc.serviceId || svc.id)}
                      disabled={!shop.isActive}
                      className={`px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all ${!shop.isActive
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                        }`}
                    >
                      {shop.isActive ? 'Book Now' : 'Unavailable'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopServices;
