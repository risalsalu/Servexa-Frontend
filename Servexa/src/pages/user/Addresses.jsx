import AddressManager from "../../components/user/AddressManager";
import { Link } from "react-router-dom";

const Addresses = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex items-center space-x-2">
                    <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">← Back to Dashboard</Link>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Addresses</h1>
                <AddressManager />
            </div>
        </div>
    );
};

export default Addresses;
