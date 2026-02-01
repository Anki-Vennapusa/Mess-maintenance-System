import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import svuBuilding from '../assets/svu_building.jpg';

export default function StaffLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/login/', {
                username,
                password,
                role: 'staff'
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            // navigate to dashboard immediately
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.non_field_errors) {
                alert(error.response.data.non_field_errors[0]);
            } else {
                alert('Login Failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${svuBuilding})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-emerald-600/60 mix-blend-multiply"></div>
                <div className="relative z-10 w-full flex flex-col justify-center px-12 text-white">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full w-fit">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide uppercas">Restricted Access</span>
                    </div>
                    <h2 className="text-5xl font-bold mb-6">Staff Portal</h2>
                    <p className="text-xl text-emerald-100 max-w-md">
                        Secure access for mess management staff. Oversee operations, attendance, and billing from one central hub.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border-t-4 border-emerald-500 border-x border-b border-gray-200">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Staff Login</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign in with your staff credentials
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm mt-1"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm mt-1 pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200`}
                            >
                                {loading ? 'Authenticating...' : 'Access Dashboard'}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/" className="text-sm text-emerald-600 hover:text-emerald-500 font-medium">
                                ← Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
