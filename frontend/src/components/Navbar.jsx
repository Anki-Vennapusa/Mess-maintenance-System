import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import svuLogo from '../assets/logo.jpg';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
    const [isOpen, setIsOpen] = useState(false);

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
                            <span className="font-bold text-xl text-gray-900 hidden sm:block">SVU Hostels</span>
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

                    <div className="hidden md:flex items-center space-x-4">
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
                                    <span className="text-sm text-gray-500 hidden lg:block">
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

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:bg-gray-50 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                            Home
                        </Link>
                        {isAuthenticated && user && (
                            <>
                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-700 hover:bg-gray-50 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                                    Dashboard
                                </Link>
                                {!user.is_staff_member && (
                                    <>
                                        <Link to="/attendance" onClick={() => setIsOpen(false)} className="text-gray-700 hover:bg-gray-50 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                                            Attendance
                                        </Link>
                                        <Link to="/menu" onClick={() => setIsOpen(false)} className="text-gray-700 hover:bg-gray-50 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                                            Menu
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {!isAuthenticated ? (
                            <div className="flex items-center px-5 space-x-3">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-green-700 bg-green-50 hover:bg-green-100">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700">
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="px-5">
                                {user && (
                                    <div className="mb-3 flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium leading-none text-gray-800">{user.username}</div>
                                            <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user.email || 'Student'}</div>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-center px-4 py-2 border border-red-500 rounded-md shadow-sm text-base font-medium text-red-500 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
