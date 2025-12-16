import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServicesByShop } from "../../services/serviceService";
import ServiceCard from "../../components/service/ServiceCard";

export default function ShopServices() {
  const { shopId } = useParams();
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServicesByShop(shopId).then(setServices);
  }, [shopId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Services</h1>

      <div className="grid gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
