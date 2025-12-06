import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { useState } from 'react';

const DashboardLayout = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Simple counter to trigger refresh

    // Sync theme state with Sidebar/Navbar if needed, or rely on global class.
    // Navbar handles the toggle which updates document class.
    // We pass a handler to Navbar to update state here if we need it for context, 
    // but mostly we operate via document class.

    const toggleTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }
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
            <Sidebar onUploadClick={handleUploadClick} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Navbar toggleTheme={toggleTheme} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
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
