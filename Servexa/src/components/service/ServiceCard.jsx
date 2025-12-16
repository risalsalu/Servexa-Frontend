export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex justify-between">
      <div>
        <h3 className="font-semibold">{service.serviceName}</h3>
        <p className="text-sm text-gray-500">
          {service.durationMinutes} minutes
        </p>
      </div>
      <div className="font-bold text-blue-600">
        ₹ {service.price}
      </div>
    </div>
  );
}
