import { useState, useEffect } from 'react';
import api from '../api';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/profiles/');
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.reg_num.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.branch && student.branch.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Student Profiles</h1>
                    <p className="text-gray-500 mt-1">Total Registered Students: {students.length}</p>
                </div>
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by Name, Reg Num, Branch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">User</th>
                                <th className="py-4 px-6 font-semibold">Reg Num</th>
                                <th className="py-4 px-6 font-semibold">Branch</th>
                                <th className="py-4 px-6 font-semibold">Year</th>
                                <th className="py-4 px-6 font-semibold">Phone</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500 italic">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.user.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                    {student.user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{student.user.username}</p>
                                                    <p className="text-xs text-gray-500">{student.user.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-gray-700 font-medium">
                                            {student.reg_num}
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">
                                            {student.branch || <span className="text-gray-400 italic">Not set</span>}
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">
                                            {student.year ? `Year ${student.year}` : <span className="text-gray-400 italic">--</span>}
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">
                                            {student.phone || <span className="text-gray-400 italic">--</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageStudents;
