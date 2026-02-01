import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-blue-50 text-gray-900">
            <Navbar />
            <main className={isHomePage ? "w-full" : "container mx-auto px-4 py-8"}>
                <Outlet />
            </main>
        </div>
    );
}
