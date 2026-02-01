import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const CreateProfile = ({ onProfileCreated }) => {
    const [formData, setFormData] = useState({
        reg_num: '',
        branch: '',
        year: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/profiles/', formData);
            alert('Profile Created Successfully!');
            onProfileCreated();
        } catch (error) {
            console.error("Error creating profile", error.response?.data);
            const errorMsg = error.response?.data
                ? Object.entries(error.response.data).map(([key, val]) => `${key}: ${val}`).join('\n')
                : 'Failed to create profile. Please check your inputs.';
            alert(errorMsg);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-4">Complete Your Profile</h3>
            <p className="mb-6 text-gray-600">Please provide your student details to access the dashboard services.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Number</label>
                        <input
                            name="reg_num"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            onChange={handleChange}
                            placeholder="e.g., 123456"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Branch</label>
                        <input
                            name="branch"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            onChange={handleChange}
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Year of Study</label>
                        <input
                            name="year"
                            type="number"
                            required
                            min="1"
                            max="5"
                            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            onChange={handleChange}
                            placeholder="e.g., 2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            required
                            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            onChange={handleChange}
                            placeholder="e.g., 9876543210"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md mt-6">
                    Save Profile
                </button>
            </form>
        </div>
    );
};

const StudentDashboard = ({ user, profile }) => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [bill, setBill] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Menu
                const menuRes = await api.get('/menu/');
                setMenu(menuRes.data);

                // Fetch Attendance
                const attRes = await api.get('/attendance/');
                setAttendance(attRes.data);

                // Fetch Bills
                const billRes = await api.get('/bills/');
                if (billRes.data.length > 0) {
                    // Sort by ID descending to show the latest bill
                    const sortedBills = billRes.data.sort((a, b) => b.id - a.id);
                    setBill(sortedBills[0]);
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayMenu = menu.find(m => m.day === todayDay);

    // Monthly Attendance Logic
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthName = new Date().toLocaleString('default', { month: 'long' });

    const thisMonthPresent = attendance.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && a.is_present;
    }).length;

    const downloadInvoice = () => {
        if (!bill) return;
        const doc = new jsPDF();

        // Colors
        const primaryColor = [29, 78, 216]; // Blue 700
        const secondaryColor = [55, 65, 81]; // Gray 700

        // 1. Header Section with Background
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("S.V.U. College of Commerce, Management & Computer Science", 105, 18, null, null, "center");
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Hostel For Men, Tirupathi", 105, 28, null, null, "center");

        // 2. Invoice Details
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("MESS BILL INVOICE", 14, 55);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Month: ${bill.month}`, 14, 62);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 68);

        // Student Details Grid
        doc.setDrawColor(200, 200, 200);
        doc.line(14, 72, 196, 72);

        doc.setFont("helvetica", "bold");
        doc.text("Student Details:", 14, 80);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${user.username}`, 14, 86);
        doc.text(`Reg No: ${profile.reg_num}`, 14, 92);
        doc.text(`Branch: ${profile.branch}`, 100, 86);
        doc.text(`Year: ${profile.year}`, 100, 92);

        // 3. Calculation Data preparation
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const pDays = attendance.filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear && a.is_present;
        }).length;
        const abDays = daysInMonth - pDays;
        const vegCount = attendance.filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear && a.is_present && a.meal_type === 'Veg';
        }).length;
        const nvCount = attendance.filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear && a.is_present && a.meal_type === 'Non-Veg';
        }).length;

        const dailyRate = parseFloat(bill.daily_rate || 0);
        const nvPlateRate = parseFloat(bill.nv_plate_rate || 0);
        const roomRent = parseFloat(bill.room_rent || 0);
        const water = parseFloat(bill.water_charges || 0);
        const electricity = parseFloat(bill.electricity_charges || 0);
        const establishment = parseFloat(bill.establishment_charges || 0);

        const foodCost = (pDays * dailyRate) + (nvCount * nvPlateRate);
        const fixedCost = roomRent + water + electricity + establishment;

        // 4. Table
        autoTable(doc, {
            startY: 100,
            head: [['Description', 'Days/Count', 'Rate', 'Amount (₹)']],
            body: [
                ['Food Charges (Veg/Base)', pDays + ' Days', dailyRate.toFixed(2), (pDays * dailyRate).toFixed(2)],
                ['Non-Veg Add-ons', nvCount + ' Plates', nvPlateRate.toFixed(2), (nvCount * nvPlateRate).toFixed(2)],
                ['Room Rent', '-', '-', roomRent.toFixed(2)],
                ['Water Charges', '-', '-', water.toFixed(2)],
                ['Electricity Charges', '-', '-', electricity.toFixed(2)],
                ['Establishment Charges', '-', '-', establishment.toFixed(2)],
                [{ content: 'TOTAL AMOUNT DUE', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, { content: bill.amount, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]
            ],
            theme: 'grid',
            headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 9, textColor: secondaryColor },
            footStyles: { fillColor: [240, 240, 240] }
        });



        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("This is an electronically generated invoice.", 105, pageHeight - 10, null, null, "center");
        doc.text("S.V.U. Hostel Application - Minor Project", 105, pageHeight - 6, null, null, "center");

        doc.save(`Mess_Bill_${bill.month}_${profile.reg_num}.pdf`);
    };

    return (
        <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h3 className="text-2xl font-bold">{user.username}</h3>
                        <p className="opacity-90">{profile.branch} | Year {profile.year}</p>
                        <p className="text-sm opacity-75 mt-1">Reg: {profile.reg_num}</p>
                    </div>
                    <div className="mt-4 md:mt-0 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <span className="font-medium">Status: </span>
                        <span className="font-bold text-green-300">Active</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Menu Card */}
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-orange-500 border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <span className="text-2xl mr-2">🍽️</span> Today's Menu
                    </h3>
                    {todayMenu ? (
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="font-medium text-gray-500">Breakfast</span>
                                <span className="text-gray-900">{todayMenu.breakfast}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="font-medium text-gray-500">Lunch</span>
                                <span className="text-gray-900">{todayMenu.lunch}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-500">Dinner</span>
                                <span className="text-gray-900">{todayMenu.dinner}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Menu not updated for {todayDay}.</p>
                    )}
                </div>

                {/* Attendance Card */}
                <div
                    onClick={() => navigate('/attendance')}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-green-500 border border-gray-200 cursor-pointer group"
                >
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <span className="text-2xl mr-2">📅</span> Attendance
                    </h3>
                    <div className="flex flex-col items-center justify-center py-4">
                        <span className="text-5xl font-extrabold text-green-600 transition group-hover:scale-110 duration-300">{thisMonthPresent}</span>
                        <span className="text-gray-500 mt-2 font-medium">Days Present in {monthName}</span>
                        <p className="text-xs text-center text-green-500 mt-3 font-semibold group-hover:underline">View Monthly History &rarr;</p>
                    </div>
                </div>

                {/* Bill Card */}
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-red-500 border border-gray-200 flex flex-col">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <span className="text-2xl mr-2">🧾</span> Bill Status
                    </h3>
                    {bill ? (
                        <div className="flex flex-col flex-1 justify-between">
                            <div>
                                <p className="text-lg font-semibold text-gray-600">{bill.month}</p>
                                <p className="text-3xl font-bold text-gray-900 my-2">₹ {bill.amount}</p>
                            </div>
                            <div className="mt-4 space-y-3">
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold w-full block text-center ${bill.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {bill.is_paid ? 'PAID' : 'DUE'}
                                </span>
                                <button
                                    onClick={downloadInvoice}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm font-bold hover:bg-green-50 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-400">
                            No pending bills
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import StaffAttendance from '../components/StaffAttendance';

const StaffDashboard = ({ user }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
            <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-2">Admin Control Panel</h3>
                <p className="text-lg text-gray-600 mb-6">Welcome, <span className="font-bold text-blue-600">{user.username}</span></p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        onClick={() => navigate('/manage-students')}
                        className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                    >
                        <h4 className="font-bold text-green-600 mb-2">Manage Students</h4>
                        <p className="text-sm text-gray-600">View and manage student profiles and details.</p>
                    </div>
                    <div
                        onClick={() => navigate('/manage-menu')}
                        className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                    >
                        <h4 className="font-bold text-green-600 mb-2">Update Menu</h4>
                        <p className="text-sm text-gray-600">Set weekly breakfast, lunch, and dinner.</p>
                    </div>
                    <div
                        onClick={() => navigate('/manage-bills')}
                        className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                    >
                        <h4 className="font-bold text-purple-600 mb-2">Billing</h4>
                        <p className="text-sm text-gray-600">Generate and track monthly mess bills.</p>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Quick Attendance</h3>
                <StaffAttendance />
            </div>
        </div>
    );
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            // For student, try to fetch profile
            const profileRes = await api.get('/profiles/');
            if (profileRes.data && profileRes.data.length > 0) {
                setProfile(profileRes.data[0]);
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.error("Profile Fetch Error", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const userRes = await api.get('/me/');
                setUser(userRes.data);

                if (!userRes.data.is_staff_member) {
                    await fetchProfile();
                }
            } catch (error) {
                console.error("Auth Error", error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [navigate]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {user.is_staff_member ? (
                <StaffDashboard user={user} />
            ) : (
                <>
                    {profile ? (
                        <StudentDashboard user={user} profile={profile} />
                    ) : (
                        <CreateProfile onProfileCreated={fetchProfile} />
                    )}
                </>
            )}
        </div>
    );
}
