import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = ({ toggleTheme }) => {
    const { user, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(false);

    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
        toggleTheme(); // Call parent handler
    };

    return (
        <header className="h-20 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 transition-colors duration-300">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search in Drive"
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-[#2d2d2d] border-none rounded-xl text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1e1e1e] transition-all outline-none"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4 pl-4">
                <button
                    onClick={handleThemeToggle}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 transition-colors"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1e1e1e]"></span>
                </button>

                {/* Profile Dropdown (Simplified) */}
                <div className="relative group">
                    <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 hidden group-hover:block z-50">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
