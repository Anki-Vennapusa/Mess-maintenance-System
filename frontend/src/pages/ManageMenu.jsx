import { useState, useEffect } from 'react';
import api from '../api';

const ManageMenu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ breakfast: '', lunch: '', dinner: '' });

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await api.get('/menu/');
            // Sort by day order if needed, or rely on backend
            // For simplicity, let's assume backend returns consistent order or we map it
            // A simple order map
            const dayOrder = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7 };
            const sortedMenu = response.data.sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
            setMenu(sortedMenu);
        } catch (error) {
            console.error("Error fetching menu", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditForm({ breakfast: item.breakfast, lunch: item.lunch, dinner: item.dinner });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ breakfast: '', lunch: '', dinner: '' });
    };

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async (id) => {
        try {
            await api.patch(`/menu/${id}/`, editForm);
            alert('Menu Updated Successfully');
            setEditingId(null);
            fetchMenu(); // Refresh
        } catch (error) {
            console.error("Error updating menu", error);
            alert('Failed to update menu');
        }
    };

    if (loading) return <div className="text-center p-10">Loading Menu...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Weekly Menu</h1>

            <div className="grid grid-cols-1 gap-6">
                {menu.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">{item.day}</h3>
                            {editingId !== item.id && (
                                <button
                                    onClick={() => handleEditClick(item)}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                                >
                                    Edit Menu
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {editingId === item.id ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Breakfast</label>
                                        <textarea
                                            name="breakfast"
                                            value={editForm.breakfast}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Lunch</label>
                                        <textarea
                                            name="lunch"
                                            value={editForm.lunch}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-2">Dinner</label>
                                        <textarea
                                            name="dinner"
                                            value={editForm.dinner}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSave(item.id)}
                                            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium shadow-md transition"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">Breakfast</span>
                                        <p className="text-gray-800 font-medium">{item.breakfast}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">Lunch</span>
                                        <p className="text-gray-800 font-medium">{item.lunch}</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">Dinner</span>
                                        <p className="text-gray-800 font-medium">{item.dinner}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {menu.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No menu items found. Please initialize the database with menu items.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMenu;
