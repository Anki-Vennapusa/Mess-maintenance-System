import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import svuBuilding from '../assets/svu_building.jpg';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '', password: '', email: '',
        is_student: true
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/register/', formData);
            alert('Registration Successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data
                ? Object.entries(error.response.data).map(([key, val]) => `${key}: ${val}`).join('\n')
                : 'Registration Failed. Please try again.';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${svuBuilding})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-600/60 mix-blend-multiply"></div>
                <div className="relative z-10 w-full flex flex-col justify-center px-12 text-white">
                    <h2 className="text-5xl font-bold mb-6">Join Us!</h2>
                    <p className="text-xl text-teal-100 max-w-md">
                        Create your account to start managing your mess activities, view daily menus, and track your expenses.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-200">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Create account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account? <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">Sign in</Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    name="username" type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm mt-1"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    name="email" type="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm mt-1"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm mt-1 pr-10"
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none mt-0.5"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200`}
                            >
                                {loading ? 'Creating Account...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
