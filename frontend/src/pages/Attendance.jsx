import { useState, useEffect } from 'react';
import api from '../api';
import StaffAttendance from '../components/StaffAttendance';

const Attendance = () => {
    // Common State
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Student State
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                const userRes = await api.get('/me/');
                const userData = userRes.data;
                setUser(userData);

                if (!userData.is_staff_member) {
                    const attRes = await api.get('/attendance/');
                    setAttendance(attRes.data);
                }
            } catch (error) {
                console.error("Initialization failed", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    // --- Admin View ---
    if (user?.is_staff_member) {
        return (
            <div className="max-w-7xl mx-auto p-6 space-y-8 bg-white min-h-screen">
                <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
                <StaffAttendance />
            </div>
        );
    }

    // --- Student View ---
    const todayStr = new Date().toISOString().split('T')[0];
    const isMarkedToday = attendance.some(a => a.date === todayStr);

    // Grouping Logics
    const groupedAttendance = attendance.reduce((acc, record) => {
        const date = new Date(record.date);
        const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (!acc[monthYear]) {
            acc[monthYear] = { records: [], presentCount: 0, totalCount: 0 };
        }

        acc[monthYear].records.push(record);
        acc[monthYear].totalCount += 1;
        if (record.is_present) acc[monthYear].presentCount += 1;

        return acc;
    }, {});

    const sortedMonths = Object.keys(groupedAttendance).sort((a, b) => {
        return new Date(b) - new Date(a);
    });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>

            {/* History */}
            <div className="space-y-8">
                {attendance.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 italic text-gray-500">
                        No attendance records found.
                    </div>
                ) : (
                    sortedMonths.map(month => {
                        const { records, presentCount, totalCount } = groupedAttendance[month];
                        return (
                            <div key={month} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-bold text-gray-800">{month}</h2>
                                    <div className="flex gap-4 text-sm font-medium">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                                            Present: {presentCount}/{totalCount}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full">
                                            {Math.round((presentCount / totalCount) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto max-h-60 overflow-y-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-white">
                                            <tr className="text-gray-500 border-b border-gray-200">
                                                <th className="py-2 px-4 font-medium">Date</th>
                                                <th className="py-2 px-4 font-medium">Status</th>
                                                <th className="py-2 px-4 font-medium">Meal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {[...records].reverse().map((record) => (
                                                <tr key={record.id} className="hover:bg-gray-50">
                                                    <td className="py-2 px-4 text-gray-800">{new Date(record.date).toLocaleDateString()}</td>
                                                    <td className="py-2 px-4">
                                                        {record.is_present ? (
                                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                                                                Present
                                                            </span>
                                                        ) : (
                                                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                                                                Absent
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-4 text-gray-600 text-sm">
                                                        {record.meal_type || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Attendance;
