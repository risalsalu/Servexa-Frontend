import { useState, useEffect } from "react";
import shopService from "../../services/shopService";

const ShopServiceManager = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        categoryId: "",
        serviceName: "",
        price: "",
        duration: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [myServicesRes, catsRes] = await Promise.all([
                shopService.getMyServices(),
                shopService.getCategories()
            ]);

            // Fix: Handle ApiResponse structure. api returns { data: [...], ... } or just [...]
            // Start by assuming it might be inside .data
            const servicesData = Array.isArray(myServicesRes) ? myServicesRes : (myServicesRes.data || []);
            const categoriesData = Array.isArray(catsRes) ? catsRes : (catsRes.data || []);

            setServices(Array.isArray(servicesData) ? servicesData : []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (err) {
            console.error("Failed to load shop data", err);
            setServices([]); // Fallback to avoid crash
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await shopService.addService({
                categoryId: formData.categoryId,
                name: formData.serviceName, // Backend expects 'Name' or 'ServiceName'? Prompt says 'Assign services'
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration) // Minutes likely
            });
            loadData();
            setIsModalOpen(false);
            setFormData({ categoryId: "", serviceName: "", price: "", duration: "" });
        } catch (err) {
            alert("Failed to add service");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Remove this service?")) return;
        try {
            await shopService.deleteService(id);
            loadData();
        } catch (err) {
            alert("Failed to delete service");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Services</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Add Service
                </button>
            </div>

            {isLoading ? <p>Loading...</p> : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No services added yet</td>
                                </tr>
                            )}
                            {services.map((svc) => (
                                <tr key={svc.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{svc.name}</td>
                                    <td className="px-6 py-4 text-gray-500">${svc.price}</td>
                                    <td className="px-6 py-4 text-gray-500">{svc.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(svc.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add Service</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                        value={formData.serviceName}
                                        onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopServiceManager;
