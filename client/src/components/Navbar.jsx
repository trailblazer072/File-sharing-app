import { Search, Sun, Moon, Menu, Cloud, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = ({ toggleTheme, onMenuClick, isDarkMode }) => {
    const { user, logout } = useAuth();
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    return (
        <header className="h-16 md:h-20 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 transition-colors duration-300 relative">
            {showMobileSearch ? (
                // Mobile Search Bar Overlay
                <div className="absolute inset-0 bg-white dark:bg-[#1e1e1e] flex items-center px-4 z-10 w-full animate-in fade-in slide-in-from-top-2 duration-200">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search in Drive..."
                        autoFocus
                        className="flex-1 bg-transparent border-none text-gray-700 dark:text-gray-200 focus:ring-0 text-base outline-none placeholder:text-gray-400"
                    />
                    <button
                        onClick={() => setShowMobileSearch(false)}
                        className="p-2 ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <>
                    {/* Mobile Menu & Logo */}
                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            onClick={onMenuClick}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-600 dark:text-gray-400"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <Cloud className="text-white" size={20} />
                            </div>
                            <span className="font-bold text-lg text-gray-800 dark:text-white">FileVault</span>
                        </div>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:block flex-1 max-w-2xl px-8">
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
                    <div className="flex items-center space-x-2 md:space-x-4">
                        {/* Mobile Search Trigger */}
                        <button
                            onClick={() => setShowMobileSearch(true)}
                            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 transition-colors"
                        >
                            <Search size={20} />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Profile Dropdown (Simplified) */}
                        <div className="relative group ml-2">
                            <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
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
                </>
            )}
        </header>
    );
};

export default Navbar;
