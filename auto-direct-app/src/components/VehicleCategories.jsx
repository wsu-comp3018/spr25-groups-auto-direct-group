import getImageUrl from "./getImageUrl";
import { useNavigate } from "react-router-dom";

// List of vehicle categories to display
// Each object includes name, description, and image path
const categories = [
	{
		name: "Everyday and Convenience",
		desc: "Cars that give you all you need for everyday living.",
		image: getImageUrl('../../public/assets/hatch.png'),
		filter: { bodyType: ["Hatchback", "Sedan"] },
	},
	{
		name: "Families and Road Trippers",
		desc: "Cars with ample space for those who need to move people or pack heavy.",
		image: getImageUrl('../../public/assets/suv.png'),
		filter: { bodyType: ["SUV", "Wagon, Van"] },
	},
	{
		name: "Work and Play",
		desc: "Tough vehicles built for hard work during the week, and fun play on the weekend.",
		image: getImageUrl('../../public/assets/ute.png'),
		filter: { bodyType: ["Ute", "Cab Chassis, Van"] },
	},
	{
		name: "Environmentally Conscious",
		desc: "Electric vehicles for those with the environment in mind.",
		image: getImageUrl('../../public/assets/tesla-model.png'),
		filter: { fuel: ["Electric"] }
	},
];

// React functional component to render the vehicle categories section
const VehicleCategories = () => {
    const navigate = useNavigate();

    const handleSeeAllClick = (filterParams) => {
        const params = new URLSearchParams();

        for (const key in filterParams) {
            if (filterParams.hasOwnProperty(key)) {
                const values = filterParams[key];
                if (Array.isArray(values) && values.length > 0) {
                    params.append(key, values.join(','));
                }
            }
        }

        // Navigate to the browse page with the constructed parameters
        navigate(`/browse?${params.toString()}`);
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            {/* Tabs for vehicle type selection - only 'New' is active for now */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8 text-lg">
                    <span className="font-semibold border-b-2 border-black-600 text-black pb-2 cursor-pointer">
                        Discover vehicles
                    </span>
                </nav>
            </div>

            {/* Grid of category cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Map through the categories array to generate a card for each category */}
                {categories.map((category) => (
                    <div key={category.name} className="group">
                        {/* Image container with hover effect */}
                        <div className="overflow-hidden rounded-md shadow-md">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        {/* Text content */}
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{category.desc}</p>
                            <button
                                onClick={() => handleSeeAllClick(category.filter)}
                                className="text-sm font-semibold text-black-600 mt-2 inline-block hover:underline bg-transparent border-none p-0 cursor-pointer" // Style as link
                            >
                                See them all →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VehicleCategories;
