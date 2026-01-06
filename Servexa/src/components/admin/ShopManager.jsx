import { useState, useEffect } from "react";
import adminUserService from "../../services/adminUserService";

const ShopManager = () => {
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            setIsLoading(true);
            const data = await adminUserService.getShopOwners();
            setShops(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch shops", err);
            setShops([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await adminUserService.updateShopOwnerStatus(id, newStatus);
            fetchShops();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this shop owner?")) return;
        try {
            await adminUserService.deleteUser(id);
            fetchShops();
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Manage Shop Owners</h2>
            {isLoading ? <p>Loading...</p> : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(!shops || shops.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No shop owners found</td>
                                </tr>
                            )}
                            {Array.isArray(shops) && shops.map((shop) => (
                                <tr key={shop.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{shop.fullName || shop.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{shop.shopName || "-"}</td>
                                    <td className="px-6 py-4 text-gray-500">{shop.email}</td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => handleStatusChange(shop.id, shop.isActive)}>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${shop.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {shop.isActive ? 'Active' : 'Pending/Blocked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(shop.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShopManager;
