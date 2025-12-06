import { Home, Share2, Clock, Star, Trash2, Cloud, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { icon: Home, label: 'My Drive', path: '/dashboard' },
    { icon: Share2, label: 'Shared with me', path: '/shared' },
    { icon: Clock, label: 'Recent', path: '/recent' },
    { icon: Star, label: 'Starred', path: '/starred' },
    { icon: Trash2, label: 'Trash', path: '/trash' },
];

const Sidebar = ({ onUploadClick }) => {
    return (
        <aside className="w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-colors duration-300">
            {/* Logo Area */}
            <div className="p-6 flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-lg">
                    <Cloud className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">CloudSpace</h1>
            </div>

            {/* New Button */}
            <div className="px-6 mb-6">
                <button
                    onClick={onUploadClick}
                    className="w-full py-3 px-4 bg-white dark:bg-[#2d2d2d] hover:bg-gray-50 dark:hover:bg-[#3d3d3d] text-gray-700 dark:text-gray-200 font-medium rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center space-x-2 transition-all hover:shadow-md"
                >
                    <Plus size={20} className="text-primary" />
                    <span>New Upload</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'} // Only exact match for dashboard home
                        className={({ isActive }) => `
                            flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                            ${isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]'
                            }
                        `}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Storage Status (Mock) */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Storage</span>
                    <span>7.5 GB / 15 GB</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '50%' }}></div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
