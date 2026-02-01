import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import svuBuilding from '../assets/svu_building.jpg';
import logo from '../assets/logo.jpg';


const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (localStorage.getItem('access_token')) {
                    const res = await api.get('/me/');
                    setUser(res.data);
                }
            } catch (error) {
                console.log("Not logged in");
            }
        };
        fetchUser();
    }, []);
    const features = [
        {
            title: "Hygienic & Fresh",
            description: "We prioritize cleanliness and use fresh ingredients to ensure healthy meals for every student.",
            icon: "🥗"
        },
        {
            title: "Nutritious Menu",
            description: "A balanced diet plan crafted to meet the nutritional needs of students throughout the week.",
            icon: "📋"
        },
        {
            title: "Affordable Pricing",
            description: "Quality food provided at subsidized rates to make it pocket-friendly for all students.",
            icon: "💰"
        },
        {
            title: "Digital System",
            description: "Hassle-free management of mess bills, attendance, and feedback through our online portal.",
            icon: "💻"
        }
    ];

    return (
        <div className="flex flex-col gap-16 pb-12">
            {/* Hero Section */}
            <div
                className="w-full min-h-[calc(100vh-64px)] bg-cover bg-fixed bg-center flex items-center justify-center relative shadow-2xl overflow-hidden group"
                style={{
                    backgroundImage: `url(${svuBuilding})`,
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/60"></div>

                {/* Content */}
                <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto h-[calc(100vh-64px)] flex flex-col justify-between pt-10 pb-20">

                    <div>
                        <img
                            src={logo}
                            alt="SVU Logo"
                            className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white/20 hover:border-green-400 transition-all duration-500 shadow-2xl hover:shadow-green-500/50 hover:scale-110 object-cover bg-white"
                        />
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl leading-tight text-yellow-400">
                            Sri Venkateswara University Hostel Mess Bill Maintenance System
                        </h1>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1"
                        >
                            Student Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1"
                        >
                            Register Now
                        </Link>
                        <a
                            href="http://127.0.0.1:8000/admin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1"
                        >
                            Admin Login
                        </a>
                        <Link
                            to="/staff-login"
                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1"
                        >
                            Staff Login
                        </Link>
                    </div>

                </div>
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-70">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </div>

            {/* Quick Navigation Section */}
            {
                user && user.is_staff_member && (
                    <section className="container mx-auto px-4 -mt-16 relative z-20">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Access (Admin Only)</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link to="/dashboard" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-blue-600 transition-colors group border border-gray-200">
                                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                                    <span className="font-semibold">Dashboard</span>
                                </Link>
                                <Link to="/attendance" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-green-600 transition-colors group border border-gray-200">
                                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📅</span>
                                    <span className="font-semibold">Attendance</span>
                                </Link>
                                <Link to="/manage-menu" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-orange-600 transition-colors group border border-gray-200">
                                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🍽️</span>
                                    <span className="font-semibold">Menu</span>
                                </Link>
                                <Link to="/manage-bills" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-purple-600 transition-colors group border border-gray-200">
                                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💳</span>
                                    <span className="font-semibold">Billing</span>
                                </Link>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Info Cards Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Students Love Us</h2>
                    <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 flex flex-col items-center text-center group hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            <div className="text-5xl mb-6 bg-gray-50 w-20 h-20 flex items-center justify-center rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-green-300/50">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div >
    );
};

export default Home;
