import { useState, useEffect } from 'react';
import api from '../api';

const StudentMenu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await api.get('/menu/');
            const dayOrder = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7 };
            const sortedMenu = response.data.sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
            setMenu(sortedMenu);
        } catch (error) {
            console.error("Error fetching menu", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-12">
                <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-3 inline-block">Weekly Meal Plan</span>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Mess Menu</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Check out the delicious and nutritious meals prepared for you this week.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menu.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <span className="mr-2">📅</span> {item.day}
                            </h3>
                        </div>

                        <div className="p-6 flex-grow flex flex-col gap-6">
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="text-xl mr-2">🍳</span>
                                    <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Breakfast</span>
                                </div>
                                <p className="text-gray-700 font-medium pl-8">{item.breakfast || "Not specified"}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="text-xl mr-2">🍛</span>
                                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Lunch</span>
                                </div>
                                <p className="text-gray-700 font-medium pl-8">{item.lunch || "Not specified"}</p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="text-xl mr-2">🌙</span>
                                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Dinner</span>
                                </div>
                                <p className="text-gray-700 font-medium pl-8">{item.dinner || "Not specified"}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {menu.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-lg">No menu items found for this week.</p>
                </div>
            )}
        </div>
    );
};

export default StudentMenu;
