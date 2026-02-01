import { useState, useEffect } from 'react';
import api from '../api';

const ManageBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        month: '',
        daily_rate: '',
        nv_plate_rate: '',
        room_rent: '150',
        water_charges: '125',
        electricity_charges: '150',
        establishment_charges: '275'
    });

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await api.get('/bills/');
            setBills(response.data);
        } catch (error) {
            console.error("Error fetching bills", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!window.confirm(`Generate bills for ${formData.month}?`)) return;

        try {
            const response = await api.post('/bills/generate_bills/', formData);
            alert(response.data.message);
            fetchBills();
            setFormData({
                month: '',
                daily_rate: '',
                nv_plate_rate: '',
                room_rent: '150',
                water_charges: '125',
                electricity_charges: '150',
                establishment_charges: '275'
            });
        } catch (error) {
            console.error("Error generating bills", error);
            alert('Failed to generate bills.');
        }
    };

    // ... markAsPaid ...

    const markAsPaid = async (id) => {
        if (!window.confirm('Mark this bill as Paid?')) return;
        try {
            await api.patch(`/bills/${id}/`, { is_paid: true });
            fetchBills();
        } catch (error) {
            console.error("Error updating bill", error);
            alert("Failed to update bill.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Billing Management</h1>

            {/* Generate Bills Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center">
                    <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">💰</span>
                    Generate Monthly Bills
                </h2>
                <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Month & Year</label>
                        <input
                            name="month"
                            type="month"
                            required
                            value={formData.month}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Daily Rate (Veg)</label>
                        <input
                            name="daily_rate"
                            type="number"
                            required
                            placeholder="e.g., 65"
                            value={formData.daily_rate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">NV Add-on Rate</label>
                        <input
                            name="nv_plate_rate"
                            type="number"
                            required
                            placeholder="e.g., 27"
                            value={formData.nv_plate_rate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Fixed Charges Breakdown */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Room Rent</label>
                        <input
                            name="room_rent"
                            type="number"
                            required
                            placeholder="150"
                            value={formData.room_rent}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Water Charges</label>
                        <input
                            name="water_charges"
                            type="number"
                            required
                            placeholder="125"
                            value={formData.water_charges}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Electricity</label>
                        <input
                            name="electricity_charges"
                            type="number"
                            required
                            placeholder="150"
                            value={formData.electricity_charges}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Establishment</label>
                        <input
                            name="establishment_charges"
                            type="number"
                            required
                            placeholder="275"
                            value={formData.establishment_charges}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition shadow-md md:col-span-1"
                    >
                        Generate Bills
                    </button>
                </form>
            </div>

            {/* Bills List */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-700">Recent Bills</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : bills.length === 0 ? (
                    <p className="text-gray-500 italic">No bills generated yet.</p>
                ) : (
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-white">
                                <tr className="text-gray-500 border-b border-gray-200">
                                    <th className="py-3 px-4 font-medium">Student Name</th>
                                    <th className="py-3 px-4 font-medium">Student Reg. No</th>
                                    <th className="py-3 px-4 font-medium">Month</th>
                                    <th className="py-3 px-4 font-medium">Amount</th>
                                    <th className="py-3 px-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[...bills].reverse().map((bill) => (
                                    <tr key={bill.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 text-gray-800 font-medium">
                                            {bill.student_name}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                                            {bill.student_reg_num}
                                        </td>
                                        <td className="py-3 px-4 text-gray-800">{bill.month}</td>
                                        <td className="py-3 px-4 text-gray-800">₹{bill.amount}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${bill.is_paid
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {bill.is_paid ? 'Paid' : 'Unpaid'}
                                                </span>
                                                {!bill.is_paid && (
                                                    <button
                                                        onClick={() => markAsPaid(bill.id)}
                                                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBills;
