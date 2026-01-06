import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">Servexa</h1>
                    <div className="space-x-4">
                        <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                        <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Service booking made easy
                </h2>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Find services, book slots, and manage everything in one place.
                </p>
                <div className="mt-8 flex justify-center">
                    <Link to="/categories" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Browse Categories
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Landing;
