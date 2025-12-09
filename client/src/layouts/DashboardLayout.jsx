import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { useEffect, useState } from 'react';

const DashboardLayout = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check local storage or system preference on initialization
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Simple counter to trigger refresh
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Apply theme class on mount and when state changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const handleUploadClick = () => {
        setIsUploadModalOpen(true);
    };

    const handleUploadSuccess = () => {
        // Trigger refresh in child components
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar onUploadClick={handleUploadClick} onClose={() => setIsSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Navbar toggleTheme={toggleTheme} onMenuClick={() => setIsSidebarOpen(true)} isDarkMode={isDarkMode} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet context={{ refreshTrigger }} />
                </main>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    );
};

export default DashboardLayout;
