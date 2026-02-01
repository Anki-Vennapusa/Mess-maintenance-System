import { useState, useEffect } from 'react';
import api from '../api';

const StaffAttendance = () => {
    const [students, setStudents] = useState([]);
    const [bulkData, setBulkData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // History Modal State
    const [showHistory, setShowHistory] = useState(false);
    const [historyStudent, setHistoryStudent] = useState(null);
    const [historyData, setHistoryData] = useState([]);

    // Filter and Sort State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'reg_num', direction: 'asc' });

    useEffect(() => {
        fetchAdminData(selectedDate);
    }, [selectedDate]); // Re-fetch when date changes

    const fetchAdminData = async (date) => {
        try {
            setLoading(true);
            const [profilesRes, attRes] = await Promise.all([
                api.get('/profiles/'),
                api.get(`/attendance/?date=${date}`)
            ]);

            setStudents(profilesRes.data);

            const attMap = {};
            attRes.data.forEach(record => {
                // Determine reg_num from student ID
                // The API returns 'student' as ID in checking standard, but let's verify if we need to map it
                // In Attendance.jsx we saw a need to map.
                const studentProfile = profilesRes.data.find(p => p.id === record.student);
                // Fallback: if backend serializer returns object, check record.student.reg_num
                // But based on previous code, it seemed to be an ID.

                // Let's rely on finding by ID from the profiles list we just fetched
                if (studentProfile) {
                    attMap[studentProfile.reg_num] = {
                        is_present: record.is_present,
                        meal_type: record.meal_type
                    };
                }
            });

            setBulkData(attMap);
        } catch (error) {
            console.error("Fetch admin data failed", error);
        } finally {
            setLoading(false);
        }
    };

    const saveBulkAttendance = async () => {
        try {
            setSaving(true);

            // Iterate over ALL students to ensure everyone gets a record
            const records = students.map(student => {
                const reg_num = student.reg_num;
                const data = bulkData[reg_num];

                // Use existing data if modified/loaded, otherwise default to Present/Veg
                return {
                    reg_num: reg_num,
                    is_present: data ? data.is_present : true,
                    meal_type: data ? (data.meal_type || 'Veg') : 'Veg'
                };
            });

            await api.post('/attendance/bulk_update/', {
                date: selectedDate,
                records
            });

            alert("Attendance saved successfully!");
            await fetchAdminData(selectedDate);
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save attendance.");
        } finally {
            setSaving(false);
        }
    };

    const handleBulkChange = (regNum, field, value) => {
        setBulkData(prev => ({
            ...prev,
            [regNum]: {
                ...prev[regNum],
                [field]: value
            }
        }));
    };

    const openHistory = async (student) => {
        setHistoryStudent(student);
        setShowHistory(true);
        setHistoryData([]);
        try {
            // student object is the profile object from profiles/ endpoint
            // It has 'user' object which has 'id'. 
            // Note: student.user is an object with id, username etc based on serializer
            const res = await api.get(`/attendance/?student_id=${student.user.id}`);
            setHistoryData(res.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    const filteredStudents = students.filter(student => {
        const term = searchTerm.toLowerCase();
        return (
            student.reg_num.toLowerCase().includes(term) ||
            student.user.username.toLowerCase().includes(term)
        );
    }).sort((a, b) => {
        if (sortConfig.key === 'status') {
            const statusA = bulkData[a.reg_num]?.is_present ? 1 : 0;
            const statusB = bulkData[b.reg_num]?.is_present ? 1 : 0;
            return sortConfig.direction === 'asc' ? statusA - statusB : statusB - statusA;
        }

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'name') {
            aValue = a.user.username;
            bValue = b.user.username;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const markAll = (isPresent) => {
        const newData = { ...bulkData };
        filteredStudents.forEach(student => {
            if (!newData[student.reg_num]) newData[student.reg_num] = { is_present: isPresent, meal_type: 'Veg' };
            newData[student.reg_num].is_present = isPresent;
        });
        setBulkData(newData);
    };

    if (loading && students.length === 0) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-800">Student Attendance List</h3>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                        <label className="font-medium text-gray-600">Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border-none focus:ring-0 text-gray-700 font-medium"
                        />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by Name or Reg Num..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => markAll(true)}
                            className="flex-1 md:flex-none bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-emerald-200"
                        >
                            Mark All Present
                        </button>
                        <button
                            onClick={() => markAll(false)}
                            className="flex-1 md:flex-none bg-rose-50 text-rose-700 hover:bg-rose-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-rose-200"
                        >
                            Mark All Absent
                        </button>
                        <div className="w-px bg-gray-300 mx-2 hidden md:block"></div>
                        <button
                            onClick={saveBulkAttendance}
                            disabled={saving}
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th onClick={() => handleSort('reg_num')} className="py-4 px-6 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none">
                                    Reg Num {sortConfig.key === 'reg_num' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('name')} className="py-4 px-6 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none">
                                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('status')} className="py-4 px-6 font-semibold text-gray-600 text-center cursor-pointer hover:bg-gray-100 transition-colors select-none">
                                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="py-4 px-6 font-semibold text-gray-600 text-center">Meal</th>
                                <th className="py-4 px-6 font-semibold text-gray-600 text-center">History</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No students found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => {
                                    const current = bulkData[student.reg_num] || { is_present: true, meal_type: 'Veg' };
                                    const isPresent = current.is_present;
                                    const mealType = current.meal_type || 'Veg';

                                    return (
                                        <tr key={student.reg_num} className={`transition-colors ${isPresent ? 'hover:bg-blue-50/30' : 'bg-red-50/30 hover:bg-red-100/30'}`}>
                                            <td className="py-3 px-6 font-medium text-gray-700">{student.reg_num}</td>
                                            <td className="py-3 px-6 text-gray-800">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{student.user.username}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <label className={`inline-flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-all border ${isPresent ? 'bg-green-100 border-green-200 shadow-sm' : 'bg-white border-gray-300'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isPresent}
                                                        onChange={(e) => handleBulkChange(student.reg_num, 'is_present', e.target.checked)}
                                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                                    />
                                                    <span className={`ml-3 text-sm font-semibold w-16 text-left select-none ${isPresent ? 'text-green-800' : 'text-gray-500'}`}>
                                                        {isPresent ? 'Present' : 'Absent'}
                                                    </span>
                                                </label>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <select
                                                    value={mealType}
                                                    disabled={!isPresent}
                                                    onChange={(e) => handleBulkChange(student.reg_num, 'meal_type', e.target.value)}
                                                    className={`block w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${!isPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <option value="Veg">Veg</option>
                                                    <option value="Non-Veg">Non-Veg</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <button
                                                    onClick={() => openHistory(student)}
                                                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                    title="View History"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* History Modal */}
            {showHistory && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                Attendance History: <span className="text-blue-600">{historyStudent?.user.username}</span>
                            </h2>
                            <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {historyData.length === 0 ? (
                                <p className="text-center text-gray-500 italic py-8">No records found or loading...</p>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-sm">
                                        <tr>
                                            <th className="py-2 px-4">Date</th>
                                            <th className="py-2 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[...historyData].reverse().map(record => (
                                            <tr key={record.id}>
                                                <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                                                <td className="py-3 px-4">
                                                    {record.is_present ? (
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Present</span>
                                                    ) : (
                                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Absent</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setShowHistory(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAttendance;
