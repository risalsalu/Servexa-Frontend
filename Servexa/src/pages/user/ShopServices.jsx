import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import serviceService from "../../services/serviceService";
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
      const data = await serviceService.getShopDetails(id);
      setShop(data);
      // Assuming API returns services inside shop object or we fetch separately. 
      // If separate: const svcs = await serviceService.getShopServices(id); 
      // Based on common patterns and prompt, let's assume 'data' has 'services' array.
      if (data.services) setServices(data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = async (serviceId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/shop/${id}` } });
      return;
    }

    try {
      // Start Draft Booking used strictly for flow
      // Spec says: POST /api/bookings/draft
      // Payload likely needs: shopId, serviceId, maybe slotId later?
      // "Cart" flow vs "Direct Booking". 
      // If "Book Now" -> Create Draft -> Redirect to Booking Flow

      const draft = await bookingService.createDraft({
        shopId: id,
        serviceId: serviceId
      });

      setDraftBooking(draft.bookingId, id);
      navigate(`/booking/${draft.bookingId}`);
    } catch (err) {
      alert("Failed to start booking");
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!shop) return <div className="p-8">Shop not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{shop.shopName}</h1>
        <p className="text-gray-600 mt-2">{shop.address}</p>
        <p className="mt-4">{shop.description}</p>
      </div>

      <h2 className="text-2xl font-bold mb-6">Services</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {services.map((svc) => (
            <li key={svc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="text-lg font-medium text-gray-900">{svc.name}</p>
                <p className="text-sm text-gray-500">{svc.duration} mins</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-gray-900">${svc.price}</span>
                <button
                  onClick={() => handleBookNow(svc.id)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Book
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShopServices;
