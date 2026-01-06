import { useState, useEffect } from "react";
import adminUserService from "../../services/adminUserService";

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const data = await adminUserService.getCustomers();
            // Defensive check: Ensure it is an array
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch customers", err);
            setCustomers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            // Toggle logic: If true (Active) -> become false (Blocked)
            const newStatus = !currentStatus;
            await adminUserService.updateCustomerStatus(id, newStatus);
            fetchCustomers();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await adminUserService.deleteUser(id);
            fetchCustomers();
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Manage Customers</h2>
            {isLoading ? <p>Loading...</p> : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(!customers || customers.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No customers found</td>
                                </tr>
                            )}
                            {Array.isArray(customers) && customers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.fullName || user.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-500">{user.phoneNumber || user.phone}</td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => handleStatusChange(user.id, user.isActive)}>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.isActive ? 'Active' : 'Blocked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default CustomerManager;
