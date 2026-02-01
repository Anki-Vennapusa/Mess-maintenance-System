import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import svuLogo from '../assets/logo.jpg';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                setIsAuthenticated(true);
                try {
                    const response = await api.get('/me/');
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        checkAuth();
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img
                                src={svuLogo}
                                alt="SVU Mess"
                                className="h-10 w-auto rounded-full mr-2"
                            />

                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:ml-8 md:flex md:space-x-4">
                            <Link to="/" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition">
                                Home
                            </Link>

                            {/* Authenticated Links */}
                            {isAuthenticated && user && (
                                <>
                                    <Link to="/dashboard" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition">
                                        Dashboard
                                    </Link>


                                    {!user.is_staff_member && (
                                        <>
                                            <Link to="/attendance" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition">
                                                Attendance
                                            </Link>
                                            <Link to="/menu" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition">
                                                Menu
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition shadow-md">
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                {user && (
                                    <span className="text-sm text-gray-500 hidden md:block">
                                        Hi, <span className="font-semibold text-gray-900">{user.username}</span>
                                    </span>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-full text-sm font-medium transition"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
