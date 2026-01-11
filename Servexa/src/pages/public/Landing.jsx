import { useNavigate } from "react-router-dom";
import hairImage from "../../assets/images/hair-salon.jpg";
import spaImage from "../../assets/images/spa.jpg";

/**
 * Public Landing Page
 * 
 * Displays exactly two category previews: "Hair Salon" and "Spa".
 * Clicking any category redirects to /login with state.
 * NO API calls are made here.
 */
const Landing = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate("/login", {
            state: {
                redirectTo: "/dashboard",
                selectedCategory: category,
            },
        });
    };

    const categories = [
        {
            id: "hair",
            label: "Hair Salon",
            image: hairImage,
            icon: "💇",
            value: "Hair",
        },
        {
            id: "spa",
            label: "Spa",
            image: spaImage,
            icon: "💆",
            value: "Spa",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-12">
                    Explore Our Services
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category.value)}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl ring-1 ring-gray-900/5"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.label}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>

                            <div className="p-6 flex items-center justify-center space-x-4">
                                <span className="text-4xl" role="img" aria-label={category.label}>
                                    {category.icon}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {category.label}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-12 text-gray-500">
                    Sign in to view full details and book appointments.
                </p>
            </div>
        </div>
    );
};

export default Landing;
