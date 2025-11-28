import { Link } from "react-router-dom";

export default function LandingCard() {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Servexa</h1>
      <p className="text-gray-600 mb-8">
        Manage your salon and spa bookings with ease
      </p>

      <div className="flex flex-col gap-4">
        <Link
          to="/user/login"
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700"
        >
          Continue as User
        </Link>

        <Link
          to="/shop/login"
          className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700"
        >
          Continue as Shop Owner
        </Link>

        <Link
          to="/admin/login"
          className="w-full bg-gray-800 text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-900"
        >
          Continue as Admin
        </Link>
      </div>
    </div>
  );
}
